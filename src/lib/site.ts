// La versión de prueba se sirve en la raíz de readlaterepub.make-algo.com
// (dominio propio, ver public/CNAME), así que `BASE_URL` es '/'. Se sigue
// pasando por aquí para no volver a escribir rutas absolutas si el `base`
// cambia en el futuro.
const BASE = import.meta.env.BASE_URL

/** Ruta interna respetando el `base` del sitio: url('/privacidad') → '/privacidad' */
export function url(path: string): string {
  return `${BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

/** La misma ruta, absoluta. Necesaria en Open Graph, en el canonical y en el `_next` del formulario. */
export function absoluteUrl(path: string): string {
  return new URL(url(path), import.meta.env.SITE).href
}
