import { defineConfig } from 'vitepress';

/*
 * En GitHub Pages el sitio cuelga de /<repo>/, así que el workflow define
 * DOCS_BASE. En Netlify o dominio propio se sirve desde la raíz y no hace falta.
 */
const base = process.env.DOCS_BASE ?? '/';

export default defineConfig({
  base,
  lang: 'es-PE',
  title: 'Facturación Electrónica SUNAT',
  description: 'Manual del microservicio de emisión electrónica (SEE - Del Contribuyente) para Perú.',
  cleanUrls: true,
  lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#1d4ed8' }]],

  themeConfig: {
    nav: [
      { text: 'Guía', link: '/guia/introduccion' },
      { text: 'Comprobantes', link: '/comprobantes/factura-boleta' },
      { text: 'Casos de uso', link: '/casos/' },
      { text: 'Referencia', link: '/referencia/estados' },
    ],

    sidebar: [
      {
        text: 'Empezar',
        items: [
          { text: 'Introducción', link: '/guia/introduccion' },
          { text: 'Instalación', link: '/guia/instalacion' },
          { text: 'Configuración', link: '/guia/configuracion' },
          { text: 'Registrar una empresa', link: '/guia/empresas' },
          { text: 'Tu primera factura', link: '/guia/primer-comprobante' },
        ],
      },
      {
        text: 'Comprobantes',
        items: [
          { text: 'Factura y boleta', link: '/comprobantes/factura-boleta' },
          { text: 'Notas de crédito y débito', link: '/comprobantes/notas' },
          { text: 'Resumen diario de boletas', link: '/comprobantes/resumen-diario' },
          { text: 'Comunicación de baja', link: '/comprobantes/comunicacion-baja' },
          { text: 'Retención y percepción', link: '/comprobantes/retencion-percepcion' },
          { text: 'Guía de remisión (GRE)', link: '/comprobantes/guia-remision' },
        ],
      },
      {
        text: 'Casos de uso',
        items: [
          { text: 'Catálogo de ejemplos', link: '/casos/' },
          { text: 'Descuentos y cargos', link: '/casos/descuentos' },
          { text: 'Detracción y percepción', link: '/casos/detraccion-percepcion' },
          { text: 'Gratuitas, ICBPER, ISC e IVAP', link: '/casos/impuestos-especiales' },
          { text: 'Exportación y moneda extranjera', link: '/casos/exportacion' },
        ],
      },
      {
        text: 'Operación',
        items: [
          { text: 'Emisión asíncrona y webhooks', link: '/guia/asincrono' },
          { text: 'Backoffice', link: '/guia/backoffice' },
          { text: 'Pasar a producción', link: '/guia/produccion' },
        ],
      },
      {
        text: 'Referencia',
        items: [
          { text: 'Estados del comprobante', link: '/referencia/estados' },
          { text: 'Errores frecuentes', link: '/referencia/errores' },
          { text: 'Diccionario de campos', link: '/referencia/campos' },
          { text: 'Catálogos SUNAT', link: '/referencia/catalogos' },
          { text: 'API HTTP', link: '/referencia/api' },
          { text: 'Migrar desde APIsPERU', link: '/referencia/migracion' },
        ],
      },
    ],

    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'En esta página' },
    docFooter: { prev: 'Anterior', next: 'Siguiente' },
    lastUpdatedText: 'Actualizado',
    darkModeSwitchLabel: 'Apariencia',
    returnToTopLabel: 'Volver arriba',
    sidebarMenuLabel: 'Menú',
    footer: {
      message: 'Manual del microservicio de emisión electrónica SUNAT.',
      copyright: 'MiTienda',
    },
  },
});
