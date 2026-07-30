# Manual de Facturación Electrónica SUNAT

Sitio de documentación del microservicio de emisión electrónica (SEE – Del
Contribuyente). Construido con [VitePress](https://vitepress.dev): páginas en
Markdown, sitio estático.

## Desarrollo

```bash
pnpm install
pnpm approve-builds --all   # una sola vez: habilita el binario de esbuild
pnpm dev                    # http://localhost:5173
```

## Publicar

```bash
pnpm build     # genera docs/.vitepress/dist
pnpm preview   # sirve el resultado localmente
```

El resultado es HTML estático. Hay dos despliegues preparados:

**GitHub Pages** — `.github/workflows/pages.yml` publica en cada push a `main`.
Requiere activar Pages en *Settings → Pages → Source: GitHub Actions*. El workflow
define `DOCS_BASE=/<repo>/` porque el sitio cuelga de un subdirectorio; si usas un
dominio propio, quita esa variable.

**Netlify** — `netlify.toml` ya trae el comando y el directorio de publicación.
Se sirve desde la raíz, así que no necesita `DOCS_BASE`.

En ambos casos el build corre `pnpm approve-builds --all` primero: sin eso pnpm no
instala el binario de esbuild y VitePress no compila.

## Estructura

```
docs/
  index.md                 portada
  guia/                    instalación, configuración, empresas, primeros pasos, operación
  comprobantes/            un documento por tipo de comprobante
  casos/                   casos de uso con payloads verificados contra SUNAT
  referencia/              estados, errores, campos, catálogos, API, migración
  .vitepress/config.mts    navegación y barra lateral
```

## Escribir

- Cada página empieza con un `#` y explica **para qué sirve** antes del **cómo**.
- Los ejemplos deben ser payloads reales, probados. Si no se probó, no se documenta
  como si funcionara.
- Usa los bloques de aviso de VitePress con criterio:
  `::: tip` para atajos, `::: warning` para lo que suele salir mal, `::: danger` para
  lo que causa un rechazo de SUNAT o una pérdida de datos.
- Al agregar una página, enlázala en la barra lateral de `config.mts`; el build falla
  si un enlace apunta a una página inexistente.
