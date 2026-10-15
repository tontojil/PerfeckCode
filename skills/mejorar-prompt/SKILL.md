---
name: mejorar-prompt
description: Convierte ideas vagas de UI en prompts pulidos para Stitch. Mejora el detalle, agrega claves UI/UX, incluye contexto del design system y ordena la salida. Usalo cuando quieras mejorar un prompt antes de generar. (Stitch prompts, UI/UX, prompt engineering)
allowed-tools:
  - "Read"
  - "Write"
metadata:
  version: "1.1.0"
---

# Mejorar prompt para Stitch

Actua como **ingeniero de prompts para Stitch**. Tu trabajo es transformar ideas vagas o incompletas de generacion de UI en prompts pulidos y optimizados que produzcan mejores resultados en Stitch.

## Prerrequisitos

Antes de mejorar prompts, consulta la documentacion oficial de Stitch para conocer las recomendaciones vigentes:

- **Guia de prompting efectivo de Stitch**: https://stitch.withgoogle.com/docs/learn/prompting/

Esta guia contiene recomendaciones actualizadas que pueden complementar o reemplazar los patrones de esta skill.

## Cuando usar esta skill

Activar cuando la persona usuaria quiere:

- Pulir un prompt de UI antes de enviarlo a Stitch
- Mejorar un prompt que produjo malos resultados
- Agregar consistencia del design system a una idea simple
- Estructurar un concepto vago en un prompt accionable

## Ejemplo minimo

Entrada vaga y salida esperada en formato minimo:

**Entrada:**

> "quiero una pagina de precios"

**Salida minima:**

```markdown
Pagina de precios clara, con tres planes y CTA principal destacado.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Theme: Light, minimal, professional
- Background: Clean White (#ffffff)
- Primary Accent: Deep Blue (#2563eb) for CTA and links
- Text Primary: Near Black (#111827)

**Page Structure:**
1. **Header:** Navigation with logo and menu items
2. **Pricing:** Three plan cards, middle plan highlighted
3. **Footer:** Links and copyright
```

Si el proyecto tiene `DESIGN.md`, reemplazar el bloque de sistema por los tokens reales de ese archivo.

## Pipeline de mejora

Seguir estos pasos para mejorar cualquier prompt:

### Paso 1: Evaluar la entrada

Verificar que elementos faltan en el prompt de la persona usuaria:

| Elemento | Verificar | Si falta... |
|---------|-----------|---------------|
| **Plataforma** | "web", "mobile", "desktop" | Agregar segun contexto o preguntar |
| **Tipo de pagina** | "landing page", "dashboard", "form" | Inferir desde la descripcion |
| **Estructura** | Secciones o componentes numerados | Crear estructura logica de pagina |
| **Estilo visual** | Adjetivos, ambiente, tono | Agregar descriptores adecuados |
| **Colores** | Valores especificos o roles | Agregar design system o sugerir |
| **Componentes** | Terminos especificos de UI | Traducir a keywords correctas |

### Paso 2: Revisar DESIGN.md

Buscar un archivo `DESIGN.md` en el proyecto actual:

**Si DESIGN.md existe:**

1. Leer el archivo para extraer el bloque del design system
2. Incluir paleta de colores, tipografia y estilos de componentes
3. Dar formato como seccion "DESIGN SYSTEM (REQUIRED)" en la salida

**Si DESIGN.md no existe:**

1. Agregar esta nota al final del prompt mejorado:

```
---
Tip: para disenos consistentes en varias pantallas, crea un archivo DESIGN.md
con la skill `buen-gusto-diseno`. Asi todas las paginas comparten el mismo
lenguaje visual.
```

### Paso 3: Aplicar mejoras

Transformar la entrada con estas tecnicas:

#### A. Agregar keywords UI/UX

Reemplazar terminos vagos con nombres especificos de componentes:

| Vago | Mejorado |
|-------|----------|
| "menu at the top" | "navigation bar with logo and menu items" |
| "button" | "primary call-to-action button" |
| "list of items" | "card grid layout" o "vertical list with thumbnails" |
| "form" | "form with labeled input fields and submit button" |
| "picture area" | "hero section with full-width image" |

#### B. Amplificar el ambiente

Agregar adjetivos descriptivos para fijar el tono:

| Basico | Mejorado |
|-------|----------|
| "modern" | "clean, minimal, with generous whitespace" |
| "professional" | "sophisticated, trustworthy, with subtle shadows" |
| "fun" | "vibrant, playful, with rounded corners and bold colors" |
| "dark mode" | "dark theme with high-contrast accents on deep backgrounds" |

#### C. Estructurar la pagina

Organizar el contenido en secciones numeradas:

```markdown
**Page Structure:**
1. **Header:** Navigation with logo and menu items
2. **Hero Section:** Headline, subtext, and primary CTA
3. **Content Area:** [Describe the main content]
4. **Footer:** Links, social icons, copyright
```

#### D. Dar formato correcto a colores

Cuando se mencionan colores, usar este formato:

```
Nombre descriptivo (#hexcode) para rol funcional
```

Ejemplos:

- "Deep Ocean Blue (#1a365d) for primary buttons and links"
- "Warm Cream (#faf5f0) for page background"
- "Soft Gray (#6b7280) for secondary text"

### Paso 4: Dar formato a la salida

Estructurar el prompt mejorado en este orden:

```markdown
[One-line description of the page purpose and vibe]

**DESIGN SYSTEM (REQUIRED):**
- Platform: [Web/Mobile], [Desktop/Mobile]-first
- Theme: [Light/Dark], [style descriptors]
- Background: [Color description] (#hex)
- Primary Accent: [Color description] (#hex) for [role]
- Text Primary: [Color description] (#hex)
- [Additional design tokens...]

**Page Structure:**
1. **[Section]:** [Description]
2. **[Section]:** [Description]
...
```

## Opciones de salida

**Por defecto:** devolver el prompt mejorado como texto para copiar.

**Salida opcional a archivo:** si la persona usuaria lo pide, escribir en un archivo:

- `next-prompt.md` — para usar con la skill `stitch-generar-diseno`
- Nombre personalizado indicado por la persona usuaria

## Ejemplos completos

### Ejemplo 1: Entrada vaga a prompt estructurado

**Entrada de la persona usuaria:**

> "make me a login page"

**Salida mejorada:**

```markdown
A clean, trustworthy login page with a centered form and subtle branding.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Desktop-first
- Theme: Light, minimal, professional
- Background: Clean White (#ffffff)
- Surface: Soft Gray (#f9fafb) for form card
- Primary Accent: Deep Blue (#2563eb) for submit button and links
- Text Primary: Near Black (#111827) for headings
- Text Secondary: Medium Gray (#6b7280) for labels
- Buttons: Subtly rounded (8px), full-width on form
- Cards: Gently rounded (12px), soft shadow for elevation

**Page Structure:**
1. **Header:** Minimal logo, centered
2. **Login Card:** Centered form with email, password fields, "Forgot password?" link
3. **Submit Button:** Primary blue "Sign In" button
4. **Footer:** "Don't have an account? Sign up" link

---
Tip: para disenos consistentes en varias pantallas, crea un DESIGN.md
con la skill `buen-gusto-diseno`.
```

### Ejemplo 2: Solicitud de feature a edicion puntual

**Entrada de la persona usuaria:**

> "add a search bar"

**Salida mejorada:**

```markdown
Add a search bar to the header navigation.

**Specific changes:**
- Location: Header, right side before user avatar
- Style: Pill-shaped input with subtle gray background (#f3f4f6)
- Icon: Magnifying glass icon on the left, inside the input
- Placeholder: "Search..." in light gray (#9ca3af)
- Behavior: Expands on focus with subtle shadow
- Width: 240px default, 320px on focus

**Context:** This is a targeted edit. Make only this change while preserving all existing elements.
```

## Consejos para mejores resultados

1. **Ser especifico desde el inicio** — las entradas vagas necesitan mas mejora
2. **Respetar la intencion** — no sobredisenar si la persona quiere algo simple
3. **Mantener estructura** — las secciones numeradas ayudan a Stitch a entender jerarquia
4. **Incluir el design system** — la consistencia es clave en proyectos multipagina
5. **Un cambio por vez en ediciones** — no agrupar cambios sin relacion

## Referencias oficiales

- Guia de prompting de Stitch: https://stitch.withgoogle.com/docs/learn/prompting
- DESIGN.md en Stitch (overview): https://stitch.withgoogle.com/docs/design-md/overview
- Material 3, tipografia: https://m3.material.io/styles/typography/applying-type
- Apple HIG, redaccion: https://developer.apple.com/design/human-interface-guidelines
- Google Developer Style, encabezados: https://developers.google.com/style/headings
- Patrones de prompts y skills: https://github.com/anthropics/skills — ejemplos de estructura y buenas practicas para redactar salidas.

## Checklist de verificacion

- [ ] Plataforma, tipo de pagina y estructura numerada presentes.
- [ ] Terminos vagos reemplazados por keywords UI especificas.
- [ ] Ambiente descrito con adjetivos concretos y colores en formato Nombre (#hex) para rol.
- [ ] DESIGN.md leido e incluido como DESIGN SYSTEM REQUIRED si existe.
- [ ] Salida en orden: proposito, sistema, estructura por secciones.
- [ ] Ediciones puntuales con ubicacion, estilo y alcance en un solo cambio.
- [ ] Sin sobrediseno cuando la persona pide algo simple.
