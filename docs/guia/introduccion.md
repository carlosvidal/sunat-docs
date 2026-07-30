# Introducción

Este servicio emite comprobantes de pago electrónicos ante **SUNAT** en la modalidad
**SEE – Del Contribuyente**: tu sistema envía un JSON y el servicio se encarga de
generar el XML UBL 2.1, firmarlo digitalmente, transmitirlo a SUNAT, procesar la
respuesta (CDR) y producir la representación impresa en PDF con el código QR.

## Qué resuelve

Emitir electrónicamente en Perú implica, para cada comprobante:

1. Construir un XML UBL 2.1 con la estructura exacta que exige SUNAT.
2. Firmarlo con XMLDSig (RSA-SHA256) usando el certificado digital de la empresa.
3. Comprimirlo en ZIP y transmitirlo por SOAP (o REST, en el caso de las guías).
4. Interpretar la CDR y saber si el comprobante fue aceptado, observado o rechazado.
5. Guardar XML, CDR y PDF, porque son el respaldo legal de la operación.

Todo eso queda detrás de una llamada HTTP:

```bash
POST /api/v1/invoice/send
```

## Qué NO hace

- **No es un OSE.** No valida comprobantes de terceros ni actúa como intermediario
  autorizado; envía directamente a SUNAT con el certificado de cada empresa.
- **No reemplaza tu ERP.** No lleva inventario, cuentas por cobrar ni contabilidad.
- **No decide por ti.** Si envías importes incoherentes, se te avisa cuando es
  evidente, pero la responsabilidad tributaria de lo declarado es del emisor.

## Modelo mental

```
Tu backend  ──JSON──▶  Servicio  ──XML firmado──▶  SUNAT  ──CDR──▶  Servicio  ──▶  Tu backend
                          │
                          └─▶ almacena XML, CDR y PDF · lleva los correlativos · reintenta
```

Dos conceptos que conviene tener claros desde el inicio:

**Empresa (tenant).** Cada empresa emisora se registra una vez con su RUC,
certificado digital y usuario SOL. Recibe un token con el que emite. Los datos de
una empresa jamás son visibles para otra.

**Comprobante.** Todo lo que emites queda registrado con su estado, su número
correlativo y sus archivos. Puedes consultarlo por API o desde el backoffice.

## Compatibilidad con Greenter

La estructura de los payloads es la misma que usa
[Greenter](https://greenter.dev), el proyecto de código abierto que se volvió el
estándar de facto para facturación electrónica peruana: los campos `tipoDoc`,
`serie`, `details`, `tipAfeIgv`, `mtoValorUnitario`, etc. significan exactamente lo
mismo y producen el mismo XML.

Eso significa que si tu sistema ya emite con ese formato —directamente con Greenter o
a través de un proveedor que lo adoptó— migrar es cambiar la URL base y el token. Ver
[Migrar desde otro proveedor](/referencia/migracion).

## Requisitos

| Requisito | Detalle |
| --- | --- |
| **RUC** | La empresa debe estar afecta a emisión electrónica. |
| **Certificado digital** | `.pfx` o `.p12` vigente. Para pruebas en BETA sirve uno autofirmado que el propio servicio puede generar. |
| **Usuario SOL secundario** | Con el permiso de envío de comprobantes. En BETA se usa `MODDATOS` / `MODDATOS`. |
| **Credenciales de API** | `client_id` y `client_secret` del portal SOL, solo si vas a emitir guías de remisión. |

## Siguiente paso

- [Instalación](/guia/instalacion) — levantar el servicio.
- [Tu primera factura](/guia/primer-comprobante) — de cero a una factura aceptada.
