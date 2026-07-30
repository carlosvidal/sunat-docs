---
layout: home

hero:
  name: Facturación Electrónica
  text: SUNAT · SEE Del Contribuyente
  tagline: Emite facturas, boletas, notas, guías, retenciones y percepciones desde tu propio backend. XML UBL 2.1, firma digital, CDR y PDF con QR.
  actions:
    - theme: brand
      text: Empezar
      link: /guia/introduccion
    - theme: alt
      text: Tu primera factura
      link: /guia/primer-comprobante
    - theme: alt
      text: Casos de uso
      link: /casos/

features:
  - title: Todos los comprobantes
    details: Factura (01), boleta (03), notas (07 y 08), retención (20), percepción (40), resumen diario (RC), comunicación de baja (RA) y guía de remisión (GRE 2022).
  - title: JSON, no XML
    details: Envías un JSON con los ítems y el servicio calcula IGV, ISC, ICBPER, totales y la leyenda del monto en letras. La estructura es compatible con Greenter y APIsPERU.
  - title: No bloquea la venta
    details: Emisión síncrona cuando necesitas la CDR al instante, o encolada con reintentos ante caídas de SUNAT y notificación por webhook.
  - title: Multiempresa y seguro
    details: Cada empresa con su RUC, certificado y series. Claves SOL y certificados cifrados con AES-256-GCM; el certificado se descifra solo en memoria.
---
