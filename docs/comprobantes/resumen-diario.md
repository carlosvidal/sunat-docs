# Resumen diario de boletas

Las boletas no se informan una por una: se declaran en un **resumen diario (RC)**.

::: info Plazo
El resumen del día se envía **al día siguiente**. SUNAT admite hasta 7 días, pero
más allá del primero el comprobante pierde efecto tributario.
:::

## Endpoints

| Método | Ruta |
| --- | --- |
| `POST` | `/summary/send` — envía y devuelve un `ticket` |
| `POST` | `/summary/enqueue` — encola (el worker consulta el ticket) |
| `POST` | `/summary/xml` — XML firmado, sin enviar |
| `GET` | `/summary/status?ticket=` — resultado del ticket |

## Envío

```json
{
  "correlativo": "1",
  "fecGeneracion": "2026-07-29",
  "fecResumen": "2026-07-30",
  "moneda": "PEN",
  "details": [
    {
      "tipoDoc": "03",
      "serieNro": "B001-1",
      "estado": "1",
      "clienteTipo": "1",
      "clienteNro": "46543212",
      "total": 90,
      "mtoOperGravadas": 76.27,
      "mtoIGV": 13.73
    }
  ]
}
```

| Campo | Detalle |
| --- | --- |
| `fecGeneracion` | Día de las boletas resumidas. |
| `fecResumen` | Día en que se envía el resumen. |
| `correlativo` | Número del resumen dentro del día (`1`, `2`, …). |
| `estado` | `1` adicionar, `2` modificar, `3` anular. |

::: danger fecResumen y el nombre del archivo
El identificador del resumen (`RC-AAAAMMDD-###`) se arma con **`fecResumen`**. Si no
coincide con la fecha de generación declarada, SUNAT rechaza con el código `2346`.
:::

## Respuesta

```json
{
  "summaryId": "…",
  "hash": "…",
  "sunatResponse": { "success": true, "ticket": "1785432486195" }
}
```

El resumen no se acepta al instante: SUNAT devuelve un **ticket** que hay que
consultar después.

```bash
curl "$API/summary/status?ticket=1785432486195" -H "authorization: Bearer $TOKEN"
```

Con `/summary/enqueue` el worker hace esa consulta por ti y te avisa por webhook.

## Anular boletas

Las boletas no se dan de baja con una comunicación: se anulan **en el resumen**, con
`estado: "3"`.

```json
{ "tipoDoc": "03", "serieNro": "B001-5", "estado": "3", "total": 118, "mtoOperGravadas": 100, "mtoIGV": 18 }
```

## Notas que afectan boletas

Se informan en el mismo resumen, con `docReferencia`:

```json
{
  "tipoDoc": "07",
  "serieNro": "BB01-1",
  "estado": "1",
  "clienteTipo": "1",
  "clienteNro": "46543212",
  "docReferencia": { "tipoDoc": "03", "nroDoc": "B001-1" },
  "total": 50,
  "mtoOperGravadas": 42.37,
  "mtoIGV": 7.63
}
```

## Otras monedas

Un resumen agrupa boletas de **una sola moneda** (campo `moneda`). Si el día tuvo
boletas en soles y en dólares, envía dos resúmenes con correlativos distintos.

::: warning En BETA no verás el resultado
La consulta de tickets está caída en el ambiente de pruebas de SUNAT: el resumen se
acepta pero queda en `EN_COLA_SUNAT`. Ver [Errores frecuentes](/referencia/errores).
:::
