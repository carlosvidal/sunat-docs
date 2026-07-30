# Estados del comprobante

## Estados internos

| Estado | Significado | Qué hacer |
| --- | --- | --- |
| `PENDIENTE` | Registrado, aún sin firmar ni enviar. | Nada; es transitorio. |
| `EN_COLA_SUNAT` | Firmado y en tránsito, o esperando el resultado de un ticket. | Esperar. |
| `ACEPTADO` | SUNAT lo aceptó (código `0`). | Nada. Es válido. |
| `ACEPTADO_CON_OBSERVACIONES` | Aceptado con notas (código `4000`+). | Es válido, pero revisa las observaciones. |
| `RECHAZADO` | SUNAT lo rechazó (código `2000`–`3999`). | **Corregir y reemitir con otro número.** |
| `EXCEPCION` | Error de transporte o configuración. | Reintentar. |
| `ANULADO` | Dado de baja. | Nada. |

## Cómo leer la respuesta de SUNAT

El código de la CDR es la fuente de verdad:

| Rango | Severidad | ¿Es válido el comprobante? | ¿Reintentar? |
| --- | --- | --- | --- |
| `0` | Aceptado | Sí | No hace falta |
| `100`–`1999` | Error de configuración o servicio | No se procesó | **Sí** |
| `2000`–`3999` | Rechazo | **No** | **No** — el XML es inválido |
| `4000`+ | Observación | Sí | No hace falta |

::: danger La diferencia que más cuesta
Un **rechazo** no se arregla reintentando: el mismo XML volverá a ser rechazado. Hay
que corregir el dato y emitir **con un número nuevo** (el rechazado no existe para
SUNAT, pero el correlativo ya se consumió en tu sistema).

Una **excepción** sí se reintenta: el comprobante es válido, SUNAT no estaba
disponible.
:::

## Ciclo de vida

```
PENDIENTE ──firma──▶ EN_COLA_SUNAT ──┬──▶ ACEPTADO
                                     ├──▶ ACEPTADO_CON_OBSERVACIONES
                                     ├──▶ RECHAZADO      (corregir y reemitir)
                                     └──▶ EXCEPCION ──reintento──▶ …
```

## Consultar el estado

```bash
# Por identificador interno
curl "$API/documents/{id}" -H "authorization: Bearer $TOKEN"

# Por serie y número, consultando a SUNAT
curl "$API/invoice/status?tipo=01&serie=F001&numero=453" -H "authorization: Bearer $TOKEN"

# Listado con filtros
curl "$API/documents?state=RECHAZADO&desde=2026-07-01" -H "authorization: Bearer $TOKEN"
```

## Documentos con ticket

Resumen diario, comunicación de baja y guía de remisión no se resuelven en el envío:
SUNAT devuelve un `ticket` y el resultado llega después. Mientras tanto el estado es
`EN_COLA_SUNAT`, y eso **no** indica un problema.
