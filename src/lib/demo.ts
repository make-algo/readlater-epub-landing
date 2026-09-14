import { url } from './site'

/**
 * Fuentes de la demo embebida (MAK-101, diseño MAK-93). Único punto que
 * cambia cuando MAK-91 entregue el EPUB real: `DEMO_EPUB_URL`, mismo
 * fichero — el resto de `Demo.astro` no toca.
 */
export const DEMO_EPUB_URL = url('/demo/demo-epub-placeholder.epub')
export const DEMO_FALLBACK_IMG = url('/demo/fallback-web-static.png')
export const DEMO_WEB_URL = 'https://paulgraham.com/love.html'

/** Librerías de epub.js, cargadas en diferido solo cuando la demo entra en viewport. */
export const DEMO_JSZIP_SRC = 'https://cdn.jsdelivr.net/npm/jszip/dist/jszip.min.js'
export const DEMO_EPUBJS_SRC = 'https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js'
