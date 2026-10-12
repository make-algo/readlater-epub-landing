import datos from '../../public/descarga.json'

/**
 * La versión que ofrece la página sale de `public/descarga.json`, que escribe
 * `scripts/publicar-version.sh` del repo `readlater-epub` en el mismo commit
 * que `appcast.xml`. Nada de versión escrita a mano aquí: en echo, la web
 * siguió ofreciendo una versión vieja tres días por eso.
 *
 * El DMG vive como adjunto de la release «actualizaciones» de este repo, la
 * misma de la que tira Sparkle.
 */
export const descarga = {
  version: datos.version,
  url: `https://github.com/make-algo/readlater-epub-landing/releases/download/actualizaciones/${datos.archivo}`,
  megas: (datos.bytes / 1_000_000).toLocaleString('es-ES', { maximumFractionDigits: 1 }),
  macos: datos.macos,
  sha256: datos.sha256,
} as const
