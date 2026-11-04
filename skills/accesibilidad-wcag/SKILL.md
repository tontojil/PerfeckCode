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

## Comandos de contraste y auditoria

Ejecute al menos una herramienta automatica mas verificacion manual de contraste. Registre el comando exacto en el reporte.

1. **Axe-core (WCAG 2.2 AA)**
   - `npm install -g @axe-core/cli`
   - `axe https://ejemplo.com --tags wcag2aa --exit`
   - Solo criterio de contraste: `axe https://ejemplo.com --tags color-contrast --exit`
2. **Pa11y (WCAG2AA)**
   - `npx -y pa11y https://ejemplo.com --standard WCAG2AA`
   - Con reporte detallado: `npx -y pa11y https://ejemplo.com --standard WCAG2AA --reporter cli`
3. **Lighthouse solo accesibilidad**
   - `npx -y lighthouse https://ejemplo.com --only-categories=accessibility --view`
   - Salida JSON para CI: `npx -y lighthouse https://ejemplo.com --only-categories=accessibility --output=json --output-path=./a11y.json --chrome-flags="--headless"`
4. **Calculo manual de contraste segun W3C**
   - Formula oficial WCAG 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
   - Umbrales AA: texto normal 4.5:1 minimo, texto grande (24px o 19px en negrita) 3:1 minimo, componentes UI y foco 3:1 minimo segun 1.4.11 y 2.4.13.
   - Verificacion rapida con Node:
   ```js
   // Calcula ratio segun luminancia relativa W3C
   function luminancia(r, g, b) {
     const f = (c) => {
       c = c / 255;
       return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
     };
     return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
   }
   function ratio(l1, l2) {
     const [claro, oscuro] = l1 > l2 ? [l1, l2] : [l2, l1];
     return (claro + 0.05) / (oscuro + 0.05);
   }
   // Ejemplo: texto #767676 sobre fondo #FFFFFF
   console.log(ratio(luminancia(255, 255, 255), luminancia(118, 118, 118)));
   // Debe dar 4.54. Si da menos de 4.5, no pasa AA para texto normal.
   ```
   - En navegador: use el selector de color de DevTools, que muestra el ratio y marca AA/AAA en vivo.

## Output Contract

Entregue: tabla elemento | problema | criterio WCAG | cambio, comando ejecutado con resultado, y como se probo (teclado + lector).

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales W3C. Consulte estas fuentes antes de afirmar un criterio. No improvise numeros de exito.

- WCAG 2.2 W3C (normativa): https://www.w3.org/TR/WCAG22/
- Understanding WCAG 2.2 (explicacion por criterio): https://www.w3.org/WAI/WCAG22/Understanding/
- Understanding Contrast Minimum 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Understanding Focus Visible 2.4.7: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- Understanding Target Size Minimum 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WAI-ARIA 1.2 (roles y propiedades): https://www.w3.org/TR/wai-aria-1.2/
- Apple HIG Accessibility: https://developer.apple.com/design/human-interface-guidelines
- Material 3 Accessibility: https://m3.material.io/foundations/accessible-design/overview

Repos famosos:

- https://github.com/dequelabs/axe-core
- https://github.com/alexpate/awesome-design-systems
- https://github.com/enaqx/awesome-react

Checklist WCAG 2.2 nivel AA por criterio:

| Area | Criterio | Verificacion | Pasa si |
|---|---|---|---|
| Imagenes y texto alternativo | 1.1.1 Contenido no textual (A) | `axe --tags wcag2aa` + revision con lector NVDA/VoiceOver | Toda `img` tiene `alt` util. Decorativas con `alt=""` o `aria-hidden="true"` |
| Estructura | 1.3.1 Informacion y relaciones (A) | Inspeccion de DOM + lector | Todo `input` tiene `label` asociado. Titulos en orden `h1` luego `h2`, sin saltos. Tablas con `th` y `scope` |
| Contraste texto | 1.4.3 Contraste minimo (AA) | Comando de contraste + DevTools | Texto normal 4.5:1 minimo. Texto grande 3:1 minimo. Verificado con `axe --tags color-contrast` sin fallos |
| Contraste UI | 1.4.11 Contraste no textual (AA) | Inspeccion visual + DevTools | Bordes de inputs, iconos y foco con 3:1 minimo contra fondo |
| Reflujo y zoom | 1.4.10 Reflujo (AA) | Zoom 200% y 400% en 1280px | Sin scroll horizontal a 200%. Contenido usable a 400% sin perdida |
| Teclado | 2.1.1 Teclado (A), 2.1.2 Sin trampas (A) | Solo `Tab`, `Shift+Tab`, `Enter`, `Esc` | `Tab` llega a todo. `Enter` o `Espacio` activa. `Esc` cierra dialogos. Sin trampas de foco |
| Foco visible | 2.4.7 Foco visible (AA) | Navegacion con teclado | Foco siempre visible con `:focus-visible` y contraste 3:1 minimo segun 2.4.13 |
| Objetivos tactiles | 2.5.8 Tamano minimo (AA) | Medicion en DevTools | 24x24 px minimo en escritorio. 44x44 px recomendado en movil. Espaciado suficiente |
| Encabezados y etiquetas | 2.4.6 Encabezados y etiquetas (AA) | Lectura con lector | Titulos y `label` describen proposito. Sin textos genericos como "clic aqui" |
| Errores | 3.3.1 Identificacion de errores (A) | Envio de formulario vacio | Error nunca solo con color. Texto mas icono mas `aria-describedby` al campo |
| Nombre y rol | 4.1.2 Nombre, rol, valor (A) | `axe` + lector | Botones y enlaces tienen nombre accesible. Estados `aria-expanded` y `aria-pressed` correctos |
| Movimiento | 2.3.3 Animacion por interaccion (AAA, recomendado) | `prefers-reduced-motion` | Respeta `prefers-reduced-motion`. Sin parpadeo ni autoplay sin control |

Verificacion minima obligatoria:

- [ ] `axe https://ejemplo.com --tags wcag2aa` sin violaciones criticas.
- [ ] `npx -y pa11y https://ejemplo.com --standard WCAG2AA` sin errores.
- [ ] Contraste 4.5:1 texto normal y 3:1 texto grande verificado con comando o DevTools.
- [ ] Tab llega a todo. Enter activa. Esc cierra. Sin trampas.
- [ ] Toda img con alt. Inputs con label. Iconos decorativos con aria-hidden.
- [ ] Headings en orden h1 luego h2, sin saltos.
- [ ] Targets 24x24 minimo desktop, 44x44 recomendado mobile segun 2.5.8.
- [ ] Error nunca solo con color: texto mas icono mas descripcion.
- [ ] prefers-reduced-motion y zoom 200% verificados.
