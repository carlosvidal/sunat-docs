# Pasar a producción

## Lista de verificación

### Antes de emitir

- [ ] **Certificado digital vigente**, emitido por una entidad de certificación
      acreditada. Los autofirmados solo funcionan en BETA.
- [ ] **Usuario SOL secundario** con el permiso de envío de comprobantes.
- [ ] La empresa está **afecta a emisión electrónica** en su ficha RUC.
- [ ] `environment` de la empresa cambiado a `produccion`.
- [ ] Series definidas y coherentes con lo que ya usaba la empresa: si venía
      emitiendo `F001` hasta el 452, registra ese correlativo para que el siguiente
      sea el 453.

### Infraestructura

- [ ] `SECRETS_MASTER_KEY` en el gestor de secretos, con respaldo.
- [ ] `MASTER_API_KEY` y `JWT_SECRET` distintos de los de desarrollo.
- [ ] Almacenamiento con retención de **5 años** (obligación legal).
- [ ] Respaldo de PostgreSQL.
- [ ] Redis y worker activos si usas emisión encolada.
- [ ] Backoffice detrás de autenticación adicional.
- [ ] Alertas sobre comprobantes en `RECHAZADO` o `EXCEPCION`.

### Pruebas recomendadas en BETA

Antes de mover una empresa a producción, emite en BETA al menos: una factura gravada,
una boleta, una nota de crédito, y los casos particulares de su giro (detracción si
presta servicios sujetos, gratuitas si hace promociones, ICBPER si entrega bolsas).

## Diferencias entre BETA y producción

| | BETA | Producción |
| --- | --- | --- |
| Certificado | Autofirmado sirve | Emitido por entidad acreditada |
| Validez tributaria | Ninguna | Total |
| RUC | `20000000001` (demo) | El real |
| Consulta de tickets | **Caída del lado de SUNAT** | Operativa |
| Estabilidad | Intermitente (`401` esporádicos) | Estable |

::: warning La consulta de tickets no funciona en BETA
`getStatus` responde `Failed to establish a backside connection`. Los resúmenes y
bajas quedan en `EN_COLA_SUNAT` aunque el envío haya sido aceptado. No es un problema
del servicio: en producción responde con normalidad.
:::

## Migrar los correlativos

Si la empresa ya emitía con otro proveedor, envía el primer comprobante con el
`correlativo` explícito:

```json
{ "tipoDoc": "01", "serie": "F001", "correlativo": "453", "…": "…" }
```

El contador queda sincronizado y a partir de ahí puedes omitir el campo.

::: danger Numeración duplicada
SUNAT rechaza un comprobante ya registrado. Verifica el último número emitido en el
portal SOL antes de arrancar.
:::

## Operación diaria

| Cuándo | Qué |
| --- | --- |
| Cada día | Enviar el **resumen diario** de boletas del día anterior. |
| Cada día | Revisar el backoffice: rechazados y excepciones. |
| Hasta 7 días | Comunicar la **baja** de facturas anuladas. |
| Mensual | Revisar la vigencia de los certificados. |
