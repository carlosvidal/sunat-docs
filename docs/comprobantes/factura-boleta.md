# Factura y boleta

Ambas se emiten por el mismo endpoint; lo único que cambia es `tipoDoc`.

| Comprobante | `tipoDoc` | Serie | Cuándo se usa |
| --- | --- | --- | --- |
| Factura | `01` | `F###` | Cliente con RUC, sustenta crédito fiscal. |
| Boleta | `03` | `B###` | Consumidor final. |

## Endpoints

| Método | Ruta | Qué hace |
| --- | --- | --- |
| `POST` | `/invoice/send` | Emite y devuelve la CDR. |
| `POST` | `/invoice/enqueue` | Encola y devuelve un `jobId`. |
| `POST` | `/invoice/xml` | Devuelve el XML firmado, sin enviar. |
| `POST` | `/invoice/pdf` | Devuelve el PDF (`?formato=a4` o `ticket`). |
| `GET` | `/invoice/status` | Consulta el estado en SUNAT. |

## Lo mínimo

```json
{
  "tipoDoc": "01",
  "serie": "F001",
  "client": {
    "tipoDoc": "6",
    "numDoc": "20000000002",
    "rznSocial": "CLIENTE S.A.C."
  },
  "details": [
    { "codProducto": "P001", "unidad": "NIU", "descripcion": "PRODUCTO 1",
      "cantidad": 2, "mtoValorUnitario": 100 }
  ]
}
```

Con eso el servicio calcula: valor de venta por línea, IGV (18 % por defecto), totales
por tipo de operación, importe total, precio unitario y la leyenda del monto en letras.
También reserva el correlativo y pone la fecha de emisión del día.

## Lo que puedes controlar

```json
{
  "tipoDoc": "01",
  "serie": "F001",
  "correlativo": "453",
  "fechaEmision": "2026-07-30T10:15:00-05:00",
  "fecVencimiento": "2026-08-30",
  "tipoMoneda": "PEN",
  "tipoOperacion": "0101",
  "formaPago": { "moneda": "PEN", "tipo": "Contado" },
  "compra": "OC-2026-0088",
  "observacion": "Entrega en almacén central",
  "client": { "…": "…" },
  "details": [ { "…": "…" } ]
}
```

| Campo | Si lo omites |
| --- | --- |
| `correlativo` | Se reserva el siguiente de la serie, de forma atómica. |
| `fechaEmision` | Hoy, en hora de Perú. |
| `tipoMoneda` | `PEN`. |
| `tipoOperacion` | `0101` (venta interna). |
| Totales (`mtoIGV`, `mtoImpVenta`, …) | Se calculan desde los ítems. |
| `legends` | Se agrega la leyenda `1000` con el monto en letras. |

::: tip Cuándo enviar los totales
Si tu sistema ya los calcula, envíalos: el servicio **nunca sobrescribe** un valor
que enviaste explícitamente. Solo verifica que sean coherentes con los ítems y avisa
antes de gastar una llamada a SUNAT.
:::

## El cliente

```json
{
  "tipoDoc": "6",
  "numDoc": "20000000002",
  "rznSocial": "CLIENTE S.A.C.",
  "address": { "direccion": "AV. CLIENTE 123", "ubigueo": "150101" },
  "email": "cliente@empresa.pe"
}
```

`tipoDoc` sigue el [catálogo 06](/referencia/catalogos#catalogo-06-documento-de-identidad):
`6` RUC, `1` DNI, `4` carné de extranjería, `7` pasaporte, `0` sin documento.

::: warning Boletas y el DNI
En una boleta puedes usar `"tipoDoc": "0"`, `"numDoc": "00000000"` y
`"rznSocial": "CLIENTE VARIOS"` cuando el importe es menor a S/ 700. Por encima de
ese monto SUNAT exige identificar al cliente con DNI.
:::

## Los ítems

```json
{
  "codProducto": "P001",
  "codProdSunat": "50161509",
  "unidad": "NIU",
  "descripcion": "PRODUCTO 1",
  "cantidad": 2,
  "mtoValorUnitario": 100,
  "tipAfeIgv": "10",
  "porcentajeIgv": 18
}
```

| Campo | Detalle |
| --- | --- |
| `unidad` | Unidad de medida (tabla 6): `NIU` bienes, `ZZ` servicios, `KGM` kilos. |
| `mtoValorUnitario` | Valor **sin** IGV. |
| `tipAfeIgv` | Tipo de afectación ([catálogo 07](/referencia/catalogos#catalogo-07-tipo-de-afectacion-del-igv)): `10` gravado, `20` exonerado, `30` inafecto, `40` exportación. |
| `codProdSunat` | Código del producto en el catálogo de SUNAT. Opcional pero recomendado. |
| `descuento` | Descuento del ítem, en importe. |

El precio unitario con IGV (`mtoPrecioUnitario`) se calcula solo; si lo envías, manda.

## Consultar después

```bash
curl "$API/invoice/status?tipo=01&serie=F001&numero=453" \
  -H "authorization: Bearer $TOKEN"
```

Devuelve la CDR consultada en SUNAT y el estado registrado localmente.

## Casos particulares

Detracción, anticipos, descuentos globales, gratuitas, ICBPER, ISC, IVAP, exportación
y contingencia tienen su propia sección: [Casos de uso](/casos/).
