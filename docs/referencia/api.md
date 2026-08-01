# API HTTP

Base: `/api/v1`. La referencia interactiva y siempre actualizada está en **`/docs`**
(Swagger UI), generada desde los mismos esquemas que validan las peticiones.

## Autenticación

| Ámbito | Cabecera | Para qué |
| --- | --- | --- |
| Plataforma | `X-API-Key: <MASTER_API_KEY>` | Administrar empresas y backoffice. |
| Empresa | `Authorization: Bearer <token>` | Emitir y consultar comprobantes. |

## Empresas · `X-API-Key`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/companies` | Alta o actualización (idempotente por `tenant_id`). |
| `GET` | `/companies` | Listado. |
| `GET` | `/companies/{tenantId}` | Detalle, con vigencia del certificado. |
| `POST` | `/companies/{tenantId}/token` | Reemitir el token de emisión. |
| `DELETE` | `/companies/{tenantId}` | Baja. |
| `POST` | `/companies/certificate/inspect` | Validar un certificado sin guardarlo. |
| `POST` | `/companies/certificate/free` | Certificado autofirmado para BETA. |

## Comprobantes · `Bearer`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/invoice/send` · `/note/send` | Emitir y devolver la CDR. |
| `POST` | `/invoice/enqueue` · `/note/enqueue` | Encolar. |
| `POST` | `/invoice/xml` · `/note/xml` | XML firmado, sin enviar. |
| `POST` | `/invoice/pdf` · `/note/pdf` | PDF (`?formato=a4\|ticket`). |
| `GET` | `/invoice/status` | Estado en SUNAT (`tipo`, `serie`, `numero`). |
| `POST` | `/summary/send` · `/voided/send` | Resumen diario y baja; devuelven `ticket`. |
| `GET` | `/summary/status` · `/voided/status` | Resultado del ticket. |
| `POST` | `/retention/send` · `/perception/send` | Retención y percepción. |
| `POST` | `/despatch/send` | Guía de remisión. |
| `GET` | `/despatch/status` | Resultado del ticket de la guía. |

Todos los grupos aceptan además `/xml`, `/pdf` y `/enqueue` según corresponda.

### Evitar comprobantes duplicados: `Idempotency-Key`

`POST /invoice/send` y `POST /note/send` aceptan la cabecera `Idempotency-Key`: una
clave única que genera el cliente, normalmente un UUID, de hasta 64 caracteres.

Sirve para el caso en que la petición sale pero la respuesta se pierde —red móvil
inestable, timeout, proceso que muere a mitad—. Sin la cabecera, reintentar emite un
segundo comprobante con otro correlativo. Con ella, el reintento devuelve el resultado
de la primera llamada:

```bash
curl -X POST https://tu-servicio/api/v1/invoice/send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Idempotency-Key: 9f2c8b1e-5d3a-4c7f-9e10-2a6b4d8c0f31" \
  -H 'Content-Type: application/json' \
  -d @boleta.json
```

| Situación | Respuesta |
| --- | --- |
| Primera llamada | `200` con la CDR, como siempre. |
| Reintento de algo ya emitido | `200` con el mismo resultado y la cabecera `Idempotent-Replay: true`. |
| Hay una emisión en curso con esa clave | `409` con `documentId`, `serie`, `correlativo` y `state`. |

El `409` no es un error definitivo: significa que otra petición con la misma clave
sigue en vuelo, o que un intento anterior quedó a medias. Consulta
`GET /invoice/status` con la serie y el correlativo que devuelve el `409` para saber
si SUNAT llegó a recibirlo, en vez de reintentar a ciegas.

La clave es **única por empresa**: dos empresas pueden usar la misma sin colisionar.
La cabecera es opcional y quien no la envía sigue funcionando igual que antes, pero
sin protección contra duplicados.

::: tip Recomendado para clientes móviles
Genera la clave **antes** del primer intento y reutilízala en todos los reintentos de
esa misma venta. Si generas una clave nueva por intento, la protección no sirve de nada.
:::

## Documentos · `Bearer`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/documents` | Histórico con filtros `state`, `desde`, `hasta`, `limit`, `offset`. |
| `GET` | `/documents/{id}` | Detalle. |
| `GET` | `/documents/{id}/xml` · `/cdr` · `/pdf` | Descarga del artefacto. |

## Backoffice · `X-API-Key`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/admin/overview` | Totales por estado y tipo, errores recientes, empresas. |
| `GET` | `/admin/documents` | Búsqueda transversal a todas las empresas. |
| `GET` | `/admin/documents/{id}` | Detalle con el payload original. |
| `POST` | `/admin/documents/{id}/retry` | Reintentar el envío (`?async=true` para encolar). |
| `GET` | `/admin/queue` | Estado de la cola y trabajos fallidos. |
| `POST` | `/admin/queue/jobs/{jobId}/retry` | Reencolar un trabajo. |

## Ejemplos · público

| Método | Ruta |
| --- | --- |
| `GET` | `/examples` |
| `GET` | `/examples/{nombre}` |

## Códigos de respuesta

| Código | Significado |
| --- | --- |
| `200` | Procesado. Revisa `state` y `sunatResponse`. |
| `202` | Encolado. |
| `400` | Payload inválido o totales incoherentes. |
| `401` | Falta el token o la clave maestra, o son inválidos. |
| `404` | No existe, o pertenece a otra empresa. |
| `409` | Serie y correlativo ya registrados, o hay una emisión en curso con esa `Idempotency-Key`. |
| `422` | SUNAT rechazó el comprobante. |
| `501` | Función no habilitada (por ejemplo, la cola sin Redis). |
| `503` | SUNAT no disponible; reintentable. |

## Generar un cliente

```bash
curl http://localhost:3000/docs/json -o openapi.json
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json -g typescript-fetch -o ./cliente-sunat
```
