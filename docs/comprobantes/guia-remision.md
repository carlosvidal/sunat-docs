# Guía de remisión (GRE)

Sustenta el **traslado de bienes**. Desde 2022 SUNAT la recibe por una API REST
propia, no por el web service SOAP del resto de comprobantes.

| Tipo | `tipoDoc` | Emite |
| --- | --- | --- |
| Guía de remisión remitente | `09` | Quien envía los bienes |
| Guía de remisión transportista | `31` | La empresa de transporte |

## Requisito previo

::: danger Credenciales de API
La GRE exige `client_id` y `client_secret` generados en el portal SOL (menú
*Credenciales de API*). Son distintos del usuario SOL. Sin ellos,
`/despatch/send` responde `400` y no consume correlativo.
:::

Se cargan al registrar la empresa:

```json
{ "tenant_id": "tienda-123", "client_id": "…", "client_secret": "…", "…": "…" }
```

## Envío

```json
{
  "tipoDoc": "09",
  "serie": "T001",
  "destinatario": {
    "tipoDoc": "6",
    "numDoc": "20000000002",
    "rznSocial": "EMPRESA CLIENTE S.A.C."
  },
  "envio": {
    "codTraslado": "01",
    "desTraslado": "VENTA",
    "modTraslado": "01",
    "fecTraslado": "2026-07-31",
    "pesoTotal": 12.5,
    "undPesoTotal": "KGM",
    "llegada": { "ubigueo": "150101", "direccion": "AV. LIMA 100" },
    "partida": { "ubigueo": "150203", "direccion": "AV. ITALIA 200" },
    "transportista": {
      "tipoDoc": "6",
      "numDoc": "20000000003",
      "rznSocial": "TRANSPORTES S.A.C.",
      "placa": "ABI-453"
    }
  },
  "details": [
    { "codigo": "PROD1", "unidad": "ZZ", "descripcion": "PRODUCTO 1", "cantidad": 2 }
  ]
}
```

### El bloque `envio`

| Campo | Detalle |
| --- | --- |
| `codTraslado` | Motivo ([catálogo 20](/referencia/catalogos#catalogo-20-motivo-de-traslado)): `01` venta, `02` compra, `04` traslado entre establecimientos. |
| `modTraslado` | [Catálogo 18](/referencia/catalogos#catalogo-18-modalidad-de-traslado): `01` transporte público, `02` privado. |
| `fecTraslado` | Fecha de inicio del traslado. |
| `pesoTotal` / `undPesoTotal` | Peso bruto y su unidad (`KGM`, `TNE`). |
| `partida` / `llegada` | Ubigeo y dirección. |
| `transportista` | Obligatorio en transporte **público**. |
| `vehiculo` / `choferes` | Obligatorios en transporte **privado**. |

### Transporte privado

```json
{
  "envio": {
    "modTraslado": "02",
    "vehiculo": { "placa": "ABI-453" },
    "choferes": [
      { "tipo": "Principal", "tipoDoc": "1", "nroDoc": "40003344",
        "nombres": "JUAN", "apellidos": "PEREZ", "licencia": "Q40003344" }
    ]
  }
}
```

## Respuesta

```json
{ "state": "EN_COLA_SUNAT", "sunatResponse": { "success": true, "ticket": "…" } }
```

Como el resumen, es asíncrona:

```bash
curl "$API/despatch/status?ticket=…" -H "authorization: Bearer $TOKEN"
```

## Relación con la factura

Una factura puede referenciar las guías que la sustentan:

```json
{
  "tipoDoc": "01",
  "guias": [ { "tipoDoc": "09", "nroDoc": "T001-1" } ]
}
```
