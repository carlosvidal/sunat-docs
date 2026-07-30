# Instalación

## Requisitos

- **Node.js 22.14** o superior
- **PostgreSQL 14+** — correlativos, estados e histórico
- **Redis 7+** *(opcional)* — habilita la emisión encolada y el worker

## Puesta en marcha

```bash
cp .env.example .env
openssl rand -base64 32      # pega el resultado en SECRETS_MASTER_KEY

docker compose up -d         # PostgreSQL (5434) y Redis (6380)
pnpm install
pnpm migrate                 # crea las tablas
pnpm dev                     # API en http://localhost:3000
```

En otra terminal, si vas a usar la cola:

```bash
pnpm dev:worker
```

Verifica que todo responde:

```bash
curl localhost:3000/health
```

```json
{ "status": "ok", "checks": { "api": "ok", "database": "ok", "queue": "configurada" } }
```

## Interfaces disponibles

| Interfaz | URL | Para qué |
| --- | --- | --- |
| API | `/api/v1` | Emisión y consulta. |
| Documentación interactiva | `/docs` | Swagger UI con *Try it out*. |
| Especificación OpenAPI | `/docs/json` | Generar clientes automáticamente. |
| Backoffice | `/admin` | Monitoreo y operación. |
| Ejemplos | `/api/v1/examples` | Payloads listos para copiar. |

## Producción

```bash
pnpm build
pnpm start           # API
pnpm start:worker    # worker (proceso aparte)
```

El build deja todo en `dist/`. La API y el worker son procesos independientes: puedes
escalar la API por tráfico y el worker por volumen de emisión.

::: tip Escalar
La API es *stateless*: puedes correr varias instancias detrás de un balanceador. Los
correlativos se reservan con un bloqueo en PostgreSQL, así que dos instancias nunca
asignan el mismo número.
:::

## Base de datos

`pnpm migrate` crea cuatro tablas:

| Tabla | Contenido |
| --- | --- |
| `tenant_sunat_profiles` | Empresas emisoras y sus credenciales cifradas. |
| `document_series` | Último correlativo por serie. |
| `electronic_documents` | Comprobantes emitidos, su estado y sus archivos. |
| `summary_documents` | Resúmenes diarios y comunicaciones de baja. |

La migración es idempotente: puedes ejecutarla en cada despliegue.
