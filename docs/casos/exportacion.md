# Exportación, moneda extranjera y contingencia

## Exportación

Las exportaciones no gravan IGV. Se marcan con `tipAfeIgv: "40"` y
`tipoOperacion: "0200"`:

```json
{
  "tipoDoc": "01",
  "serie": "F001",
  "tipoOperacion": "0200",
  "tipoMoneda": "USD",
  "client": {
    "tipoDoc": "0",
    "numDoc": "00000000",
    "rznSocial": "FOREIGN COMPANY LLC",
    "address": { "direccion": "123 MAIN ST, MIAMI", "codigoPais": "US" }
  },
  "details": [
    { "unidad": "NIU", "descripcion": "ARTESANIA EXPORTACION", "cantidad": 10,
      "mtoValorUnitario": 50, "tipAfeIgv": "40" }
  ]
}
```

| Detalle | Por qué |
| --- | --- |
| `tipoOperacion: "0200"` | Identifica la operación como exportación. |
| `tipAfeIgv: "40"` | La línea va a `mtoOperExportacion`, sin IGV. |
| `client.tipoDoc: "0"` | El cliente del exterior no tiene documento peruano. |
| `address.codigoPais` | Código ISO del país de destino. |

## Moneda extranjera

Cualquier comprobante puede emitirse en otra moneda con `tipoMoneda` (`USD`, `EUR`).
Todos los importes van en esa moneda y la leyenda del monto en letras se genera
automáticamente en la denominación correcta.

```json
{ "tipoMoneda": "USD", "details": [ { "…": "…" } ] }
```

::: info El tipo de cambio
SUNAT no exige el tipo de cambio en la factura: lo toma de su propia tabla según la
fecha de emisión. Solo se declara explícitamente en los comprobantes de retención y
percepción, donde los importes deben expresarse en soles.
:::

## Contingencia

Comprobantes emitidos cuando no había conexión, en formato preimpreso, y que se
informan después. Se emiten con la **serie del talonario físico** (numérica):

```json
{
  "tipoDoc": "01",
  "serie": "0001",
  "fechaEmision": "2026-07-28T10:00:00-05:00",
  "client": { "…": "…" },
  "details": [ { "…": "…" } ]
}
```

La `fechaEmision` es la del día en que realmente se emitió el comprobante físico, no
la del envío.

Las **boletas** en contingencia se informan por el
[resumen diario](/comprobantes/resumen-diario), usando su serie numérica en
`serieNro`:

```json
{
  "details": [
    { "tipoDoc": "03", "serieNro": "0001-1", "estado": "1", "total": 23.6,
      "mtoOperGravadas": 20, "mtoIGV": 3.6 }
  ]
}
```

::: warning Plazos
La contingencia tiene plazos de regularización definidos por SUNAT según el tipo de
comprobante. Emitir tarde no genera rechazo automático, pero sí observaciones y
posibles sanciones.
:::
