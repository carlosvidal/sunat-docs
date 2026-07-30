# Gratuitas, ICBPER, ISC e IVAP

## Exonerada

Productos exonerados del IGV (la mayoría de alimentos frescos). Se marcan con
`tipAfeIgv: "20"`:

```json
{
  "tipoDoc": "01",
  "serie": "F001",
  "client": { "…": "…" },
  "details": [
    { "unidad": "NIU", "descripcion": "PRODUCTO GRAVADO", "cantidad": 1, "mtoValorUnitario": 100 },
    { "unidad": "KGM", "descripcion": "PRODUCTO EXONERADO", "cantidad": 2,
      "mtoValorUnitario": 50, "tipAfeIgv": "20" }
  ]
}
```

El servicio separa las bases: `mtoOperGravadas: 100`, `mtoOperExoneradas: 100`,
`mtoIGV: 18`. Cada una aparece como un `TaxSubtotal` distinto en el XML.

Lo mismo aplica a los **inafectos** con `tipAfeIgv: "30"`.

## Gratuita

Muestras, promociones o bonificaciones. El cliente no paga: el importe total es
**cero**, pero SUNAT igual quiere conocer el valor referencial y el IGV que se habría
pagado.

```json
{
  "details": [
    { "unidad": "NIU", "descripcion": "MUESTRA COMERCIAL", "cantidad": 2,
      "mtoValorGratuito": 100, "tipAfeIgv": "11" }
  ]
}
```

| Campo | Detalle |
| --- | --- |
| `mtoValorGratuito` | Valor referencial unitario (en lugar de `mtoValorUnitario`). |
| `tipAfeIgv` | `11` a `16` gravadas gratuitas, `21` exoneradas, `31` a `37` inafectas. |

El servicio calcula `mtoOperGratuitas` y `mtoIGVGratuitas`, deja `mtoImpVenta` en 0 y
agrega automáticamente la **leyenda 1002** ("TRANSFERENCIA GRATUITA…"), que SUNAT
exige.

::: warning No mezcles a la ligera
Puedes combinar líneas gratuitas y onerosas en una misma factura, pero las gratuitas
no suman al importe a pagar. Verifica que el total refleje solo lo cobrado.
:::

## ICBPER

Impuesto a las bolsas plásticas: un monto fijo por bolsa, no un porcentaje.

```json
{
  "details": [
    { "unidad": "NIU", "descripcion": "POLO ALGODON", "cantidad": 3, "mtoValorUnitario": 25.42 },
    { "unidad": "NIU", "descripcion": "BOLSA PLASTICA", "cantidad": 2,
      "mtoValorUnitario": 0.05, "factorIcbper": 0.5 }
  ]
}
```

`factorIcbper` es el monto vigente por bolsa; el servicio calcula
`icbper = cantidad × factor` y lo suma a los impuestos del comprobante.

::: info El factor cambia cada año
Lo fija SUNAT anualmente (S/ 0.50 en 2024). No está fijado en el código: lo envías tú,
así que actualízalo en tu catálogo cada enero.
:::

## ISC

Impuesto selectivo al consumo (bebidas, combustibles, vehículos). Se calcula **antes**
del IGV porque forma parte de su base imponible.

```json
{
  "details": [
    { "unidad": "NIU", "descripcion": "BEBIDA GASEOSA", "cantidad": 2,
      "mtoValorUnitario": 100, "tipSisIsc": "01", "porcentajeIsc": 17 }
  ]
}
```

Con valor unitario 100 y cantidad 2:

| Concepto | Cálculo | Importe |
| --- | --- | --- |
| Valor de venta | 2 × 100 | 200.00 |
| ISC | 17 % de 200 | 34.00 |
| Base del IGV | 200 + 34 | 234.00 |
| IGV | 18 % de 234 | 42.12 |
| **Total** | | **276.12** |

`tipSisIsc` indica el sistema de cálculo ([catálogo 08](/referencia/catalogos)):
`01` al valor, `02` valor según precio de venta al público, `03` sistema específico.

## IVAP

Impuesto a la venta de arroz pilado: reemplaza al IGV con una tasa del **4 %**. Se
declara con `tipAfeIgv: "17"`.

```json
{
  "details": [
    { "unidad": "NIU", "descripcion": "SACOS DE ARROZ", "cantidad": 900,
      "mtoValorUnitario": 100, "tipAfeIgv": "17", "porcentajeIgv": 4 }
  ]
}
```

El importe no va a `mtoOperGravadas` sino a `mtoBaseIvap` / `mtoIvap`, y en el XML usa
el tributo `1016` en lugar del `1000`.

::: warning
El IVAP es excluyente: una operación es de arroz pilado o es gravada con IGV, no
ambas. No mezcles `tipAfeIgv: "17"` con `"10"` en el mismo comprobante.
:::
