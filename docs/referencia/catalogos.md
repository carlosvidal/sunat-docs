# Catálogos SUNAT

Los códigos que aparecen en los payloads. Se listan los valores de uso frecuente; los
catálogos completos están en la
[documentación oficial de SUNAT](https://cpe.sunat.gob.pe/desarrolladores/especificaciones_tecnicas).

## Catálogo 01 · Tipo de comprobante

| Código | Comprobante |
| --- | --- |
| `01` | Factura |
| `03` | Boleta de venta |
| `07` | Nota de crédito |
| `08` | Nota de débito |
| `09` | Guía de remisión remitente |
| `20` | Comprobante de retención |
| `31` | Guía de remisión transportista |
| `40` | Comprobante de percepción |

## Catálogo 06 · Documento de identidad

| Código | Documento |
| --- | --- |
| `0` | Sin documento / no domiciliado |
| `1` | DNI |
| `4` | Carné de extranjería |
| `6` | RUC |
| `7` | Pasaporte |
| `A` | Cédula diplomática |

## Catálogo 07 · Tipo de afectación del IGV

| Código | Afectación | Va a |
| --- | --- | --- |
| `10` | Gravado – operación onerosa | `mtoOperGravadas` |
| `11`–`16` | Gravado – gratuitas (retiro, premio, donación…) | `mtoOperGratuitas` |
| `17` | Gravado – IVAP (arroz pilado) | `mtoBaseIvap` |
| `20` | Exonerado – operación onerosa | `mtoOperExoneradas` |
| `21` | Exonerado – transferencia gratuita | `mtoOperGratuitas` |
| `30` | Inafecto – operación onerosa | `mtoOperInafectas` |
| `31`–`37` | Inafecto – gratuitas | `mtoOperGratuitas` |
| `40` | Exportación | `mtoOperExportacion` |

## Catálogo 09 · Nota de crédito

| Código | Motivo |
| --- | --- |
| `01` | Anulación de la operación |
| `02` | Anulación por error en el RUC |
| `03` | Corrección por error en la descripción |
| `04` | Descuento global |
| `05` | Descuento por ítem |
| `06` | Devolución total |
| `07` | Devolución por ítem |
| `13` | Ajustes de operaciones de exportación |

## Catálogo 10 · Nota de débito

| Código | Motivo |
| --- | --- |
| `01` | Intereses por mora |
| `02` | Aumento en el valor |
| `03` | Penalidades u otros conceptos |

## Catálogo 18 · Modalidad de traslado

| Código | Modalidad |
| --- | --- |
| `01` | Transporte público |
| `02` | Transporte privado |

## Catálogo 20 · Motivo de traslado

| Código | Motivo |
| --- | --- |
| `01` | Venta |
| `02` | Compra |
| `04` | Traslado entre establecimientos de la misma empresa |
| `08` | Importación |
| `09` | Exportación |
| `13` | Otros |

## Catálogo 22 · Régimen de percepción

| Código | Régimen | Tasa |
| --- | --- | --- |
| `01` | Venta interna | 2 % |
| `02` | Adquisición de combustible | 1 % |
| `03` | Importación de bienes | varía |

## Catálogo 23 · Régimen de retención

| Código | Régimen | Tasa |
| --- | --- | --- |
| `01` | Tasa 3 % | 3 % |
| `02` | Tasa 6 % | 6 % |

## Catálogo 51 · Tipo de operación

| Código | Operación |
| --- | --- |
| `0101` | Venta interna |
| `0200` | Exportación de bienes |
| `1001` | Operación sujeta a detracción |
| `2001` | Operación sujeta a percepción — venta interna |

## Catálogo 53 · Cargos y descuentos

| Código | Concepto |
| --- | --- |
| `00` | Descuento por ítem, afecta la base imponible |
| `01` | Descuento global, no afecta la base |
| `02` | Descuento global, afecta la base |
| `04` | Descuento por anticipos gravados |
| `45`–`50` | Cargos (globales y por ítem) |

::: warning Afecta o no la base
El código elegido determina si el descuento reduce el IGV declarado. Confirmarlo con
el contador de la empresa evita observaciones.
:::

## Catálogo 15 · Leyendas

| Código | Leyenda |
| --- | --- |
| `1000` | Monto en letras (**el servicio la agrega automáticamente**) |
| `1002` | Transferencia gratuita (**automática** en operaciones gratuitas) |
| `2000` | Comprobante de percepción |
| `2006` | Operación sujeta a detracción |
| `2007` | Operación exonerada del IGV (Amazonía) |

## Tabla 6 · Unidades de medida

| Código | Unidad |
| --- | --- |
| `NIU` | Unidad (bienes) |
| `ZZ` | Servicio |
| `KGM` | Kilogramo |
| `MTR` | Metro |
| `LTR` | Litro |
| `BX` | Caja |
| `GLL` | Galón |
