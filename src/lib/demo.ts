import { url } from './site'

/**
 * Fuentes de la demo embebida (MAK-101, diseño MAK-93). Único punto que
 * cambia cuando MAK-91 entregue el EPUB real: `DEMO_EPUB_URL`, mismo
 * fichero — el resto de `Demo.astro` no toca.
 */
export const DEMO_EPUB_URL = url('/demo/demo-epub-placeholder.epub')
export const DEMO_FALLBACK_IMG = url('/demo/fallback-web-static.png')
export const DEMO_WEB_URL = 'https://paulgraham.com/love.html'

/**
 * Librerías de epub.js, cargadas en diferido solo cuando la demo entra en
 * viewport. Versión fijada (no "latest"): epub.js 0.3.93 es la validada en
 * `docs/design/02-demo-embebida.md` — sin pin, un release nuevo de
 * cualquiera de las dos puede romper la demo sin que cambie una línea de
 * este repo (hallazgo de revisión, MAK-101).
 */
export const DEMO_JSZIP_SRC = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
export const DEMO_EPUBJS_SRC = 'https://cdn.jsdelivr.net/npm/epubjs@0.3.93/dist/epub.min.js'
