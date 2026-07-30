# Emisión asíncrona y webhooks

SUNAT tarda entre 2 y 15 segundos por comprobante, y a veces no responde. Si tu punto
de venta espera esa respuesta, la caja se detiene cuando SUNAT se cae.

## Dos modos

| | `/send` | `/enqueue` |
| --- | --- | --- |
| Respuesta | La CDR de SUNAT | `202` con un `jobId` |
| Tiempo | 2–15 s | milisegundos |
| Si SUNAT falla | Devuelve el error | Reintenta solo |
| Resultado | En la respuesta | Por webhook |

Regla práctica: **el mostrador usa `/enqueue`**, los procesos donde alguien espera la
CDR (facturación mensual, integraciones B2B) usan `/send`.

## Encolar

```bash
curl -X POST $API/invoice/enqueue \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d @factura.json
```

```json
{ "jobId": "1", "state": "EN_COLA_SUNAT" }
```

El comprobante ya tiene correlativo reservado y XML firmado; lo único pendiente es la
respuesta de SUNAT.

::: tip Requiere Redis
Sin `REDIS_URL`, `/enqueue` responde `501`. Y recuerda levantar el worker
(`pnpm start:worker`): sin él los trabajos se acumulan sin procesarse.
:::

## Reintentos

El worker reintenta con espera creciente: **1 minuto, 5 minutos y 15 minutos**
(4 intentos en total).

No todo se reintenta:

| Situación | ¿Reintenta? | Por qué |
| --- | --- | --- |
| Timeout o SUNAT caído | Sí | El comprobante es válido; el servicio no estaba. |
| Error `0100`–`1999` | Sí | Credenciales o disponibilidad. |
| Rechazo `2000`–`3999` | **No** | El XML es inválido: reintentarlo da el mismo rechazo. Hay que corregir y reemitir. |

## Webhooks

Al terminar, el worker notifica a `webhook_url`:

```json
{
  "event": "cpe.aceptado",
  "tenant_id": "tienda-123",
  "ruc": "20000000001",
  "document_id": "40001615-8219-448c-b674-dd1f6ba8c8bf",
  "comprobante": "20000000001-01-F001-1",
  "state": "ACEPTADO",
  "code": "0",
  "description": "La Factura numero F001-1, ha sido aceptada"
}
```

Eventos: `cpe.aceptado`, `cpe.rechazado`, `cpe.excepcion`, `resumen.procesado`.

### Verificar la firma

El cuerpo va firmado con HMAC-SHA256 en la cabecera `X-Signature`:

```js
import { createHmac, timingSafeEqual } from 'node:crypto';

function firmaValida(cuerpoCrudo, firmaRecibida, secreto) {
  const esperada = createHmac('sha256', secreto).update(cuerpoCrudo).digest('hex');
  const a = Buffer.from(esperada, 'hex');
  const b = Buffer.from(firmaRecibida ?? '', 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}
```

::: warning
Firma sobre el **cuerpo crudo**, antes de parsear el JSON. Si lo parseas y vuelves a
serializar, el orden de las claves puede cambiar y la firma no coincidirá.
:::

### Buenas prácticas

- Responde `2xx` rápido y procesa después: si tu webhook demora, el envío se marca
  como fallido.
- Hazlo idempotente por `document_id`: un reintento puede notificar dos veces.
- El webhook es una comodidad, no la fuente de verdad. Si no llega, consulta
  `GET /documents/{id}`.

## Tickets: resumen, baja y guía

Estos documentos son asíncronos **en SUNAT**: el envío devuelve un `ticket` y el
resultado se consulta después. El worker lo hace por ti (primera consulta al minuto y
luego cada dos), pero también puedes preguntar directamente:

```bash
curl "$API/summary/status?ticket=1785432486195" -H "authorization: Bearer $TOKEN"
```

Si `procesando` es `true`, SUNAT aún no termina.
