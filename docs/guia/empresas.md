# Registrar una empresa

Antes de emitir hay que registrar la empresa con su certificado digital y su usuario
SOL. Es una operación de plataforma: requiere la cabecera `X-API-Key`.

## Alta

```bash
curl -X POST http://localhost:3000/api/v1/companies \
  -H "x-api-key: $MASTER_API_KEY" \
  -H 'content-type: application/json' \
  -d '{
    "tenant_id": "tienda-123",
    "ruc": "20000000001",
    "razon_social": "MI EMPRESA S.A.C.",
    "nombre_comercial": "MI EMPRESA",
    "domicilio_fiscal": {
      "ubigueo": "150101",
      "direccion": "AV. LIMA 100",
      "departamento": "LIMA",
      "provincia": "LIMA",
      "distrito": "LIMA"
    },
    "sol_user": "MODDATOS",
    "sol_pass": "MODDATOS",
    "certificado": "<contenido del .pfx en base64>",
    "cert_password": "clave-del-certificado",
    "environment": "beta",
    "webhook_url": "https://mi-backend.pe/webhooks/sunat"
  }'
```

La respuesta incluye el **token de emisión**:

```json
{
  "tenant_id": "tienda-123",
  "ruc": "20000000001",
  "certificado": { "subject": "…", "valido_hasta": "2027-07-30T04:50:41.000Z", "vencido": false },
  "token": "eyJhbGciOiJIUzI1NiIs…"
}
```

::: tip Guarda el token
Con ese token tu backend emite. No expira. Si lo pierdes, puedes reemitirlo con
`POST /companies/{tenant_id}/token`.
:::

## Campos

| Campo | Obligatorio | Notas |
| --- | --- | --- |
| `tenant_id` | sí | Identificador tuyo. El alta es idempotente: reenviarlo actualiza la empresa. |
| `ruc` | sí | 11 dígitos. Debe coincidir con el del certificado. |
| `razon_social` | sí | Tal como figura en RUC. |
| `domicilio_fiscal` | sí | `ubigueo`, `direccion`, `departamento`, `provincia`, `distrito`. |
| `sol_user` / `sol_pass` | sí | Usuario SOL **secundario** con permiso de envío. |
| `certificado` | sí | `.pfx`, `.p12` o PEM, en base64. |
| `cert_password` | según el archivo | Contraseña del `.pfx`. |
| `client_id` / `client_secret` | solo para guías | Credenciales de API del portal SOL. |
| `environment` | no | `beta` (por defecto) o `produccion`. |
| `webhook_url` / `webhook_secret` | no | Notificación de resultados. |

## Convertir el certificado a base64

```bash
base64 -i certificado.pfx | tr -d '\n' > cert.txt      # macOS
base64 -w0 certificado.pfx > cert.txt                  # Linux
```

## Verificar un certificado antes de cargarlo

```bash
curl -X POST http://localhost:3000/api/v1/companies/certificate/inspect \
  -H "x-api-key: $MASTER_API_KEY" -H 'content-type: application/json' \
  -d '{ "cert": "<base64>", "cert_pass": "clave" }'
```

Devuelve titular, RUC, número de serie y vigencia. Si la contraseña es incorrecta o
el archivo está dañado, falla aquí y no cuando intentes emitir.

## Certificado de prueba

Para BETA puedes generar uno autofirmado:

```bash
curl -X POST http://localhost:3000/api/v1/companies/certificate/free \
  -H "x-api-key: $MASTER_API_KEY" -H 'content-type: application/json' \
  -d '{ "ruc": "20000000001", "razon_social": "EMPRESA DEMO", "password": "demo123" }'
```

::: warning
Un certificado autofirmado **solo sirve en BETA**. En producción SUNAT exige uno
emitido por una entidad de certificación acreditada.
:::

## Vigencia del certificado

El backoffice muestra la fecha de vencimiento de cada empresa y marca las vencidas.
Renovar es reenviar el alta con el nuevo `.pfx`: el `tenant_id`, las series y el
histórico se conservan.

::: danger Certificado vencido
Con el certificado vencido SUNAT rechaza **todo**. Revisa las vigencias con al menos
un mes de anticipación.
:::
