# Detracción y percepción

## Detracción

En operaciones sujetas al SPOT, el cliente no paga el total al proveedor: deposita un
porcentaje en la cuenta de detracciones del Banco de la Nación.

```json
{
  "tipoDoc": "01",
  "serie": "F001",
  "tipoOperacion": "1001",
  "tipoMoneda": "PEN",
  "client": { "…": "…" },
  "detraccion": {
    "codBienDetraccion": "014",
    "codMedioPago": "001",
    "ctaBanco": "00047-3342343243",
    "percent": 4,
    "mount": 37.76
  },
  "details": [
    { "unidad": "ZZ", "descripcion": "SERVICIO DE TRANSPORTE", "cantidad": 4,
      "mtoValorUnitario": 200 }
  ]
}
```

| Campo | Detalle |
| --- | --- |
| `tipoOperacion` | **`1001`**. Es lo que le dice a SUNAT que la operación está sujeta a detracción. |
| `codBienDetraccion` | Bien o servicio del [catálogo 54](/referencia/catalogos). `014` = servicio de transporte de carga. |
| `codMedioPago` | Medio de pago del [catálogo 59](/referencia/catalogos). `001` = depósito en cuenta. |
| `ctaBanco` | Cuenta de detracciones del proveedor en el Banco de la Nación. |
| `percent` | Porcentaje de detracción del bien o servicio. |
| `mount` | Importe a detraer, **en soles**. |

::: warning El tipoOperacion es obligatorio
Sin `"tipoOperacion": "1001"` el bloque `detraccion` viaja en el XML pero SUNAT no
trata la operación como detraída. Es el error más común de este caso.
:::

::: tip Leyenda recomendada
Muchos contribuyentes agregan la leyenda `2006` ("OPERACIÓN SUJETA A DETRACCIÓN") para
que aparezca en el PDF. Puedes enviarla en `legends`; no reemplaza al `tipoOperacion`.
:::

## Percepción

Cuando el vendedor es agente de percepción, cobra un porcentaje adicional que declara
**en la propia factura**:

```json
{
  "tipoDoc": "01",
  "serie": "F001",
  "tipoOperacion": "2001",
  "perception": {
    "codReg": "51",
    "porcentaje": 0.02,
    "mtoBase": 200,
    "mto": 4,
    "mtoTotal": 204
  },
  "legends": [
    { "code": "2000", "value": "COMPROBANTE DE PERCEPCIÓN" }
  ],
  "details": [ { "…": "…" } ]
}
```

| Campo | Detalle |
| --- | --- |
| `tipoOperacion` | `2001` (percepción venta interna), `2002`, `2003` según el régimen. |
| `codReg` | Código del régimen de percepción. |
| `porcentaje` | **Factor, no porcentaje**: `0.02` equivale al 2 %. |
| `mtoBase` | Base sobre la que se calcula. |
| `mto` | Importe percibido. |
| `mtoTotal` | Total a cobrar, percepción incluida. |

::: danger El campo `porcentaje` es un factor
Si envías `2` en lugar de `0.02`, SUNAT rechaza con el código **2798** ("El monto de
percepción no tiene el valor correcto según el tipo de percepción"), porque valida
que `porcentaje × mtoBase = mto`.
:::

Nótese que `mtoImpVenta` sigue siendo el importe de la venta; la percepción se informa
aparte y el cliente paga `mtoTotal`.

## ¿Factura con percepción o comprobante de percepción?

| Necesitas | Usa |
| --- | --- |
| Cobrar la percepción junto con la venta | El campo `perception` de la factura (esta página). |
| Emitir el comprobante de percepción como documento independiente | [Comprobante de percepción (40)](/comprobantes/retencion-percepcion). |
