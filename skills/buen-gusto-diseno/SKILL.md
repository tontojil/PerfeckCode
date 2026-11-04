---
name: buen-gusto-diseno
description: "Generación de archivos DESIGN.md para Google Stitch con estándares premium de tipografía, color, layout y movimiento. (DESIGN.md, design system, Stitch)"
allowed-tools:
  - "StitchMCP"
  - "Read"
  - "Write"
---

# Stitch Design Taste — Semantic Design System Skill

## Overview
This skill generates `DESIGN.md` files optimized for Google Stitch screen generation. It translates the battle-tested anti-slop frontend engineering directives into Stitch's native semantic design language — descriptive, natural-language rules paired with precise values that Stitch's AI agent can interpret to produce premium, non-generic interfaces.

The generated `DESIGN.md` serves as the **single source of truth** for prompting Stitch to generate new screens that align with a curated, high-agency design language. Stitch interprets design through **"Visual Descriptions"** supported by specific color values, typography specs, and component behaviors.

## Prerequisites
- Access to Google Stitch via [labs.google.com/stitch](https://labs.google.com/stitch)
- Optionally: Stitch MCP Server for programmatic integration with Cursor, Antigravity, or Gemini CLI

## The Goal
Generate a `DESIGN.md` file that encodes:
1. **Visual atmosphere** — the mood, density, and design philosophy
2. **Color calibration** — neutrals, accents, and banned patterns with hex codes
3. **Typographic architecture** — font stacks, scale hierarchy, and anti-patterns
4. **Component behaviors** — buttons, cards, inputs with interaction states
5. **Layout principles** — grid systems, spacing philosophy, responsive strategy
6. **Motion philosophy** — animation engine specs, spring physics, perpetual micro-interactions
7. **Anti-patterns** — explicit list of banned AI design clichés

## Analysis & Synthesis Instructions

### 1. Define the Atmosphere
Evaluate the target project's intent. Use evocative adjectives from the taste spectrum:
- **Density:** "Art Gallery Airy" (1–3) → "Daily App Balanced" (4–7) → "Cockpit Dense" (8–10)
- **Variance:** "Predictable Symmetric" (1–3) → "Offset Asymmetric" (4–7) → "Artsy Chaotic" (8–10)
- **Motion:** "Static Restrained" (1–3) → "Fluid CSS" (4–7) → "Cinematic Choreography" (8–10)

Default baseline: Creativity 9, Variance 8, Motion 6, Density 5. Adapt dynamically based on user's vibe description.

### 2. Map the Color Palette
For each color provide: **Descriptive Name** + **Hex Code** + **Functional Role**.

**Mandatory constraints:**
- Maximum 1 accent color. Saturation below 80%
- The "AI Purple/Blue Neon" aesthetic is strictly BANNED — no purple button glows, no neon gradients
- Use absolute neutral bases (Zinc/Slate) with high-contrast singular accents
- Stick to one palette for the entire output — no warm/cool gray fluctuation
- Never use pure black (`#000000`) — use Off-Black, Zinc-950, or Charcoal

### 3. Establish Typography Rules
- **Display/Headlines:** Track-tight, controlled scale. Not screaming. Hierarchy through weight and color, not just massive size
- **Body:** Relaxed leading, max 65 characters per line
- **Font Selection:** `Inter` is BANNED for premium/creative contexts. Force unique character: `Geist`, `Outfit`, `Cabinet Grotesk`, or `Satoshi`
- **Serif Ban:** Generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`) are BANNED. If serif is needed for editorial/creative contexts, use only distinctive modern serifs: `Fraunces`, `Gambarino`, `Editorial New`, or `Instrument Serif`. Serif is always BANNED in dashboards or software UIs
- **Dashboard Constraint:** Use Sans-Serif pairings exclusively (`Geist` + `Geist Mono` or `Satoshi` + `JetBrains Mono`)
- **High-Density Override:** When density exceeds 7, all numbers must use Monospace

### 4. Define the Hero Section
The Hero is the first impression and must be creative, striking, and never generic:
- **Inline Image Typography:** Embed small, contextual photos or visuals directly between words or letters in the headline. Images sit inline at type-height, rounded, acting as visual punctuation. This is the signature creative technique
- **No Overlapping:** Text must never overlap images or other text. Every element occupies its own clean spatial zone
- **No Filler Text:** "Scroll to explore", "Swipe down", scroll arrow icons, bouncing chevrons are BANNED. The content should pull users in naturally
- **Asymmetric Structure:** Centered Hero layouts BANNED when variance exceeds 4
- **CTA Restraint:** Maximum one primary CTA. No secondary "Learn more" links

### 5. Describe Component Stylings
For each component type, describe shape, color, shadow depth, and interaction behavior:
- **Buttons:** Tactile push feedback on active state. No neon outer glows. No custom mouse cursors
- **Cards:** Use ONLY when elevation communicates hierarchy. Tint shadows to background hue. For high-density layouts, replace cards with border-top dividers or negative space
- **Inputs/Forms:** Label above input, helper text optional, error text below. Standard gap spacing
- **Loading States:** Skeletal loaders matching layout dimensions — no generic circular spinners
- **Empty States:** Composed compositions indicating how to populate data
- **Error States:** Clear, inline error reporting

### 6. Define Layout Principles
- No overlapping elements — every element occupies its own clear spatial zone. No absolute-positioned content stacking
- Centered Hero sections are BANNED when variance exceeds 4 — force Split Screen, Left-Aligned, or Asymmetric Whitespace
- The generic "3 equal cards horizontally" feature row is BANNED — use 2-column Zig-Zag, asymmetric grid, or horizontal scroll
- CSS Grid over Flexbox math — never use `calc()` percentage hacks
- Contain layouts using max-width constraints (e.g., 1400px centered)
- Full-height sections must use `min-h-[100dvh]` — never `h-screen` (iOS Safari catastrophic jump)

### 7. Define Responsive Rules
Every design must work across all viewports:
- **Mobile-First Collapse (< 768px):** All multi-column layouts collapse to single column. No exceptions
- **No Horizontal Scroll:** Horizontal overflow on mobile is a critical failure
- **Typography Scaling:** Headlines scale via `clamp()`. Body text minimum `1rem`/`14px`
- **Touch Targets:** All interactive elements minimum `44px` tap target
- **Image Behavior:** Inline typography images (photos between words) stack below headline on mobile
- **Navigation:** Desktop horizontal nav collapses to clean mobile menu
- **Spacing:** Vertical section gaps reduce proportionally (`clamp(3rem, 8vw, 6rem)`)

### 8. Encode Motion Philosophy
- **Spring Physics default:** `stiffness: 100, damping: 20` — premium, weighty feel. No linear easing
- **Perpetual Micro-Interactions:** Every active component should have an infinite loop state (Pulse, Typewriter, Float, Shimmer)
- **Staggered Orchestration:** Never mount lists instantly — use cascade delays for waterfall reveals
- **Performance:** Animate exclusively via `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`. Grain/noise filters on fixed pseudo-elements only

### 9. List Anti-Patterns (AI Tells)
Encode these as explicit "NEVER DO" rules in the DESIGN.md:
- No emojis anywhere
- No `Inter` font
- No generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`) — distinctive modern serifs only if needed
- No pure black (`#000000`)
- No neon/outer glow shadows
- No oversaturated accents
- No excessive gradient text on large headers
- No custom mouse cursors
- No overlapping elements — clean spatial separation always
- No 3-column equal card layouts
- No generic names ("John Doe", "Acme", "Nexus")
- No fake round numbers (`99.99%`, `50%`)
- No fabricated data or statistics — never generate metrics, performance numbers, uptime percentages, response times, or any data that the user did not explicitly provide. "99.98% UPTIME SLA", "124ms AVG. RESPONSE", "18.5k DEPLOY CYCLES" are invented AI filler. If real data is not available, use clear placeholder labels like `[metric]` instead of making up numbers
- No fake system/metric sections — "SYSTEM PERFORMANCE METRICS", "KEY STATISTICS", "BY THE NUMBERS" dashboard cards filled with invented data are BANNED
- No `LABEL // YEAR` formatting — "SYSTEM // 2024", "METRICS // 2025" is a lazy AI convention, not real design typography
- No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen")
- No filler UI text: "Scroll to explore", "Swipe down", scroll arrows, bouncing chevrons
- No broken Unsplash links — use `picsum.photos` or SVG avatars
- No centered Hero sections (for high-variance projects)

## Output Format (DESIGN.md Structure)

```markdown
# Design System: [Project Title]

## 1. Visual Theme & Atmosphere
(Evocative description of the mood, density, variance, and motion intensity.
Example: "A restrained, gallery-airy interface with confident asymmetric layouts
and fluid spring-physics motion. The atmosphere is clinical yet warm — like a
well-lit architecture studio.")

## 2. Color Palette & Roles
- **Canvas White** (#F9FAFB) — Primary background surface
- **Pure Surface** (#FFFFFF) — Card and container fill
- **Charcoal Ink** (#18181B) — Primary text, Zinc-950 depth
- **Muted Steel** (#71717A) — Secondary text, descriptions, metadata
- **Whisper Border** (rgba(226,232,240,0.5)) — Card borders, 1px structural lines
- **[Accent Name]** (#XXXXXX) — Single accent for CTAs, active states, focus rings
(Max 1 accent. Saturation < 80%. No purple/neon.)

## 3. Typography Rules
- **Display:** [Font Name] — Track-tight, controlled scale, weight-driven hierarchy
- **Body:** [Font Name] — Relaxed leading, 65ch max-width, neutral secondary color
- **Mono:** [Font Name] — For code, metadata, timestamps, high-density numbers
- **Banned:** Inter, generic system fonts for premium contexts. Serif fonts banned in dashboards.

## 4. Component Stylings
* **Buttons:** Flat, no outer glow. Tactile -1px translate on active. Accent fill for primary, ghost/outline for secondary.
* **Cards:** Generously rounded corners (2.5rem). Diffused whisper shadow. Used only when elevation serves hierarchy. High-density: replace with border-top dividers.
* **Inputs:** Label above, error below. Focus ring in accent color. No floating labels.
* **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.
* **Empty States:** Composed, illustrated compositions — not just "No data" text.

## 5. Layout Principles
(Grid-first responsive architecture. Asymmetric splits for Hero sections.
Strict single-column collapse below 768px. Max-width containment.
No flexbox percentage math. Generous internal padding.)

## 6. Motion & Interaction
(Spring physics for all interactive elements. Staggered cascade reveals.
Perpetual micro-loops on active dashboard components. Hardware-accelerated
transforms only. Isolated Client Components for CPU-heavy animations.)

## 7. Anti-Patterns (Banned)
(Explicit list of forbidden patterns: no emojis, no Inter, no pure black,
no neon glows, no 3-column equal grids, no AI copywriting clichés,
no generic placeholder names, no broken image links.)
```

## Ejemplo minimo real (copiable para Stitch)

Use este ejemplo como base. Contiene valores reales, no placeholders.
Adapta solo el acento y la atmosfera al proyecto. Respeta las
referencias a Material 3 (roles de color y elevacion) y a Apple HIG
(tamano tactil minimo y jerarquia tipografica).

```markdown
# Design System: Reserva de horas — Clinica dental

## 1. Visual Theme & Atmosphere
Interfaz equilibrada de app diaria (densidad 5/10), asimetrica moderada
(varianza 6/10) y movimiento fluido contenido (motion 5/10). Atmósfera
clinica y cálida: fondo claro aireado, una sola columna de accion y
detalles redondeados que transmiten confianza.

## 2. Color Palette & Roles
Basada en roles de Material 3 Expressive: un color primario, superficies
neutras y texto sobre superficie con contraste AA.
- ** Niebla Clinica** (#F6F7F9) — fondo general (surface container-low).
- **Superficie Pura** (#FFFFFF) — tarjetas y cabecera (surface).
- **Tinta Carbon** (#18181B) — texto principal (on-surface). Contraste 14.5:1 sobre blanco.
- **Acero Suave** (#71717A) — texto secundario y metadatos (on-surface-variant).
- **Linea Susurro** (#E2E8F0) — bordes de 1px y divisores (outline-variant).
- **Verde Profundo** (#0F766E) — unico acento para CTA primario, foco y estado activo (primary). Saturacion 67%, sin neon.
Prohibido: negro puro #000000, morado/azul neon, segundo acento.

## 3. Typography Rules
Jerarquia por peso y color, no solo por tamano (criterio Apple HIG).
- **Display:** Cabinet Grotesk 600 — titular `clamp(2rem, 4vw, 3rem)`, tracking -0.02em.
- **Body:** Satoshi 400/500 — `1rem/1.6`, maximo 65 caracteres por linea, color Acero Suave en descripciones.
- **Mono:** JetBrains Mono 400 — horarios, precios y codigos de reserva. Obligatorio para numeros en vistas densas.
Prohibido: Inter en titulares, serif genericas (Times, Georgia, Garamond).

## 4. Component Stylings
- **Boton primario:** relleno Verde Profundo, texto blanco, radio 12px, altura minima 44px segun Apple HIG. Sin brillo exterior. Al presionar traslada -1px.
- **Boton secundario:** fantasma con borde Linea Susurro, misma altura 44px.
- **Tarjeta de hora:** fondo blanco, borde 1px Linea Susurro, radio 16px, sombra difusa tintada `0 8px 24px rgba(24,24,27,0.06)`.
- **Input:** etiqueta arriba, ayuda opcional debajo, error en rojo #B42318 debajo del campo. Anillo de foco de 2px en Verde Profundo.
- **Cargando:** esqueleto con brillo que replica la fila de horarios. Sin spinner circular generico.

## 5. Layout Principles
Estructura de grilla, sin superposiciones (criterio Material 3 y Apple HIG).
- Contenedor maximo 1200px centrado, padding lateral 24px (16px en movil).
- Hero asimetrico: texto a la izquierda (7 columnas), tarjeta de reserva a la derecha (5 columnas). En movil colapsa a una columna.
- Grilla de horarios: 4 columnas en escritorio, 2 en tablet, 1 en movil. Secciones full-height con `min-h-[100dvh]`, nunca `h-screen`.
- Espaciado vertical entre secciones `clamp(3rem, 8vw, 6rem)`.

## 6. Motion & Interaction
- Fisica de resorte `stiffness: 100, damping: 20` en apertura de tarjeta y dialogo de confirmacion.
- Revelado en cascada de la lista de horarios con retardo de 40ms por fila.
- Solo animar `transform` y `opacity`. Sin animar `top`, `left`, `width` ni `height`.

## 7. Anti-Patterns (Banned)
Sin emojis, sin negro puro, sin 3 tarjetas iguales en fila, sin texto "Scroll to explore", sin nombres genericos tipo "John Doe", sin metricas inventadas tipo "99.99% satisfaccion". Si no hay dato real, usar `[dato pendiente]`.
```

Referencias aplicadas en el ejemplo:
- Material 3 Expressive para roles `surface / on-surface / primary` y elevacion contenida: https://m3.material.io/
- Apple HIG Foundations para objetivo tactil minimo de 44px y jerarquia legible: https://developer.apple.com/design/human-interface-guidelines

## Best Practices
- **Be Descriptive:** "Deep Charcoal Ink (#18181B)" — not just "dark text"
- **Be Functional:** Explain what each element is used for
- **Be Consistent:** Same terminology throughout the document
- **Be Precise:** Include exact hex codes, rem values, pixel values in parentheses
- **Be Opinionated:** This is not a neutral template — it enforces a specific, premium aesthetic

## Tips for Success
1. Start with the atmosphere — understand the vibe before detailing tokens
2. Look for patterns — identify consistent spacing, sizing, and styling
3. Think semantically — name colors by purpose, not just appearance
4. Consider hierarchy — document how visual weight communicates importance
5. Encode the bans — anti-patterns are as important as the rules themselves

## Common Pitfalls to Avoid
- Using technical jargon without translation ("rounded-xl" instead of "generously rounded corners")
- Omitting hex codes or using only descriptive names
- Forgetting functional roles of design elements
- Being too vague in atmosphere descriptions
- Ignoring the anti-pattern list — these are what make the output premium
- Defaulting to generic "safe" designs instead of enforcing the curated aesthetic

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- Stitch DESIGN.md overview: https://stitch.withgoogle.com/docs/design-md/overview
- Stitch prompting: https://stitch.withgoogle.com/docs/learn/prompting
- Material 3 Expressive: https://m3.material.io/
- Apple HIG Foundations: https://developer.apple.com/design/human-interface-guidelines
- GSAP docs: https://gsap.com/docs/v3/

Repos famosos (solo sistemas de diseño verificables):

- https://github.com/alexpate/awesome-design-systems
- https://github.com/klaufel/awesome-design-systems

Checklist:

- [ ] DESIGN.md con atmosfera, color con hex, tipografia, componentes, layout, motion y anti-patrones.
- [ ] Maximo 1 acento con saturacion menor a 80%. Sin purpura neon.
- [ ] Tipografia sin Inter generico. Mono para numeros densos.
- [ ] Hero asimetrico con maximo 1 CTA. Sin filler tipo Scroll to explore.
- [ ] Layout sin overlaps, con max-width y min-h-dvh en secciones full.
- [ ] Motion con spring y solo transform y opacity.
- [ ] Sin emojis, sin negro puro, sin 3 cards iguales, sin datos inventados.
- [ ] Responsive single column bajo 768px con touch 44px.
