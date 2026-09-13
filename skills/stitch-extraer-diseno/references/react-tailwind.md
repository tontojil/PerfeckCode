# React + Tailwind — Que extraer

Donde buscar: `tailwind.config.{js,ts}`, `globals.css`, `src/theme/*`, `components/**/*.tsx`.

Que extraer:
- `theme.extend.colors` -> paleta con roles (primary, surface, accent).
- `theme.extend.fontFamily` -> familias + caracter (geometrica, humanista).
- `theme.extend.spacing` / `borderRadius` / `boxShadow` -> escala base.
- Clases `bg-*`, `text-*`, `max-w-*` en layouts -> fondo raiz y ancho.
- Variantes `hover:`, `focus:`, `dark:` -> estados de botones y cards.

Ejemplo de token:
```js
colors: { brand: { DEFAULT: '#294056', soft: '#E8EEF2' } }
// -> "Deep Muted Teal-Navy" #294056 (CTA primario), "Pale Mist" #E8EEF2 (fondo)
fontFamily: { sans: ['Inter', 'sans-serif'] }
// -> Inter, sans geometrica neutra, H1 40px/700/-0.02em
```
Regla: config manda; componentes solo para overrides.
