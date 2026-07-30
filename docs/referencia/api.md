# API HTTP

Base: `/api/v1`. La referencia interactiva y siempre actualizada está en **`/docs`**
(Swagger UI), generada desde los mismos esquemas que validan las peticiones.

## Autenticación

| Ámbito | Cabecera | Para qué |
| --- | --- | --- |
| Plataforma | `X-API-Key: <MASTER_API_KEY>` | Administrar empresas y backoffice. |
| Empresa | `Authorization: Bearer <token>` | Emitir y consultar comprobantes. |

## Empresas · `X-API-Key`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/companies` | Alta o actualización (idempotente por `tenant_id`). |
| `GET` | `/companies` | Listado. |
| `GET` | `/companies/{tenantId}` | Detalle, con vigencia del certificado. |
| `POST` | `/companies/{tenantId}/token` | Reemitir el token de emisión. |
| `DELETE` | `/companies/{tenantId}` | Baja. |
| `POST` | `/companies/certificate/inspect` | Validar un certificado sin guardarlo. |
| `POST` | `/companies/certificate/free` | Certificado autofirmado para BETA. |

## Comprobantes · `Bearer`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/invoice/send` · `/note/send` | Emitir y devolver la CDR. |
| `POST` | `/invoice/enqueue` · `/note/enqueue` | Encolar. |
| `POST` | `/invoice/xml` · `/note/xml` | XML firmado, sin enviar. |
| `POST` | `/invoice/pdf` · `/note/pdf` | PDF (`?formato=a4\|ticket`). |
| `GET` | `/invoice/status` | Estado en SUNAT (`tipo`, `serie`, `numero`). |
| `POST` | `/summary/send` · `/voided/send` | Resumen diario y baja; devuelven `ticket`. |
| `GET` | `/summary/status` · `/voided/status` | Resultado del ticket. |
| `POST` | `/retention/send` · `/perception/send` | Retención y percepción. |
| `POST` | `/despatch/send` | Guía de remisión. |
| `GET` | `/despatch/status` | Resultado del ticket de la guía. |

Todos los grupos aceptan además `/xml`, `/pdf` y `/enqueue` según corresponda.

## Documentos · `Bearer`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/documents` | Histórico con filtros `state`, `desde`, `hasta`, `limit`, `offset`. |
| `GET` | `/documents/{id}` | Detalle. |
| `GET` | `/documents/{id}/xml` · `/cdr` · `/pdf` | Descarga del artefacto. |

## Backoffice · `X-API-Key`

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/admin/overview` | Totales por estado y tipo, errores recientes, empresas. |
| `GET` | `/admin/documents` | Búsqueda transversal a todas las empresas. |
| `GET` | `/admin/documents/{id}` | Detalle con el payload original. |
| `POST` | `/admin/documents/{id}/retry` | Reintentar el envío (`?async=true` para encolar). |
| `GET` | `/admin/queue` | Estado de la cola y trabajos fallidos. |
| `POST` | `/admin/queue/jobs/{jobId}/retry` | Reencolar un trabajo. |

## Ejemplos · público

| Método | Ruta |
| --- | --- |
| `GET` | `/examples` |
| `GET` | `/examples/{nombre}` |

## Códigos de respuesta

| Código | Significado |
| --- | --- |
| `200` | Procesado. Revisa `state` y `sunatResponse`. |
| `202` | Encolado. |
| `400` | Payload inválido o totales incoherentes. |
| `401` | Falta el token o la clave maestra, o son inválidos. |
| `404` | No existe, o pertenece a otra empresa. |
| `409` | Serie y correlativo ya registrados. |
| `422` | SUNAT rechazó el comprobante. |
| `501` | Función no habilitada (por ejemplo, la cola sin Redis). |
| `503` | SUNAT no disponible; reintentable. |

## Generar un cliente

```bash
curl http://localhost:3000/docs/json -o openapi.json
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json -g typescript-fetch -o ./cliente-sunat
```
