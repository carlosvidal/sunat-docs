# Backoffice

Interfaz web de monitoreo en `/admin`. Se autentica con la clave maestra
(`MASTER_API_KEY`).

## Tablero

Muestra, para el rango y la empresa seleccionados:

- Comprobantes emitidos y desglose por tipo.
- Aceptados y su porcentaje sobre el total.
- Rechazados (requieren corregir y reemitir) y excepciones (reintentables).
- Monto total aceptado.

## Comprobantes

Búsqueda transversal a todas las empresas por serie-correlativo, RUC o razón social
del cliente, con filtros de estado, tipo y rango de fechas.

Al abrir uno verás la respuesta de SUNAT, las observaciones, el último error, el
**payload original con el que se emitió** —clave para diagnosticar un rechazo— y la
descarga de XML, CDR y PDF.

## Reintentar un comprobante

Los comprobantes en `EXCEPCION` o `RECHAZADO` tienen el botón **Reintentar envío**:
se reenvía a SUNAT reutilizando el correlativo ya reservado, sin consumir uno nuevo.

Disponible para facturas, boletas, notas, retenciones y percepciones.

::: tip Antes de reintentar
Un `EXCEPCION` suele resolverse solo reintentando (SUNAT no respondía). Un
`RECHAZADO` **no**: corrige primero lo que indica el mensaje, porque el mismo XML
volverá a ser rechazado. Ver [Errores frecuentes](/referencia/errores).
:::

## Cola

Conteos de la cola (en espera, activos, diferidos, completados, fallidos) y el detalle
de los trabajos fallidos con su motivo, reintentables desde ahí.

## Empresas

Ambiente de cada empresa, usuario SOL, webhook y **vigencia del certificado**, con
marca visible cuando está vencido.

## Seguridad

::: danger No lo publiques en internet
La clave maestra da acceso a los comprobantes de **todas** las empresas. Publica el
backoffice solo en la red interna o detrás de un proxy con autenticación propia
(SSO, VPN o al menos autenticación básica).
:::

El navegador guarda la clave en `localStorage` y la envía en la cabecera `X-API-Key`;
nunca viaja en la URL.
