#!/usr/bin/env node
/**
 * Comprobación automática de los criterios de aceptación de MAK-95 (esqueleto
 * compartido, Fase 3 de `launch-squad`) que se pueden automatizar: copy
 * congelado presente y en orden, `noindex`/`robots.txt`, formulario, ausencia
 * de precio, ausencia de secretos, rutas que resuelven y placeholder de la
 * demo correctamente rotulado.
 *
 * MAK-100 (Fase 4, variante B) suma `/b/` a RUTAS: mismo copy, mismo orden,
 * mismo formulario que el control, verificado sobre el HTML ya construido de
 * esa ruta — la variante no se da por buena a ojo.
 *
 *   npm run build && npm run verificar
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const RUTAS = [
  ['control /', 'dist/index.html'],
  ['variante A /a/', 'dist/a/index.html'],
  ['variante B /b/', 'dist/b/index.html'],
]

const faltan = RUTAS.filter(([, f]) => !existsSync(f))
if (faltan.length) {
  console.error(`No existen ${faltan.map(([, f]) => f).join(', ')}. Ejecuta primero: npm run build`)
  process.exit(1)
}

const visible = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&iexcl;/g, '¡')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const norm = (s) => s.replace(/\s+/g, ' ').trim()

// --- Copy congelado que tiene que llegar literal (00-alcance-landing-v1.md,
//     02-propuesta-valor-mensaje.md, 03-estructura-landing.md).
const INNEGOCIABLES = [
  ['titular', 'Los enlaces que guardas en Recordatorios, convertidos en un libro con índice para tu Kindle.'],
  [
    'subtítulo',
    'ReadLater EPUB junta lo que acumulas en Recordatorios y genera un único EPUB navegable — sin cuenta, sin nube, sin mandarlos uno a uno.',
  ],
  ['nombre sección Demo', 'Así llega a tu Kindle'],
  ['nombre sección Cómo funciona', 'Tres pasos, cero apps nuevas'],
  ['nombre sección Comparativa', '¿Y por qué no uso ya Send to Kindle?'],
  ['nombre sección Privacidad', 'Se queda en tu Mac'],
  ['nombre sección CTA', 'Entra en la lista de espera'],
  ['nombre sección FAQ', 'Preguntas antes de apuntarte'],
  [
    'texto de expectativa del CTA',
    'Todavía no hay descarga pública: la build actual no está firmada para distribución fuera de este equipo. Quien entra en la lista de espera es de los primeros en probar la beta privada en cuanto esté firmada y notarizada, y antes que nadie sabrá el precio cuando se fije. Sin spam, sin más de un email al mes.',
  ],
  [
    'FAQ · Send to Kindle',
    '¿Por qué no uso directamente Send to Kindle?',
  ],
  ['FAQ · competidores en la nube', '¿Por qué no Instapaper/Readwise/Matter, que ya hacen de todo?'],
  ['FAQ · sin Mac', '¿Y si no tengo Mac, o no lo enciendo a diario?'],
  ['FAQ · precio', '¿Cuánto cuesta?'],
  ['FAQ · precio, respuesta', 'Aún no lo hemos fijado; quien entra en la lista de espera lo sabrá antes que nadie.'],
  ['FAQ · descarga', '¿Cuándo hay descarga?'],
  ['rótulo del placeholder de la demo', 'Vista previa en lector de escritorio — pendiente sustituir por fotografía de Kindle real'],
]

// El orden en que el argumento tiene que leerse, sección a sección.
const ORDEN = [
  'Los enlaces que guardas en Recordatorios, convertidos en un libro con índice para tu Kindle.',
  'Así llega a tu Kindle',
  'Tres pasos, cero apps nuevas',
  '¿Y por qué no uso ya Send to Kindle?',
  'Se queda en tu Mac',
  'Entra en la lista de espera',
  'Preguntas antes de apuntarte',
]

// Ninguna cifra ni palabra de precio en ningún punto del HTML (CA de MAK-95).
const PRECIO = ['€', '$', 'gratis', 'free']

const fallos = []
const mal = (ruta, mensaje) => fallos.push(`${ruta}: ${mensaje}`)

for (const [ruta, fichero] of RUTAS) {
  const html = readFileSync(fichero, 'utf8')
  const texto = visible(html)
  const bajo = texto.toLowerCase()
  const errores = fallos.length

  for (const [nombre, esperado] of INNEGOCIABLES) {
    if (!texto.includes(norm(esperado))) mal(ruta, `${nombre}: NO aparece literal`)
  }

  let desde = -1
  for (const frase of ORDEN) {
    const donde = texto.indexOf(frase, desde + 1)
    if (donde < 0) mal(ruta, `orden: «${frase.slice(0, 40)}…» no aparece a partir de la posición previa`)
    else desde = donde
  }

  const encontradas = PRECIO.filter((c) => bajo.includes(c.toLowerCase()))
  if (encontradas.length) mal(ruta, `aparece precio: ${encontradas.map((c) => `«${c}»`).join(', ')}`)

  if (!/name="email"[^>]*type="email"|type="email"[^>]*name="email"/.test(html))
    mal(ruta, 'el formulario no tiene un campo email')
  if (!texto.includes('¿Tienes Kindle?')) mal(ruta, 'falta la pregunta «¿Tienes Kindle?»')
  for (const opcion of ['Sí', 'No', 'Tengo otro e-reader'])
    if (!texto.includes(opcion)) mal(ruta, `falta la opción «${opcion}» de la pregunta Kindle`)

  if (!/data-placeholder="kindle-real-pendiente"/.test(html))
    mal(ruta, 'la imagen de la demo no lleva el marcador data-placeholder="kindle-real-pendiente"')

  if (!/name="_gotcha"/.test(html)) mal(ruta, 'el honeypot del formulario no se llama _gotcha')

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
  if (!title) mal(ruta, 'falta <title>')
  if (description.length === 0 || description.length > 160)
    mal(ruta, `la meta description mide ${description.length} caracteres`)
  if (!/property="og:title"/.test(html) || !/property="og:description"/.test(html))
    mal(ruta, 'faltan metadatos Open Graph')

  if (!/<meta name="robots" content="noindex/.test(html)) mal(ruta, 'falta el noindex')

  if (fallos.length === errores) console.log(`ok  ${ruta} · copy, orden, formulario, demo y metadatos`)
}

// --- Sin secretos: ni claves ni endpoints reales versionados. El .env.example
//     va vacío y no se commitea ningún .env real.
if (existsSync('.env')) fallos.push('hay un .env versionado en el repo — nunca debe existir')
const envExample = existsSync('.env.example') ? readFileSync('.env.example', 'utf8') : ''
if (/PUBLIC_FORM_ENDPOINT=.+/.test(envExample.replace(/#.*$/gm, '').trim()))
  fallos.push('.env.example trae un valor real en PUBLIC_FORM_ENDPOINT — debe ir vacío')
const SECRETOS = [/sk-[a-zA-Z0-9]{16,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/]
function ficheros(dir, ext) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((n) => {
    const ruta = join(dir, n)
    if (statSync(ruta).isDirectory()) return ficheros(ruta, ext)
    return n.endsWith(ext) ? [ruta] : []
  })
}
for (const f of [...ficheros('src', '.astro'), ...ficheros('src', '.ts'), ...ficheros('dist', '.html')]) {
  const texto = readFileSync(f, 'utf8')
  for (const patron of SECRETOS) if (patron.test(texto)) fallos.push(`${f}: parece contener un secreto`)
}
if (!fallos.some((f) => f.includes('secreto') || f.includes('.env')))
  console.log('ok  sin secretos versionados ni endpoints reales en .env.example')

// --- Sin recursos de terceros: nada que cargue de un dominio ajeno al propio.
const PROPIO = 'https://make-algo.github.io/'
const ajeno = (u) => /^https?:\/\//.test(u) && !u.startsWith(PROPIO)
function cargas(texto) {
  const urls = []
  for (const m of texto.matchAll(/\ssrc="([^"]+)"/g)) urls.push(m[1])
  for (const m of texto.matchAll(/<link\b[^>]*>/g)) {
    if (/rel="(canonical|alternate)"/.test(m[0])) continue
    const href = m[0].match(/href="([^"]+)"/)
    if (href) urls.push(href[1])
  }
  return urls
}
const paginas = ficheros('dist', '.html')
const hojas = ficheros('dist', '.css')
const terceros = []
for (const f of [...paginas, ...hojas]) {
  for (const u of cargas(readFileSync(f, 'utf8'))) if (ajeno(u)) terceros.push(`${f}: ${u}`)
}
if (terceros.length) fallos.push(`recursos de dominios ajenos: ${terceros.join(', ')}`)
else console.log(`ok  sin recursos de terceros (${paginas.length} páginas, ${hojas.length} hojas de estilo)`)

// --- Rutas de todas las variantes publicadas. Solo existe el control por
//     ahora (MAK-95 es Fase 3; la Fase 4 añade /a/ y /b/ a esta lista).
const RUTAS_ESPERADAS = [
  'dist/index.html',
  'dist/b/index.html',
  'dist/gracias/index.html',
  'dist/privacidad/index.html',
  'dist/404.html',
]
const rutasFaltantes = RUTAS_ESPERADAS.filter((r) => !existsSync(r))
if (rutasFaltantes.length) fallos.push(`faltan rutas: ${rutasFaltantes.join(', ')}`)
else console.log(`ok  rutas publicadas · ${RUTAS_ESPERADAS.join(', ')}`)

// --- El robots.txt sigue bloqueando todo. Desbloquearlo es decisión humana.
const robots = readFileSync('dist/robots.txt', 'utf8')
if (!/User-agent:\s*\*/.test(robots) || !/Disallow:\s*\/\s*$/m.test(robots))
  fallos.push('el robots.txt ya no bloquea todo el sitio')
else console.log('ok  robots.txt · sigue bloqueando la versión de prueba')

// --- Sitemap: solo el control. Cuando existan /a/ y /b/, siguen sin entrar
//     (son pestañas de revisión, no páginas del sitio) — igual que en echo.
const sitemapPath = 'dist/sitemap-0.xml'
if (!existsSync(sitemapPath)) fallos.push('falta dist/sitemap-0.xml')
else {
  const sitemap = readFileSync(sitemapPath, 'utf8')
  const enSitemap = (sitemap.match(/<loc>([^<]*)<\/loc>/g) ?? []).length
  if (enSitemap !== 1) fallos.push(`el sitemap tiene ${enSitemap} URL, se esperaba 1`)
  else console.log('ok  sitemap · una sola URL')
}

if (fallos.length) {
  console.error('\nFALLA la comprobación:\n' + fallos.map((f) => `  ✗ ${f}`).join('\n'))
  process.exit(1)
}

console.log('\nTodo correcto.')
