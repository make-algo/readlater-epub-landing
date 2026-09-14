/**
 * Copy congelado de la landing v1 — control (Fase 3 de `launch-squad`).
 *
 * Fuente: `docs/gtm/02-propuesta-valor-mensaje.md` (versión A, titular/subtítulo,
 * nombre, objeciones) y `docs/gtm/03-estructura-landing.md` (nombres de sección,
 * texto de expectativa del CTA, FAQ) del repo `readlater-epub`. Nada de esto se
 * reescribe aquí: solo se compone. Si algo no encaja, se señala en la issue —
 * no se cambia en silencio.
 */

export const saltar = 'Saltar al contenido'

export const site = {
  title: 'ReadLater EPUB — de Recordatorios a un libro para tu Kindle',
  description:
    'Los enlaces que guardas en Recordatorios, convertidos en un único EPUB con índice, listo para tu Kindle. Sin cuenta, sin nube: todo ocurre en tu Mac.',
} as const

export const hero = {
  titular:
    'Los enlaces que guardas en Recordatorios, convertidos en un libro con índice para tu Kindle.',
  subtitulo:
    'ReadLater EPUB junta lo que acumulas en Recordatorios y genera un único EPUB navegable — sin cuenta, sin nube, sin mandarlos uno a uno.',
  cta: 'Entra en la lista de espera',
} as const

export const demo = {
  nombre: 'Así llega a tu Kindle',
  intro:
    'El resultado no son artículos sueltos: es un único EPUB con índice, navegable como un libro.',
  rotulo: 'Vista previa en lector de escritorio — pendiente sustituir por fotografía de Kindle real',
  placeholderId: 'kindle-real-pendiente',
  indiceAlt: 'Tabla de contenidos del EPUB generado por ReadLater EPUB, con los artículos guardados de la semana',
  paginaAlt: 'Página de artículo dentro del EPUB, con tipografía y maquetación pensadas para e-ink',
} as const

export const pasos = {
  nombre: 'Tres pasos, cero apps nuevas',
  lista: [
    {
      titulo: 'Compartir → Recordatorios.',
      texto: 'Desde Safari o cualquier app, el gesto de compartir que ya usas.',
    },
    {
      titulo: 'Abrir ReadLater EPUB.',
      texto: 'Un clic en el Mac, sin login.',
    },
    {
      titulo: 'EPUB en tu Kindle.',
      texto: 'Arrastra o envía el fichero — no hay paso de nube intermedio.',
    },
  ],
} as const

export const comparativa = {
  nombre: '¿Y por qué no uso ya Send to Kindle?',
  sendToKindle: {
    titulo: 'Send to Kindle',
    texto: 'Un documento por artículo, sin índice entre ellos, y hay que acordarse en el momento de leer el enlace.',
  },
  readlater: {
    titulo: 'ReadLater EPUB',
    texto: 'La semana acumulada en Recordatorios se convierte en un solo documento navegable, sin depender de acordarte al momento.',
  },
  otros:
    'Instapaper, Readwise y Matter son servicios en la nube con cuenta y, casi todos, con suscripción. ReadLater EPUB no pide cuenta porque no hay servidor que mantener.',
} as const

export const privacidad = {
  nombre: 'Se queda en tu Mac',
  texto:
    'Todo ocurre en tu Mac. Sin cuenta, sin servidor propio, sin sincronización en la nube — lo único que sale del dispositivo es el artículo que ya pediste leer.',
} as const

export const cta = {
  nombre: 'Entra en la lista de espera',
  intro: 'Todavía no hay descarga pública.',
  expectativa:
    'Todavía no hay descarga pública: la build actual no está firmada para distribución fuera de este equipo. Quien entra en la lista de espera es de los primeros en probar la beta privada en cuanto esté firmada y notarizada, y antes que nadie sabrá el precio cuando se fije. Sin spam, sin más de un email al mes.',
  email: {
    etiqueta: 'Correo',
    placeholder: 'tú@ejemplo.com',
    error: 'Escribe un correo con formato válido.',
  },
  kindle: {
    etiqueta: '¿Tienes Kindle?',
    opciones: ['Sí', 'No', 'Tengo otro e-reader'],
  },
  boton: {
    reposo: 'Entra en la lista de espera',
    enviando: 'Enviando…',
  },
  sinEndpoint: 'El alta todavía no está operativa en esta versión de prueba.',
  errorEnvio: 'Algo ha fallado al enviar el formulario. Inténtalo de nuevo en un momento.',
  ok: {
    uno: 'Ya estás en la lista con ',
    dos: '. Te avisamos en cuanto haya beta privada.',
    extra: 'Sin spam, sin más de un email al mes.',
  },
  duplicado: 'Ese correo ya está en la lista de espera.',
  legal: {
    titulo: 'Protección de datos. ',
    uno: 'Tu correo se usa solo para avisarte de la beta privada. Más detalle en la ',
    enlace: 'política de privacidad',
    dos: '. Responsable: Make Algo SL. ',
    pendiente: 'Proveedor de envío del formulario: Formspree.',
    tres: '',
  },
} as const

export const faq = {
  nombre: 'Preguntas antes de apuntarte',
  preguntas: [
    {
      q: '¿Por qué no uso directamente Send to Kindle?',
      a: 'Send to Kindle manda un documento por artículo, sin índice ni relación entre ellos, y exige acordarte en el momento de leer el enlace. ReadLater EPUB junta lo acumulado en un solo documento navegable.',
    },
    {
      q: '¿Por qué no Instapaper/Readwise/Matter, que ya hacen de todo?',
      a: 'Todos son servicios en la nube con cuenta y casi todos por suscripción; ReadLater EPUB no pide cuenta ni tiene coste recurrente porque no hay servidor que mantener. Si ya estás contento pagando por búsqueda de texto completo, resúmenes con IA o sincronía multi-dispositivo, no es para ti — es para quien solo quiere que lo guardado en el móvil llegue limpio y agrupado al Kindle.',
    },
    {
      q: '¿Y si no tengo Mac, o no lo enciendo a diario?',
      a: 'Límite real y sin resolver: el EPUB se genera al abrir la app en el Mac, no en segundo plano ni desde el móvil.',
    },
    {
      q: '¿Cuánto cuesta?',
      a: 'Aún no lo hemos fijado; quien entra en la lista de espera lo sabrá antes que nadie.',
    },
    {
      q: '¿Cuándo hay descarga?',
      a: 'Todavía no hay descarga pública: la build actual no está firmada para distribución fuera de este equipo. Quien entra en la lista de espera es de los primeros en probar la beta privada en cuanto esté firmada y notarizada.',
    },
  ],
  cta: 'Entra en la lista de espera',
} as const
