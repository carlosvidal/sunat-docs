# Diccionario de campos

Referencia de los campos del payload de factura, boleta y notas. Los marcados como
**calculado** se completan solos si no los envías.

## Documento

| Campo | Tipo | Notas |
| --- | --- | --- |
| `tipoDoc` | string | Catálogo 01. Obligatorio. |
| `serie` | string | `F001`, `B001`, `FC01`… Obligatorio. |
| `correlativo` | string | Calculado: se reserva el siguiente de la serie. |
| `fechaEmision` | string | ISO 8601. Calculado: hoy en hora de Perú. |
| `fecVencimiento` | string | Solo facturas. |
| `tipoMoneda` | string | `PEN` por defecto. |
| `tipoOperacion` | string | Catálogo 51. `0101` por defecto. |
| `client` | objeto | Obligatorio. |
| `company` | objeto | Calculado: se toma del perfil de la empresa. |
| `details` | arreglo | Obligatorio, al menos un ítem. |
| `formaPago` | objeto | `{ tipo: "Contado" \| "Credito", monto, moneda }`. |
| `cuotas` | arreglo | Cuotas del crédito: `{ moneda, monto, fechaPago }`. |
| `compra` | string | Número de orden de compra del cliente. |
| `observacion` | string | Nota libre; aparece en el XML y el PDF. |
| `guias` | arreglo | Guías relacionadas: `{ tipoDoc, nroDoc }`. |
| `relDocs` | arreglo | Otros documentos relacionados. |
| `legends` | arreglo | Calculado para `1000` y `1002`. |

### Solo en notas (07 y 08)

| Campo | Notas |
| --- | --- |
| `tipDocAfectado` | Tipo del comprobante modificado. Obligatorio. |
| `numDocfectado` | Serie y número del comprobante modificado. Obligatorio. |
| `codMotivo` | Catálogo 09 o 10. Obligatorio. |
| `desMotivo` | Descripción del motivo. Obligatorio. |

## Cliente (`client`)

| Campo | Notas |
| --- | --- |
| `tipoDoc` | Catálogo 06. Obligatorio. |
| `numDoc` | Obligatorio. |
| `rznSocial` | Obligatorio. |
| `address.direccion` | Recomendado en facturas. |
| `address.ubigueo` | Código de 6 dígitos. |
| `address.codigoPais` | `PE` por defecto. |
| `email` / `telephone` | Opcionales; viajan en el XML. |

## Ítem (`details[]`)

| Campo | Notas |
| --- | --- |
| `descripcion` | Obligatorio. |
| `cantidad` | Obligatorio. |
| `unidad` | Tabla 6. `NIU` por defecto. |
| `mtoValorUnitario` | Valor sin IGV. |
| `mtoValorGratuito` | En líneas gratuitas, reemplaza al anterior. |
| `tipAfeIgv` | Catálogo 07. `10` por defecto. |
| `porcentajeIgv` | `18` por defecto; `0` en exonerado, inafecto y exportación. |
| `descuento` | Descuento simple, en importe. |
| `codProducto` | Código interno. |
| `codProdSunat` | Código del catálogo de productos de SUNAT. |
| `codProdGS1` | Código de barras. |
| `mtoValorVenta` | Calculado: `cantidad × valor unitario − descuento`. |
| `mtoBaseIgv` | Calculado: valor de venta + ISC. |
| `igv` | Calculado. |
| `mtoPrecioUnitario` | Calculado: valor unitario con impuestos. |
| `totalImpuestos` | Calculado. |
| `factorIcbper` | Monto fijo por bolsa. Activa el ICBPER. |
| `porcentajeIsc` / `tipSisIsc` | Activan el ISC. |
| `descuentos` / `cargos` | Arreglos con `{ codTipo, factor, monto, montoBase }`. |

## Totales del documento

Todos son **calculados**; envíalos solo si tu sistema ya los tiene.

| Campo | Contenido |
| --- | --- |
| `mtoOperGravadas` | Base de operaciones gravadas. |
| `mtoOperExoneradas` | Base de exoneradas. |
| `mtoOperInafectas` | Base de inafectas. |
| `mtoOperExportacion` | Base de exportación. |
| `mtoOperGratuitas` | Valor referencial de las gratuitas. |
| `mtoIGV` | IGV de las operaciones onerosas. |
| `mtoIGVGratuitas` | IGV referencial de las gratuitas. |
| `mtoISC` / `mtoBaseIsc` | ISC y su base. |
| `mtoIvap` / `mtoBaseIvap` | IVAP y su base. |
| `icbper` | Total del impuesto a las bolsas. |
| `totalImpuestos` | Suma de todos los tributos. |
| `valorVenta` | Suma de las bases (sin impuestos). |
| `subTotal` | Valor de venta + impuestos + cargos − descuentos. |
| `mtoImpVenta` | Importe total a pagar. |
| `sumOtrosCargos` / `sumOtrosDescuentos` | Cargos y descuentos que no afectan la base. |
| `totalAnticipos` | Anticipos aplicados. |
| `redondeo` | Ajuste de redondeo. |

::: info Regla de oro
Lo que envías, manda. El servicio **nunca** sobrescribe un importe explícito: solo
completa los ausentes y avisa si detecta una incoherencia evidente.
:::
