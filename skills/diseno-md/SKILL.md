---
name: diseno-md
description: Redirect a stitch-extraer-diseno. No usar directo. (Stitch, DESIGN.md, redirect)
allowed-tools:
  - "stitch*:*"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Redirección diseno-md

Este skill funciona como enrutador. No genera diseño directo. Deriva la solicitud al flujo Stitch correspondiente.

## Regla de enrutamiento

Utilizar `stitch-extraer-diseno` como ruta por defecto. Utilizar `stitch-generar-diseno` solo cuando existe contexto activo de Stitch MCP.

## Proceso

1. Leer la solicitud y detectar el origen: código existente o sesión Stitch MCP.
2. Buscar DESIGN.md existente en el proyecto antes de redirigir.
3. Elegir ruta con este criterio:
   - Código React, Vue, Angular o HTML y CSS sin MCP activo: derivar a `stitch-extraer-diseno`.
   - Sesión con MCP Stitch activa para generar o editar pantallas: derivar a `stitch-generar-diseno`.
4. Informar ruta elegida y motivo en una línea, sin generar componentes en este skill.

## Contrato de salida

Informar ruta elegida (`stitch-extraer-diseno` o `stitch-generar-diseno`), existencia de DESIGN.md previo y motivo técnico de la derivación.

## Ejemplo minimo

Entrada: "Tengo este componente React y quiero su DESIGN.md".

Salida minima: ruta elegida `stitch-extraer-diseno`, DESIGN.md previo no encontrado, motivo codigo React sin MCP activo. No genera componentes en este skill.

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- Stitch DESIGN.md: https://stitch.withgoogle.com/docs/design-md/overview
- Stitch prompting: https://stitch.withgoogle.com/docs/learn/prompting
- Stitch MCP guide: https://stitch.withgoogle.com/docs/mcp/guide
- Microsoft Fluent UI: https://learn.microsoft.com/fluent-ui/
- Microsoft Accessibility Support: https://support.microsoft.com/accessibility
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C WAI-ARIA 1.2: https://www.w3.org/TR/wai-aria-1.2/
- W3C Design Tokens Community: https://www.w3.org/community/design-tokens/

Repos famosos:

- https://github.com/alexpate/awesome-design-systems
- https://github.com/klaufel/awesome-design-systems
- https://github.com/enaqx/awesome-react

Checklist:

- [ ] No generar diseño directo. Derivar a `stitch-extraer-diseno` por defecto.
- [ ] Utilizar ruta Stitch MCP solo cuando hay contexto MCP activo.
- [ ] Verificar DESIGN.md existente antes de redirigir.
- [ ] Mantener vocabulario consistente con skill destino.
- [ ] Reportar ruta elegida y motivo en una línea.
- [ ] Verificar criterios Microsoft Fluent y W3C WCAG y ARIA en skill destino.
