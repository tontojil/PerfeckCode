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
