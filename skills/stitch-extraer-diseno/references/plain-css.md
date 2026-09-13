# Plain CSS / SASS / Less — Que extraer

Donde buscar: `*.css`, `*.scss`, `*.less`, `variables.*`, `tokens.*`, `mixins.*`.

Que extraer:
- `:root` (`--color-*`, `--space-*`, `--font-*`) -> tokens intencionales.
- `body` (`background`, `font-family`) -> fondo raiz y tipografia base.
- Selectores `h1-h6`, `p`, `a` -> escala tipografica completa.
- Clases `.btn`, `.card`, `.nav`, `input` -> radios, bordes, sombras.
- `@media` queries -> breakpoints y estrategia movil/desktop.

Ejemplo de token:
```css
:root { --brand: #294056; --space-unit: 8px; --font-main: 'Inter', sans-serif; }
/* -> "Deep Muted Teal-Navy" #294056 (CTA); grilla base 8px; Inter neutra */
/* Deduplicar: #333 y #2C2C2C -> un solo "Charcoal" #2E2E2E */
```
Regla: variables primero; reglas sueltas solo para confirmar uso.
