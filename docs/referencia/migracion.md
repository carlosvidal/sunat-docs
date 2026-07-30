# Migrar desde APIsPERU

La estructura de los comprobantes es la misma, así que la migración es en gran medida
un cambio de URL y de token.

## Equivalencia de endpoints

| APIsPERU | Este servicio |
| --- | --- |
| `POST /invoice/send` | `POST /invoice/send` |
| `POST /invoice/xml` | `POST /invoice/xml` |
| `POST /invoice/pdf` | `POST /invoice/pdf?formato=a4` |
| `GET /invoice/status` | `GET /invoice/status` |
| `POST /note/send` | `POST /note/send` |
| `POST /summary/send` | `POST /summary/send` |
| `GET /summary/status?ticket=` | `GET /summary/status?ticket=` |
| `POST /voided/send` | `POST /voided/send` |
| `POST /despatch/send` | `POST /despatch/send` |
| `POST /retention/send` | `POST /retention/send` |
| `POST /perception/send` | `POST /perception/send` |
| `POST /companies` | `POST /companies` (con `X-API-Key`) |
| `POST /auth/login` | No existe: el token se entrega al crear la empresa. |

## Qué cambia en el payload

**Nada obligatorio.** Los mismos JSON funcionan. Con dos matices:

1. **`company` es opcional.** Si lo omites, se toma del perfil de la empresa
   registrada. Si lo envías, su RUC debe coincidir con el de la empresa autenticada.
2. **`correlativo` es opcional.** Si lo omites, el servicio reserva el siguiente de la
   serie. Si tu sistema ya lleva la numeración, sigue enviándolo.

## Qué cambia en la respuesta

La forma se mantiene:

```json
{
  "xml": "…",
  "hash": "…",
  "sunatResponse": {
    "success": true,
    "cdrResponse": { "id": "F001-1", "code": "0", "description": "…", "notes": [] }
  }
}
```

Y se agregan campos propios:

| Campo | Contenido |
| --- | --- |
| `documentId` | Identificador interno, para consultar o descargar después. |
| `state` | Estado normalizado (`ACEPTADO`, `RECHAZADO`, …). |
| `files` | Rutas del XML, la CDR y el PDF almacenados. |

## Alta de empresas

En APIsPERU se crea una empresa con el token de usuario. Aquí se usa la clave maestra
de la plataforma (`X-API-Key`) y el certificado se envía como `.pfx` en base64 —no
hace falta convertirlo a PEM previamente, el servicio lo hace.

Ver [Registrar una empresa](/guia/empresas).

## Plan de migración sugerido

1. Levanta el servicio apuntando a **BETA** y registra la empresa con su certificado.
2. Reproduce en BETA los comprobantes típicos del negocio con los payloads que ya
   usas. No deberían requerir cambios.
3. Cambia la empresa a `produccion` y **sincroniza el correlativo**: envía el primer
   comprobante con el número que sigue al último emitido por APIsPERU.
4. Emite en paralelo unos días si quieres red de seguridad, comparando resultados.
5. Apaga la integración anterior.

::: danger El correlativo es lo delicado
Si el número ya fue informado a SUNAT, el comprobante se rechaza. Confirma el último
emitido en el portal SOL antes del corte. Ver
[Migrar los correlativos](/guia/produccion#migrar-los-correlativos).
:::

## Qué ganas y qué asumes

**Ganas:** sin costo por comprobante ni límites de plan; los datos y certificados
quedan en tu infraestructura; control de la cola, los reintentos y los webhooks.

**Asumes:** la operación. Si SUNAT cambia un esquema o el certificado vence, el
responsable de reaccionar eres tú, no un proveedor.
