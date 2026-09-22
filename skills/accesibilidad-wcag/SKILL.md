---
name: accesibilidad-wcag
description: "Para páginas usables con teclado y lector de pantalla. Checklist WCAG AA rápido. (a11y, accesibilidad, wcag)"
---

# Accesibilidad WCAG

## Core Rule

**Todo se usa solo con teclado y se entiende solo con lector de pantalla.**

## When to Use

- Nuevo formulario, boton, menu o pagina.
- Revision antes de entregar un frontend.
- Texto ilegible, sin contraste o sin foco visible.

## Process

1. **Teclado**
   - `Tab` llega a todo, `Enter` activa, `Esc` cierra. Foco siempre visible.
2. **Lector**
   - Toda imagen con `alt`, todo input con `label`, iconos decorativos con `aria-hidden`.
   - Titulos en orden `h1` luego `h2`, sin saltos.
3. **Contraste y texto**
   - Texto normal 4.5:1 minimo. Regla documental (no WCAG): minimo 12pt en documentos.
   - Nunca solo color para avisar error: texto + icono.

## Output Contract

Entregue: tabla elemento | problema | cambio, y como se probo (teclado + lector).

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- WCAG 2.2 W3C: https://www.w3.org/TR/WCAG22/
- Understanding Focus Visible 2.4.7: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- Apple HIG Accessibility: https://developer.apple.com/design/human-interface-guidelines
- Material 3 Accessibility: https://m3.material.io/foundations/accessible-design/overview

Repos famosos:

- https://github.com/dequelabs/axe-core
- https://github.com/alexpate/awesome-design-systems
- https://github.com/enaqx/awesome-react

Checklist:

- [ ] Tab llega a todo. Enter activa. Esc cierra. Sin trampas.
- [ ] Foco visible con :focus-visible y contraste 3:1 minimo.
- [ ] Contraste 4.5:1 texto normal, 3:1 texto grande y UI.
- [ ] Toda img con alt. Inputs con label. Iconos decorativos con aria-hidden.
- [ ] Headings en orden h1 luego h2, sin saltos.
- [ ] Targets 44x44 mobile, 24x24 minimo desktop segun 2.5.8.
- [ ] Error nunca solo con color: texto mas icono.
- [ ] prefers-reduced-motion y 200% zoom verificados.
