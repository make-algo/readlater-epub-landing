// La versión de prueba se sirve en la raíz de readlaterepub.make-algo.com
// (dominio propio, ver public/CNAME), así que `BASE_URL` es '/'. Se sigue
// pasando por aquí para no volver a escribir rutas absolutas si el `base`
// cambia en el futuro.
const BASE = import.meta.env.BASE_URL

/** Ruta interna respetando el `base` del sitio: url('/gracias') → '/gracias' */
export function url(path: string): string {
  return `${BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

/** La misma ruta, absoluta. Necesaria en Open Graph, en el canonical y en el `_next` del formulario. */
export function absoluteUrl(path: string): string {
  return new URL(url(path), import.meta.env.SITE).href
}

/**
 * Destino del formulario de lista de espera. No es un secreto: es una URL
 * pública de envío, y por eso puede ser `PUBLIC_`. La cuenta la crea un
 * humano, porque es un contrato con un encargado del tratamiento.
 *
 * Sin endpoint configurado el formulario NO finge: valida, muestra sus
 * estados y avisa de que todavía no está operativo. Nunca dice «apuntado»
 * sin haber guardado nada.
 */
export const formEndpoint: string = import.meta.env.PUBLIC_FORM_ENDPOINT ?? ''
