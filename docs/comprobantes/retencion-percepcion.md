# Retención y percepción

Comprobantes que solo emiten las empresas **designadas por SUNAT** como agentes de
retención o de percepción.

| | Retención (`20`) | Percepción (`40`) |
| --- | --- | --- |
| Quién lo emite | El **cliente** al pagar a su proveedor | El **vendedor** al cobrar |
| Qué hace | Retiene un % del pago y lo entrega a SUNAT | Cobra un % adicional |
| Tasa típica | 3 % | 2 % |
| Serie | `R###` | `P###` |

::: warning Requiere designación
Si tu empresa no está designada como agente, SUNAT rechazará estos comprobantes. La
condición se consulta en el portal SOL.
:::

## Endpoints

`/retention/{send,enqueue,xml,pdf}` y `/perception/{send,enqueue,xml,pdf}`.

Se transmiten por el web service de **otros comprobantes**, distinto al de facturas;
el servicio lo maneja internamente.

## Retención

```json
{
  "serie": "R001",
  "proveedor": {
    "tipoDoc": "6",
    "numDoc": "20000000002",
    "rznSocial": "PROVEEDOR S.A.C."
  },
  "regimen": "01",
  "tasa": 3,
  "impRetenido": 10,
  "impPagado": 200,
  "observacion": "RETENCION IGV",
  "details": [
    {
      "tipoDoc": "01",
      "numDoc": "F001-1",
      "fechaEmision": "2026-07-20",
      "moneda": "PEN",
      "impTotal": 210,
      "fechaRetencion": "2026-07-29",
      "impRetenido": 10,
      "impPagar": 200,
      "pagos": [{ "moneda": "PEN", "importe": 200, "fecha": "2026-07-29" }]
    }
  ]
}
```

| Campo | Detalle |
| --- | --- |
| `regimen` | Régimen de retención ([catálogo 23](/referencia/catalogos#catalogo-23-regimen-de-retencion)). `01` = tasa 3 %. |
| `impRetenido` | Total retenido en el comprobante, **siempre en soles**. |
| `impPagado` | Total pagado al proveedor tras la retención. |
| `details[].impPagar` | Neto pagado por ese documento. |
| `details[].pagos` | Pagos parciales; opcional. |

## Percepción

```json
{
  "serie": "P001",
  "proveedor": { "tipoDoc": "6", "numDoc": "20000000002", "rznSocial": "CLIENTE S.A.C." },
  "regimen": "01",
  "tasa": 2,
  "impPercibido": 4,
  "impCobrado": 204,
  "details": [
    {
      "tipoDoc": "01",
      "numDoc": "F001-2",
      "fechaEmision": "2026-07-20",
      "moneda": "PEN",
      "impTotal": 200,
      "fechaPercepcion": "2026-07-29",
      "impPercibido": 4,
      "impCobrar": 204,
      "cobros": [{ "moneda": "PEN", "importe": 204, "fecha": "2026-07-29" }]
    }
  ]
}
```

`regimen` sigue el [catálogo 22](/referencia/catalogos#catalogo-22-regimen-de-percepcion):
`01` venta interna (2 %), `02` adquisición de combustible, `03` importación.

## Moneda extranjera

Los importes retenidos o percibidos **siempre se declaran en soles**, aunque el
documento de origen esté en otra moneda. Para eso se envía el tipo de cambio:

```json
{
  "tipoDoc": "01",
  "numDoc": "F001-9",
  "moneda": "USD",
  "impTotal": 60,
  "fechaRetencion": "2026-07-29",
  "impRetenido": 6.75,
  "impPagar": 218.25,
  "tipoCambio": {
    "monedaRef": "USD",
    "monedaObj": "PEN",
    "factor": 3.751,
    "fecha": "2026-07-29"
  }
}
```

## Percepción dentro de una factura

Distinto de este comprobante: cuando la percepción se aplica **en la propia factura**,
se declara en el campo `perception` de la factura. Ver
[Detracción y percepción](/casos/detraccion-percepcion).
