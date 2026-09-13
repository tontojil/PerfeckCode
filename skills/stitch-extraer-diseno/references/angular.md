# Angular — Que extraer

Donde buscar: `src/styles.scss`, `src/app/**/*.component.scss`, `angular.json`, `src/theme/*`, Material `mat.define-palette`.

Que extraer:
- `styles.scss` (`body`, `:root`) -> fondo raiz y vars globales.
- Tema Material (`primary`, `accent`, `warn`) -> roles de color.
- `*.component.scss` de boton, card, nav, form -> radios y estados.
- `font-family` en `index.html` o `styles.scss` -> tipografia.
- Breakpoints (`media-query`, CDK Layout) -> grid y colapso movil.

Ejemplo de token:
```scss
$primary: mat.define-palette(mat.$teal-palette, 800); // #265968
// -> "Deep Lagoon Teal" #265968 (CTA primario, links)
h1 { font: 700 40px/1.1 Roboto; letter-spacing: -0.02em; }
// -> H1 Roboto 40px/700/tight, display compacto
```
Regla: paleta Material manda; SCSS de componentes revela overrides.
