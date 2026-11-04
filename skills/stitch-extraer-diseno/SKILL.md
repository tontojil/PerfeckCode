---
name: stitch-extraer-diseno
description: "Extrae el sistema de diseño (DESIGN.md) desde código frontend como React, Vue, Angular o HTML/CSS, analizando componentes, estilos y tokens. (extract design system, DESIGN.md, frontend)"
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Extraer sistema de diseño desde código

Analiza el código fuente frontend para generar un documento `DESIGN.md` que capture el lenguaje visual del proyecto: colores, tipografía, espaciado, patrones de componentes y principios de layout. Funciona sin compilar ni ejecutar la aplicación.

## Cuándo usar

- El usuario tiene un código frontend y necesita documentar su sistema de diseño.
- Se requiere migrar la identidad visual del proyecto hacia Stitch.
- El usuario pide auditar estilos o entender el lenguaje de diseño de un repositorio.
- La aplicación no compila, pero el código fuente está disponible.
- Existen estilos inconsistentes que se necesita unificar.

## Prerrequisitos

- Acceso al directorio fuente del proyecto frontend.
- No se necesita compilar ni instalar dependencias. Esta skill solo lee archivos.

---

## Flujo con tokens

### Fase 1: Descubrimiento del proyecto

#### 1. Detectar framework y herramientas

Lee primero `package.json`. Revela framework, herramientas CSS y librerías de tokens.

| Archivo señal | Framework o herramienta |
|:---|:---|
| `package.json` con `react` | React o Next.js |
| `package.json` con `vue` | Vue o Nuxt |
| `package.json` con `svelte` | Svelte o SvelteKit |
| `package.json` con `@angular/core` | Angular |
| `tailwind.config.js` o `.ts` | Tailwind CSS |
| `postcss.config.js` | Pipeline PostCSS |
| `styled-components` o `@emotion` | CSS-in-JS |
| Solo `.css`, `.scss`, `.less` | CSS plano o SASS |
| `theme.js`, `theme.ts`, `tokens.js` | Archivos de tokens |

#### 2. Mapear el árbol de fuentes

Identifica directorios clave:

```text
src/
├── components/     ← Estilos por componente
├── styles/         ← Hojas globales
├── theme/          ← Definiciones y tokens
├── assets/         ← Fuentes e imágenes
├── app.css         ← Estilos raíz
└── index.css       ← CSS de entrada
```

Revisa además `tailwind.config.js`, `globals.css`, cualquier archivo `theme.*` o `tokens.*` y configuraciones de librerías como `chakra-theme.ts`.

#### 3. Leer la guía específica del framework

Consulta el patrón de extracción que corresponda antes de continuar:

- React, Next.js, Tailwind: [references/react-tailwind.md](references/react-tailwind.md)
- Vue, Nuxt: [references/vue.md](references/vue.md)
- Svelte, SvelteKit: [references/svelte.md](references/svelte.md)
- Angular: [references/angular.md](references/angular.md)
- CSS plano, SASS, Less: [references/plain-css.md](references/plain-css.md)

---

### Fase 2: Extracción profunda por tokens

Trabaja cada dimensión de diseño en orden. El objetivo no es copiar propiedades CSS, sino entender la intención y describirla en lenguaje editorial que Stitch pueda reutilizar.

#### 1. Tema visual y ambiente

- Fondo raíz del `body` o contenedor principal. Tonos crema indican aire limpio. Tonos oscuros indican contraste dramático.
- Filosofía de espacio: valores generosos de 32px o más contra diseños compactos.
- Densidad: pocos componentes con aire indica minimalismo. Muchos elementos juntos indica densidad informativa.
- Temperatura: neutros cálidos contra grises fríos.
- Sintetiza el ambiente en una o dos frases ricas.

#### 2. Paleta de colores y roles con tokens

Busca colores en todas las capas: variables `--color-*`, `theme.extend.colors` en Tailwind, objetos `colors` o `palette`, clases `bg-*` y `text-*`.

Organiza por función, no por tono:

1. Base primaria: fondos y superficies.
2. Acento e interactivo: botones, enlaces, estados activos.
3. Texto y jerarquía: primario, secundario, terciario.
4. Estados funcionales: éxito, error, advertencia, información.

Mapea cada color a un token con nombre descriptivo, valor hex y rol. Usa como referencia los roles de color de Material 3 (`primary`, `on-primary`, `surface`, `error`) y las pautas de color de Apple HIG para modo claro y oscuro.

Consolida duplicados cercanos. Por ejemplo, `#333333` y `#2C2C2C` se unifican en un solo token de texto primario.

#### 3. Reglas tipográficas

- Familias: revisa `font-family`, `fontFamily` en Tailwind, enlaces de Google Fonts y reglas `@font-face`. Describe el carácter: geométrica, humanista, serif, sans.
- Escala: registra cada nivel H1 a H6 y cuerpo con tamaño, peso, interletraje e interlineado.
- Uso: indica qué nivel usan héroes, tarjetas y navegación.
- Alinea la escala con Material 3 (`display`, `headline`, `title`, `body`, `label`) y verifica legibilidad según Apple HIG: cuerpo mínimo legible y jerarquía clara.

#### 4. Estilos de componentes

Analiza los 4 o 5 primitivos principales:

- **Botones:** radio de borde, variantes primaria y secundaria, estados hover y foco, proporción de relleno, área táctil mínima de 44px según Apple HIG.
- **Tarjetas:** radio, sombra, borde fino, relleno interno, tratamiento de imágenes.
- **Navegación:** barra horizontal o lateral, tipografía, indicador activo, comportamiento móvil.
- **Entradas y formularios:** borde, foco visible, consistencia de radio con botones.
- **Componentes propios:** describe 1 o 2 patrones únicos del proyecto.

#### 5. Principios de layout

- Ancho máximo, sistema de columnas, puntos de corte responsivos.
- Unidad base de espaciado. Material 3 usa incrementos de 4px. Apple HIG recomienda grilla de 8pt.
- Márgenes por sección y por borde según tamaño de pantalla.
- Alineación, proporción imagen texto y distribución de peso visual.
- Comportamiento móvil: mobile first o desktop first, colapso de grilla, tamaño táctil.

#### 6. Notas para generación en Stitch

Convierte la extracción en instrucciones accionables: lenguaje de ambiente, colores por nombre más hex, 2 o 3 prompts de ejemplo para recrear componentes clave y guía de iteración.

---

### Fase 3: Escribir DESIGN.md

Guarda el resultado en `.stitch/DESIGN.md`. Crea `.stitch/` si no existe. Usa el formato del ejemplo en [examples/DESIGN.md](examples/DESIGN.md).

Incluye siempre el bloque YAML inicial con `name` y `colors`. Sin ese bloque la skill se considera incompleta.

```markdown
---
name: ejemplo-proyecto
colors:
  fondo: "#F7F3EC"
  primario: "#294056"
---
# Design System: Ejemplo Proyecto

## 1. Visual Theme & Atmosphere
## 2. Color Palette & Roles
## 3. Typography Rules
## 4. Component Stylings
## 5. Layout Principles
## 6. Design System Notes for Stitch Generation
```

## Ejemplo mínimo

Bloque YAML más dos secciones representativas:

```markdown
---
name: harbor-notes-demo
colors:
  parchment: "#F7F3EC"
  teal-navy: "#294056"
  mist: "#E8EEF2"
  charcoal: "#2E2E2E"
---

## 2. Color Palette & Roles
- **Parchment cálido** #F7F3EC: fondo de página. Token `surface`.
- **Teal-Navy profundo** #294056: acción principal y navegación activa. Token `primary`.
- **Charcoal** #2E2E2E: texto primario con contraste AA verificado.

## 3. Typography Rules
Inter, sans geométrica neutra. H1 40px/700/-0.02em, H2 28px/700, cuerpo 16px/1.6.
Titulares compactos, cuerpo amplio para lectura larga. Escala alineada a Material 3.
Área táctil mínima de 44px en controles según Apple HIG.
```

Ver el documento completo en [examples/DESIGN.md](examples/DESIGN.md).

---

### Fase 4: Integración opcional

Si el usuario desea publicar el sistema en Stitch, entrega el `DESIGN.md` generado a la skill `stitch-sistema-diseno`. Esa skill gestiona las llamadas MCP de creación y aplicación. Si solo necesita el documento, el trabajo termina en la fase 3.

## Consejos para una mejor extracción

- Lee comentarios y mensajes de commit. Suelen explicar la intención de diseño.
- Prioriza archivos de tema y tokens. Definen la intención. Los estilos dispersos muestran lo que realmente se publicó.
- Un archivo `tailwind.config.js` personalizado ya es un sistema de diseño. Extráelo primero y luego verifica excepciones en componentes.
- Las variables CSS con nombre de marca, como `--brand-primary`, son tokens intencionales. Consérvalas.

---

## Referencias oficiales y checklist

Fuentes oficiales:

- Stitch DESIGN.md: https://stitch.withgoogle.com/docs/design-md/overview
- Tailwind config: https://tailwindcss.com/docs/configuration
- Material 3, color: https://m3.material.io/styles/color/roles
- Material 3, tipografía: https://m3.material.io/styles/typography/overview
- Material 3, espaciado: https://m3.material.io/styles/spacing/overview
- Material 3, forma: https://m3.material.io/styles/shape/overview
- Apple HIG, color: https://developer.apple.com/design/human-interface-guidelines/foundations/color
- Apple HIG, tipografía: https://developer.apple.com/design/human-interface-guidelines/foundations/typography
- Apple HIG, layout: https://developer.apple.com/design/human-interface-guidelines/foundations/layout
- WCAG 2.2 contraste: https://www.w3.org/TR/WCAG22/
- Material Components Web GitHub: https://github.com/material-components/material-components-web

Checklist:

- [ ] Framework detectado por `package.json` y árbol de fuentes mapeado.
- [ ] Guía específica del framework consultada en `references/`.
- [ ] Colores con nombre descriptivo, hex, rol y token equivalente Material 3.
- [ ] Tipografía con familia, jerarquía completa, pesos e interlineado.
- [ ] Componentes clave con forma, color, estados, transiciones y área táctil.
- [ ] Layout con ancho máximo, grilla, breakpoints y unidad base de espaciado.
- [ ] Contraste verificado y modo claro u oscuro documentado según Apple HIG.
- [ ] Duplicados cercanos consolidados en un token.
- [ ] `DESIGN.md` con frontmatter YAML y notas para Stitch en lenguaje natural.
- [ ] Handoff a `stitch-sistema-diseno` si se publica en Stitch.
