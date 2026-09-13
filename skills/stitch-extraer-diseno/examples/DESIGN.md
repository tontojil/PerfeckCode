---
name: harbor-notes-demo
colors:
  parchment: "#F7F3EC"
  teal-navy: "#294056"
  mist: "#E8EEF2"
  charcoal: "#2E2E2E"
  sage: "#4C7C6D"
  clay: "#C2704E"
---
# Design System: Harbor Notes Demo

## 1. Visual Theme & Atmosphere
Calm editorial minimalism with warm paper backgrounds and generous whitespace.
Feels like a quiet studio notebook: airy, trustworthy, focused on reading.

## 2. Color Palette & Roles
### Primary Foundation
- **Warm Parchment** #F7F3EC (page bg) / **Pale Mist** #E8EEF2 (surface)
### Accent & Interactive
- **Deep Muted Teal-Navy** #294056 (CTA, nav activa) / **Soft Sage** #4C7C6D (hover)
### Typography & Text Hierarchy
- **Charcoal** #2E2E2E (primario) / #6B7280 (secundario)
### Functional States
- **Warm Clay** #C2704E (warning) / #2F7D4F (success) / #B3261E (error)

## 3. Typography Rules
Inter, sans geometrica neutra; H1 40px/700/-0.02em, H2 28px/700, body 16px/1.6.
Titulares tight, cuerpo relaxed para legibilidad larga.

## 4. Component Stylings
Botones pill (9999px, 12px/24px, transicion 150ms); cards 16px radius, borde hairline.
Nav horizontal uppercase 13px + underline activo; inputs 12px radius, foco teal.

## 5. Layout Principles
Max-w 1200px, grid 12 col desktop / 1 col movil; breakpoints 640/1024px.
Secciones cada 64px, margenes 24px movil / 48px desktop; hero centrado, body izquierda.

## 6. Design System Notes for Stitch Generation
Usar lenguaje "airy paper background, calm editorial cards, pill CTA".
Recrear card grid con "Pale Mist surface, hairline border, soft hover shadow".
Iterar: primero layout, luego tono calido, al final micro-estados hover.
