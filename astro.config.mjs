import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'

// El sitio de prueba se publica en GitHub Pages bajo el dominio propio
// readlaterepub.make-algo.com (ver public/CNAME), servido en la raíz.
export default defineConfig({
  site: 'https://readlaterepub.make-algo.com',
  integrations: [
    // Una sola ruta indexable: el control. Las variantes de la Fase 4 se
    // suman aquí cuando existan; hasta entonces no hay nada que filtrar.
    sitemap({ filter: (page) => page === 'https://readlaterepub.make-algo.com/' }),
  ],
  vite: { plugins: [tailwindcss()] },
})
