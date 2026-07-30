# Configuración

Toda la configuración se hace por variables de entorno.

## Obligatorias

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión de PostgreSQL. |
| `MASTER_API_KEY` | Clave de la plataforma. Administra empresas y accede al backoffice. |
| `JWT_SECRET` | Secreto con el que se firman los tokens de cada empresa. |
| `SECRETS_MASTER_KEY` | 32 bytes en base64. Cifra claves SOL y certificados. |

::: danger Sobre SECRETS_MASTER_KEY
Si pierdes esta clave, **no podrás descifrar los certificados ya almacenados** y
tendrás que volver a cargarlos en cada empresa. Guárdala en tu gestor de secretos,
no en el repositorio.
:::

## Opcionales

| Variable | Por defecto | Descripción |
| --- | --- | --- |
| `PORT` / `HOST` | `3000` / `0.0.0.0` | Dónde escucha la API. |
| `REDIS_URL` | — | Sin esto, `/enqueue` responde 501 y solo hay emisión síncrona. |
| `SECRETS_DRIVER` | `local` | `local` (AES-256-GCM) o `kms`. |
| `STORAGE_DRIVER` | `local` | `local` o `s3` (compatible con S3 y Cloudflare R2). |
| `STORAGE_PATH` | `./storage` | Ruta de los archivos cuando el driver es `local`. |
| `SUNAT_TIMEOUT_MS` | `45000` | Timeout por llamada a SUNAT. |
| `WEBHOOK_URL` / `WEBHOOK_SECRET` | — | Webhook por defecto; cada empresa puede tener el suyo. |
| `WORKER_CONCURRENCY` | `5` | Comprobantes que el worker procesa en paralelo. |
| `LOG_LEVEL` | `info` | Nivel de log. |

## Almacenamiento

Los XML, CDR y PDF se guardan con la convención `{ruc}/{año}/{mes}/{nombre}.{ext}`.

Para S3 o R2:

```bash
STORAGE_DRIVER=s3
S3_BUCKET=mis-comprobantes
S3_REGION=auto
S3_ENDPOINT=https://<cuenta>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

::: warning Conservación
SUNAT exige conservar los comprobantes electrónicos y sus CDR por **cinco años**.
Configura el ciclo de vida del bucket en consecuencia y no borres nada antes.
:::

## Cifrado de secretos

Las claves SOL, la contraseña del certificado y el `client_secret` se cifran con
**AES-256-GCM** antes de guardarse; el `.pfx` se almacena cifrado en el storage y se
descifra **solo en memoria** al momento de firmar.

Si tu organización usa AWS KMS o HashiCorp Vault, la interfaz `SecretVault` es el
punto de extensión: implementa `encrypt`/`decrypt` y cambia `SECRETS_DRIVER=kms`.

## Ambientes de SUNAT

Cada empresa se configura con `environment`:

| Valor | Uso |
| --- | --- |
| `beta` | Pruebas. Acepta certificados autofirmados. Nada de lo emitido tiene valor tributario. |
| `produccion` | Emisión real. Requiere certificado emitido por una entidad autorizada. |

Puedes cambiar el ambiente de una empresa en cualquier momento reenviando su alta;
los comprobantes ya emitidos conservan su historial.
