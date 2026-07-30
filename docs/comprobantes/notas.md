# Notas de crédito y débito

Modifican un comprobante ya emitido y **aceptado**.

| Nota | `tipoDoc` | Efecto |
| --- | --- | --- |
| Crédito | `07` | Anula o disminuye (devoluciones, descuentos, errores). |
| Débito | `08` | Aumenta (intereses, penalidades, gastos). |

## Endpoints

`/note/send`, `/note/enqueue`, `/note/xml`, `/note/pdf` — mismo comportamiento que
factura y boleta.

## Nota de crédito

```json
{
  "tipoDoc": "07",
  "serie": "FC01",
  "tipDocAfectado": "01",
  "numDocfectado": "F001-1",
  "codMotivo": "01",
  "desMotivo": "ANULACION DE LA OPERACION",
  "tipoMoneda": "PEN",
  "client": { "tipoDoc": "6", "numDoc": "20000000002", "rznSocial": "CLIENTE S.A.C." },
  "details": [
    { "codProducto": "P001", "unidad": "NIU", "descripcion": "PRODUCTO 1",
      "cantidad": 1, "mtoValorUnitario": 1000 }
  ]
}
```

| Campo | Obligatorio | Detalle |
| --- | --- | --- |
| `tipDocAfectado` | sí | Tipo del comprobante modificado: `01` o `03`. |
| `numDocfectado` | sí | Su serie y número: `F001-1`. Nótese la ortografía del campo. |
| `codMotivo` | sí | [Catálogo 09](/referencia/catalogos#catalogo-09-nota-de-credito) para crédito, [10](/referencia/catalogos#catalogo-10-nota-de-debito) para débito. |
| `desMotivo` | sí | Texto libre que explica el motivo. |

::: warning La serie debe corresponder
La nota que afecta una **factura** usa serie que empieza con `F`; la que afecta una
**boleta**, con `B`. SUNAT rechaza la combinación cruzada.
:::

## Nota de débito

```json
{
  "tipoDoc": "08",
  "serie": "FD01",
  "tipDocAfectado": "01",
  "numDocfectado": "F001-1",
  "codMotivo": "01",
  "desMotivo": "INTERESES POR MORA",
  "tipoMoneda": "PEN",
  "client": { "…": "…" },
  "details": [
    { "unidad": "ZZ", "descripcion": "INTERES POR MORA", "cantidad": 1, "mtoValorUnitario": 50 }
  ]
}
```

## Notas sobre boletas

Se emiten igual, con `tipDocAfectado: "03"` y serie `B`:

```json
{
  "tipoDoc": "07",
  "serie": "BB01",
  "tipDocAfectado": "03",
  "numDocfectado": "B001-12",
  "codMotivo": "01",
  "desMotivo": "ANULACION DE LA OPERACION",
  "client": { "tipoDoc": "1", "numDoc": "46543212", "rznSocial": "JUAN PEREZ" },
  "details": [ { "…": "…" } ]
}
```

::: tip Además, van en el resumen diario
Las notas que afectan boletas **también** deben informarse en el
[resumen diario](/comprobantes/resumen-diario), incluyendo el campo `docReferencia`
con la boleta afectada.
:::

## Anular una factura

Para dejar sin efecto una factura hay dos caminos, y no son intercambiables:

| Situación | Qué usar |
| --- | --- |
| La operación no se realizó | **Comunicación de baja** (hasta 7 días). |
| La operación existió pero se devuelve o corrige | **Nota de crédito**. |

Ver [Comunicación de baja](/comprobantes/comunicacion-baja).
