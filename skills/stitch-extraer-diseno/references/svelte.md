# Svelte / SvelteKit — Que extraer

Donde buscar: `src/routes/+layout.*`, `src/app.css`, `src/lib/components/*.svelte`, `svelte.config.js`.

Que extraer:
- `app.css` (`body`, `:root`) -> fondo raiz y vars `--brand-*`.
- `<style>` por componente -> radios, sombras, padding de cards/botones.
- Clases Tailwind o PostCSS en layouts -> `max-w-*`, breakpoints.
- `@font-face` o imports de fuentes -> familia + caracter.
- Estados `:hover`, `:focus-visible`, `transition:` -> micro-interacciones.

Ejemplo de token:
```css
:root { --brand: #294056; --surface: #F7F3EC; }
/* -> "Deep Muted Teal-Navy" #294056 (CTA), "Warm Parchment" #F7F3EC (fondo) */
button { border-radius: 9999px; padding: 12px 24px; }
/* -> pill, ratio 2:1, comunica amable/moderno */
```
Regla: `app.css` es la fuente; estilos locales confirman uso real.
