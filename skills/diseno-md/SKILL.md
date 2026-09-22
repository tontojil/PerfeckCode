---
name: diseno-md
description: Redirect a stitch-extraer-diseno. No usar directo. (Stitch, DESIGN.md, redirect)
allowed-tools:
  - "stitch*:*"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Redirect

Usa stitch-extraer-diseno salvo que vengai de Stitch MCP, en ese caso ver stitch-generar-diseno.

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- Stitch DESIGN.md: https://stitch.withgoogle.com/docs/design-md/overview
- Stitch prompting: https://stitch.withgoogle.com/docs/learn/prompting
- Stitch MCP guide: https://stitch.withgoogle.com/docs/mcp/guide
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

Repos famosos:

- https://github.com/alexpate/awesome-design-systems
- https://github.com/klaufel/awesome-design-systems
- https://github.com/enaqx/awesome-react

Checklist:

- [ ] No usar directo. Derivar a stitch-extraer-diseno por defecto.
- [ ] Solo usar ruta Stitch MCP cuando hay contexto MCP activo.
- [ ] Verificar DESIGN.md existente antes de redirigir.
- [ ] Mantener vocabulario consistente con skill destino.
- [ ] Reportar ruta elegida y motivo en una linea.
