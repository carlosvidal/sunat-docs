# Errores frecuentes

Códigos que aparecen en la práctica, qué significan y cómo se corrigen.

## Configuración y credenciales

### `0102` · Usuario o contraseña incorrectos

El usuario SOL no es válido. Recuerda que se envía como `RUC + usuario`
(el servicio lo arma solo, tú registras solo el usuario secundario).

### `0111` · No tiene el perfil para enviar comprobantes electrónicos

El usuario SOL existe pero **no tiene el permiso de envío**, o la empresa no está
afecta a emisión electrónica. También aparece si apuntas a producción con credenciales
de prueba.

### `0130` / `0151` · El archivo ZIP está vacío o no contiene comprobantes

Problema de empaquetado. Si lo ves, es un defecto del servicio: repórtalo.

### `0306` · No se puede parsear el archivo XML

La estructura no cumple el esquema de SUNAT. El detalle del error indica el elemento
exacto:

```
found <cac:SellerSupplierParty>, but next item should be AgentParty
```

Es un error del generador, no del payload.

## Rechazos del comprobante

### `2335` · El dato ingresado no cumple con el formato

Algún campo tiene un formato inválido: RUC con menos de 11 dígitos, fecha mal armada,
importe con más decimales de los permitidos.

### `2346` · La fecha de generación del resumen no coincide con el nombre del archivo

El identificador del resumen (`RC-AAAAMMDD-###`) se arma con **`fecResumen`**, no con
`fecGeneracion`. Envía ambas fechas correctamente:

```json
{ "fecGeneracion": "2026-07-29", "fecResumen": "2026-07-30" }
```

### `2798` · El monto de percepción no tiene el valor correcto

En el bloque `perception`, el campo `porcentaje` es un **factor**: `0.02` para 2 %.
SUNAT valida que `porcentaje × mtoBase = mto`.

### `1033` / `2017` · El comprobante ya fue informado

Ese número ya existe en SUNAT. Revisa el último correlativo emitido y sincroniza tu
contador. Ver [Pasar a producción](/guia/produccion#migrar-los-correlativos).

### `3105` · El comprobante fue informado con otros datos

Reenviaste el mismo número con contenido distinto. Si necesitas corregir, emite una
nota de crédito o comunica la baja.

## Errores de transporte

### `503` · No se pudo contactar a SUNAT

Timeout o servicio caído. El comprobante queda en `EXCEPCION` y es **reintentable**;
si usas la cola, el worker lo reintenta solo.

### `401 Authorization Required` en BETA

El ambiente de pruebas devuelve `401` de forma intermitente en envíos perfectamente
válidos. Reintentar suele bastar. No ocurre en producción.

### Los tickets no responden en BETA

```
Fault Server.200 — Failed to establish a backside connection
```

La consulta de tickets (`getStatus`) está caída del lado de SUNAT en el ambiente de
pruebas. Resúmenes, bajas y guías quedan en `EN_COLA_SUNAT` aunque el envío haya sido
aceptado. En producción funciona con normalidad.

## Errores del servicio (antes de llegar a SUNAT)

### `400` · Payload inválido

Falta un campo obligatorio o tiene el tipo equivocado. La respuesta indica cuál:

```json
{
  "code": 400,
  "message": "Payload inválido",
  "errors": [{ "campo": "client.numDoc", "mensaje": "Required" }]
}
```

### `400` · La suma de los ítems no coincide con los totales

Enviaste totales que no cuadran con las líneas. El servicio ya descuenta lo que
descuentos globales, cargos y anticipos pueden explicar; si aun así no cuadra, revisa
tus cálculos. La alternativa es **no enviar los totales** y dejar que se calculen.

### `409` · El comprobante ya fue registrado con esa serie y correlativo

Ese número ya existe en la base local. Consulta el documento existente antes de
reemitir.

### `422` · SUNAT rechazó el comprobante

El cuerpo trae el código y el mensaje de SUNAT. Busca el código en esta página.

## Cómo diagnosticar

1. Abre el comprobante en el [backoffice](/guia/backoffice): verás la respuesta de
   SUNAT, el último error y **el payload original**.
2. Descarga el XML y revisa el elemento que menciona el error.
3. Reproduce con `/invoice/xml` (no envía nada a SUNAT ni consume correlativo).
4. Corregido el payload, usa **Reintentar envío** si el comprobante era reintentable,
   o emite uno nuevo si fue rechazado.
