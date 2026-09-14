# readlater-epub-landing

Landing pública de ReadLater EPUB. Astro + Tailwind, salida estática, publicada en GitHub Pages con `noindex` hasta que haya lanzamiento aprobado.

## Desarrollo

```
npm install
npm run dev
```

Copia `.env.example` a `.env` para probar el formulario contra un endpoint real de Formspree (opcional; sin él el formulario se ve pero no envía).

## Comprobaciones

```
npm run build
npm run verificar
```

`verificar` comprueba lo que no se puede perder: copy aprobado presente y en orden, `noindex`/`robots.txt`, formulario, ausencia de precio, ausencia de secretos y rutas que resuelven. Se ejecuta también en el despliegue (`.github/workflows/pages.yml`) y bloquea la publicación si falla.

## Estructura

- `src/content/copy.ts` — todo el texto visible, congelado. La composición vive en los componentes, las palabras aquí.
- `src/components/secciones/` — una sección por fichero, en el orden de `src/pages/index.astro`.
- `src/components/WaitlistForm.astro` — el único CTA de la landing.
- `scripts/verificar.mjs` — el script de comprobación.
