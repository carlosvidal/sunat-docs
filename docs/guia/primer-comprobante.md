# Tu primera factura

De cero a una factura aceptada por SUNAT, en el ambiente de pruebas.

## 1. Genera un certificado de prueba

```bash
export API=http://localhost:3000/api/v1
export MASTER_API_KEY=tu-clave-maestra

CERT=$(curl -s -X POST $API/companies/certificate/free \
  -H "x-api-key: $MASTER_API_KEY" -H 'content-type: application/json' \
  -d '{"ruc":"20000000001","razon_social":"EMPRESA DEMO","password":"demo123"}' \
  | jq -r .pfx_base64)
```

## 2. Registra la empresa de pruebas

En BETA, SUNAT acepta el RUC `20000000001` con el usuario `MODDATOS` y la clave
`MODDATOS`.

```bash
TOKEN=$(curl -s -X POST $API/companies \
  -H "x-api-key: $MASTER_API_KEY" -H 'content-type: application/json' \
  -d '{
    "tenant_id": "demo",
    "ruc": "20000000001",
    "razon_social": "EMPRESA DEMO S.A.C.",
    "domicilio_fiscal": { "ubigueo":"150101","direccion":"AV. LIMA 100",
                          "departamento":"LIMA","provincia":"LIMA","distrito":"LIMA" },
    "sol_user": "MODDATOS", "sol_pass": "MODDATOS",
    "certificado": "'"$CERT"'", "cert_password": "demo123",
    "environment": "beta"
  }' | jq -r .token)
```

## 3. Emite

Fíjate en lo que **no** hay que enviar: ni IGV, ni totales, ni correlativo, ni
leyenda. El servicio los calcula.

```bash
curl -X POST $API/invoice/send \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d '{
    "tipoDoc": "01",
    "serie": "F001",
    "client": {
      "tipoDoc": "6",
      "numDoc": "20000000002",
      "rznSocial": "CLIENTE DEMO S.A.C."
    },
    "details": [
      { "codProducto": "P001", "unidad": "NIU", "descripcion": "PRODUCTO 1",
        "cantidad": 2, "mtoValorUnitario": 100 }
    ]
  }'
```

## 4. Lee la respuesta

```json
{
  "documentId": "40001615-8219-448c-b674-dd1f6ba8c8bf",
  "state": "ACEPTADO",
  "hash": "3fe8bIdB0FWem69ch6wmkdEwKPL/FOj2RXQSeFhOdRc=",
  "sunatResponse": {
    "success": true,
    "cdrResponse": {
      "id": "F001-1",
      "code": "0",
      "description": "La Factura numero F001-1, ha sido aceptada",
      "notes": [],
      "accepted": true
    }
  },
  "files": {
    "xml": "20000000001/2026/07/20000000001-01-F001-1.xml",
    "cdr": "20000000001/2026/07/R-20000000001-01-F001-1.zip",
    "pdf": "20000000001/2026/07/20000000001-01-F001-1.pdf"
  }
}
```

Lo importante:

- **`state`** — el resultado en una palabra. Ver [Estados](/referencia/estados).
- **`sunatResponse.cdrResponse.code`** — `0` es aceptado; `4000` o más, aceptado con
  observaciones; `2000`–`3999`, rechazado.
- **`hash`** — el resumen de la firma digital, el mismo que va en el QR.
- **`files`** — dónde quedaron guardados los archivos.

## 5. Descarga el PDF

```bash
curl "$API/documents/40001615-8219-448c-b674-dd1f6ba8c8bf/pdf" \
  -H "authorization: Bearer $TOKEN" -o factura.pdf
```

En formato ticket de 80 mm:

```bash
curl -X POST "$API/invoice/pdf?formato=ticket" \
  -H "authorization: Bearer $TOKEN" -H 'content-type: application/json' \
  -d @factura.json -o ticket.pdf
```

## Y ahora

- ¿La emisión no debe bloquear la venta? → [Emisión asíncrona](/guia/asincrono)
- ¿Descuentos, detracción, gratuitas? → [Casos de uso](/casos/)
- ¿Listo para emitir de verdad? → [Pasar a producción](/guia/produccion)
