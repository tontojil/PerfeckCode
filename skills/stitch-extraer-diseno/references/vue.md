# Vue / Nuxt — Que extraer

Donde buscar: `nuxt.config.ts`, `assets/css/*`, `*.vue` (`<style scoped>`), `plugins/vuetify*`, `tailwind.config.*`.

Que extraer:
- Bloques `<template>` con `bg-*` / `text-*` -> fondo raiz y jerarquia.
- `<style scoped>` y CSS vars `--color-*` -> tokens intencionales.
- Config Vuetify (`theme.themes`) o Tailwind `extend.colors` -> paleta.
- `font-family`, `@font-face`, links Google Fonts -> tipografia.
- Props de componentes (`variant`, `size`, `rounded`) -> estilos de botones/cards.

Ejemplo de token:
```vue
<style>:root { --brand-primary: #294056; }</style>
<!-- -> "Deep Muted Teal-Navy" #294056 (CTA, nav activa) -->
<span class="text-4xl font-bold tracking-tight">Titulo</span>
<!-- -> H1 36px/800/tight, mismo patron en hero y cards -->
```
Regla: tokens globales primero; scoped solo para excepciones.
