import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

// El sitio de prueba se publica en GitHub Pages bajo /readlater-epub-landing/.
// Si algún día se sirve en dominio propio, cambia `site` y quita `base`.
export default defineConfig({
  site: 'https://make-algo.github.io',
  base: '/readlater-epub-landing',
  integrations: [
    // Una sola ruta indexable: el control. Las variantes de la Fase 4 se
    // suman aquí cuando existan; hasta entonces no hay nada que filtrar.
    sitemap({ filter: (page) => page === 'https://make-algo.github.io/readlater-epub-landing/' }),
  ],
  vite: { plugins: [tailwindcss()] },
})
