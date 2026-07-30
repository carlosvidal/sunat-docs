# Descuentos, cargos y anticipos

## Descuento por línea

Rebaja aplicada a un ítem. Va dentro del propio detalle:

```json
{
  "details": [
    {
      "unidad": "NIU", "descripcion": "PRODUCTO 1", "cantidad": 1, "mtoValorUnitario": 20,
      "descuentos": [
        { "codTipo": "00", "factor": 0.2, "monto": 4, "montoBase": 20 }
      ],
      "mtoValorVenta": 16,
      "mtoBaseIgv": 16
    },
    { "unidad": "NIU", "descripcion": "PRODUCTO 2", "cantidad": 1, "mtoValorUnitario": 50 }
  ]
}
```

| Campo | Detalle |
| --- | --- |
| `codTipo` | [Catálogo 53](/referencia/catalogos#catalogo-53-cargos-y-descuentos). `00` = descuento por ítem que afecta la base. |
| `factor` | Proporción del descuento (`0.2` = 20 %). |
| `montoBase` | Importe sobre el que se aplica. |
| `monto` | Importe descontado. |

::: tip Cuando hay descuento, envía el valor de venta
Con descuentos conviene enviar `mtoValorVenta` y `mtoBaseIgv` ya calculados: dejas
explícito el importe final de la línea y evitas discrepancias de redondeo.
:::

Alternativa simple para un descuento sin desglose: el campo `descuento` del ítem, que
se resta directamente del valor de venta.

## Descuento global

Rebaja sobre el total del comprobante. Va en el arreglo `descuentos` del documento:

```json
{
  "descuentos": [
    { "codTipo": "02", "factor": 1, "monto": 3, "montoBase": 3 }
  ],
  "mtoOperGravadas": 67,
  "mtoIGV": 12.06,
  "valorVenta": 67,
  "subTotal": 79.06,
  "mtoImpVenta": 79.06,
  "details": [
    { "unidad": "NIU", "descripcion": "CAFE", "cantidad": 1, "mtoValorUnitario": 20 },
    { "unidad": "NIU", "descripcion": "PASTA DENTAL", "cantidad": 1, "mtoValorUnitario": 50 }
  ]
}
```

Fíjate: los ítems suman 70, pero `mtoOperGravadas` es 67 porque el descuento global
**reduce la base imponible**. Es correcto y el servicio lo entiende.

::: warning Afecta o no afecta la base
El catálogo 53 distingue descuentos que afectan la base imponible de los que no. Un
descuento que la afecta reduce `mtoOperGravadas`; uno que no la afecta se declara en
`sumOtrosDescuentos` y solo baja el importe a pagar. Elegir el código equivocado
cambia el IGV que declaras.
:::

## Cargos

Mismo mecanismo, en el arreglo `cargos` y con códigos de cargo del catálogo 53. Los
cargos que no afectan la base van en `sumOtrosCargos`.

## Anticipos

Cuando el cliente ya pagó un adelanto con una factura previa, la factura final
descuenta ese anticipo:

```json
{
  "anticipos": [
    { "tipoDocRel": "02", "nroDocRel": "F001-111", "total": 100 }
  ],
  "descuentos": [
    { "codTipo": "04", "factor": 1, "monto": 100, "montoBase": 100 }
  ],
  "totalAnticipos": 100,
  "mtoOperGravadas": 100,
  "mtoIGV": 18,
  "valorVenta": 200,
  "subTotal": 236,
  "mtoImpVenta": 136,
  "details": [
    { "unidad": "NIU", "descripcion": "PRODUCTO 1", "cantidad": 1, "mtoValorUnitario": 200 }
  ]
}
```

| Campo | Detalle |
| --- | --- |
| `anticipos[].tipoDocRel` | Tipo del comprobante de anticipo (`02` factura de anticipo). |
| `anticipos[].nroDocRel` | Su serie y número. |
| `totalAnticipos` | Suma de los anticipos aplicados. |
| `descuentos` con `codTipo: "04"` | Refleja el anticipo como descuento de la base. |

El importe a pagar (`mtoImpVenta`) es el subtotal menos los anticipos: 236 − 100 = 136.

::: info La validación lo contempla
El servicio verifica que los ítems cuadren con los totales declarados, pero descuenta
del cálculo lo que descuentos globales, cargos y anticipos pueden explicar. Un
descuento legítimo no dispara un error de coherencia.
:::
