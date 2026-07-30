# Comunicación de baja

Deja sin efecto **facturas** (y notas que afectan facturas) que no debieron emitirse.

::: info Plazo
Hasta **7 días calendario** desde la emisión. Pasado ese plazo la baja ya no procede
y la corrección debe hacerse con una nota de crédito.
:::

## Cuándo usarla

| Situación | Instrumento |
| --- | --- |
| Factura emitida por error, la operación no existió | **Comunicación de baja** |
| La operación existió y se devuelve o corrige | [Nota de crédito](/comprobantes/notas) |
| Boleta emitida por error | Resumen diario con `estado: "3"` |

## Envío

```json
{
  "correlativo": "1",
  "fecGeneracion": "2026-07-29",
  "fecComunicacion": "2026-07-30",
  "details": [
    {
      "tipoDoc": "01",
      "serie": "F001",
      "correlativo": "1",
      "desMotivoBaja": "ERROR EN LOS CALCULOS"
    }
  ]
}
```

| Campo | Detalle |
| --- | --- |
| `fecGeneracion` | Fecha de emisión de los comprobantes que se dan de baja. |
| `fecComunicacion` | Fecha en que se comunica (hoy). |
| `correlativo` | Número de la comunicación dentro del día. |
| `desMotivoBaja` | Motivo, en texto libre. |

Un mismo envío puede dar de baja varios comprobantes, siempre que compartan la fecha
de emisión.

## Respuesta

```json
{ "sunatResponse": { "success": true, "ticket": "1785416448507" } }
```

Como el resumen, es asíncrona: consulta el ticket con
`GET /voided/status?ticket=…` o deja que el worker lo haga (`/voided/enqueue`).

## Después de la baja

El comprobante queda anulado ante SUNAT. Si necesitas volver a emitirlo, hazlo con un
**número nuevo**: los correlativos no se reutilizan.
