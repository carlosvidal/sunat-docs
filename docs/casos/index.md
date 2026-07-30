# Catálogo de casos de uso

Cada uno de estos payloads fue **enviado al ambiente BETA de SUNAT y aceptado con
código 0**. Puedes obtenerlos desde el propio servicio:

```bash
curl $API/examples                    # catálogo completo
curl $API/examples/factura_detraccion # uno en particular
```

## Facturas y boletas

| Caso | Qué muestra | Dónde |
| --- | --- | --- |
| Gravada simple | Lo mínimo para emitir | [Tu primera factura](/guia/primer-comprobante) |
| Exonerada | `tipAfeIgv: "20"`, sin IGV | [Impuestos especiales](/casos/impuestos-especiales#exonerada) |
| Gratuita | Promociones y muestras | [Impuestos especiales](/casos/impuestos-especiales#gratuita) |
| ICBPER | Bolsas plásticas | [Impuestos especiales](/casos/impuestos-especiales#icbper) |
| ISC | Impuesto selectivo al consumo | [Impuestos especiales](/casos/impuestos-especiales#isc) |
| IVAP | Venta de arroz pilado | [Impuestos especiales](/casos/impuestos-especiales#ivap) |
| Descuento por línea | Rebaja en un ítem | [Descuentos y cargos](/casos/descuentos#descuento-por-linea) |
| Descuento global | Rebaja sobre el total | [Descuentos y cargos](/casos/descuentos#descuento-global) |
| Detracción | Servicios sujetos al SPOT | [Detracción y percepción](/casos/detraccion-percepcion#detraccion) |
| Percepción | Percepción en la venta | [Detracción y percepción](/casos/detraccion-percepcion#percepcion) |
| Anticipos | Facturas de adelanto | [Descuentos y cargos](/casos/descuentos#anticipos) |
| Exportación | `tipAfeIgv: "40"`, en dólares | [Exportación](/casos/exportacion) |
| Contingencia | Comprobante emitido en contingencia | [Exportación](/casos/exportacion#contingencia) |

## Otros comprobantes

| Caso | Dónde |
| --- | --- |
| Nota de crédito sobre factura o boleta | [Notas](/comprobantes/notas) |
| Nota de débito por intereses | [Notas](/comprobantes/notas#nota-de-debito) |
| Resumen diario, anulaciones y notas de boletas | [Resumen diario](/comprobantes/resumen-diario) |
| Comunicación de baja | [Comunicación de baja](/comprobantes/comunicacion-baja) |
| Retención y percepción | [Retención y percepción](/comprobantes/retencion-percepcion) |
| Guía de remisión | [Guía de remisión](/comprobantes/guia-remision) |

## Cómo probar cualquiera

```bash
curl -X POST $API/invoice/send \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d "$(curl -s $API/examples/factura_detraccion)"
```

::: tip Primero el XML
Si quieres ver qué se generaría sin enviar nada a SUNAT, usa `/invoice/xml` con el
mismo payload. No consume correlativo.
:::
