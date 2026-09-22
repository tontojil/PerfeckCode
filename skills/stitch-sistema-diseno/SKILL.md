---
name: stitch-sistema-diseno
description: "Administración de sistemas de diseño en Stitch con recuperación de assets, creación o actualización del sistema y aplicación a pantallas. (design system, assets, Stitch)"
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Sistema de diseno en Stitch

Crea y mantiene una fuente unica de verdad para el lenguaje visual del proyecto.

## Paso 1 - Leer DESIGN.md

1. Lee `.stitch/DESIGN.md` si existe. Si no existe, crealo con el formato de 6 secciones de abajo.
2. Lee `.stitch/metadata.json` si existe para saber projectId, pantallas y tokens actuales.

## Formato de DESIGN.md (6 secciones)

```markdown
# Sistema de diseno: [Titulo]

## 1. Tema visual y ambiente
(Animo, densidad y filosofia visual.)

## 2. Paleta de colores y roles
(Lista cada color con nombre + hex + rol.)

## 3. Reglas de tipografia
(Familia, pesos para titulos y cuerpo, interlineado.)

## 4. Estilos de componentes
(Botones, tarjetas, inputs: forma, color y sombra.)

## 5. Principios de layout
(Margenes, espacios y grilla.)

## 6. Tokens y metadata
(Resumen de tokens, projectId y pantallas cubiertas.)
```

## Metadata minima (.stitch/metadata.json)

Guarda este archivo junto a DESIGN.md para llevar el estado:

```json
{
  "project": "projects/1234567890",
  "colors": [
    {"nombre": "Azul primario", "hex": "#2563EB", "rol": "acciones principales"}
  ],
  "fonts": [
    {"familia": "Inter", "uso": "titulos y cuerpo"}
  ],
  "screens": [
    {"titulo": "Home", "id": "abc123"}
  ]
}
```

## Paso 2 - Crear o actualizar el sistema via MCP stitch

1. Busca el prefijo MCP con `list_tools`. Usa ese prefijo para todo (ej `stitch:`).
2. Busca el proyecto con `list_projects` y anota el `projectId`.
3. Pide confirmacion al usuario antes de crear o actualizar: muestra nombre, colores clave, fuentes y redondeo.
4. Crea o actualiza el sistema con `create_design_system_from_design_md` pasando `projectId` y el contenido de DESIGN.md.
5. Guarda el `assetId` que devuelve en `metadata.json`.

## Paso 3 - Aplicar a pantallas

1. Pide `get_project` para listar `screenInstances` (usa solo `id` y `sourceScreen`, sin x, y, width, height).
2. Pide `list_design_systems` para obtener el `assetId` (parte despues de `assets/`).
3. Llama a `apply_design_system` con `projectId`, `assetId` y la lista de pantallas.
4. Filtra instancias tipo `DESIGN_SYSTEM_INSTANCE`, solo pasa pantallas reales.

```json
{
  "projectId": "...",
  "assetId": "...",
  "selectedScreenInstances": [
    {
      "id": "...",
      "sourceScreen": "projects/.../screens/..."
    }
  ]
}
```

## Paso 4 - Verificar

1. Revisa que DESIGN.md tenga las 6 secciones completas y hex exactos.
2. Revisa que `metadata.json` tenga project, colors, fonts y screens al dia.
3. Abre una pantalla aplicada y confirma colores, fuentes y redondeo.
4. Si algo falla, corrige DESIGN.md y repite pasos 2 y 3.

## Buenas practicas

- Nombres simples por rol, no solo por color.
- Hex exacto siempre entre parentesis.
- Mismo vocabulario en todo el archivo.
- Cambios chicos y verificados, no todo de una vez.

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- Stitch DESIGN.md overview: https://stitch.withgoogle.com/docs/design-md/overview
- Stitch view edit export: https://stitch.withgoogle.com/docs/design-md/usage
- Stitch MCP guide: https://stitch.withgoogle.com/docs/mcp/guide
- Material 3 tokens: https://m3.material.io/
- W3C Design Tokens: https://www.w3.org/community/design-tokens/

Repos famosos:

- https://github.com/alexpate/awesome-design-systems
- https://github.com/klaufel/awesome-design-systems
- https://github.com/jbranchaud/awesome-react-design-systems

Checklist:

- [ ] DESIGN.md con 6 secciones y hex exactos por color.
- [ ] metadata.json con project, colors, fonts y screens al dia.
- [ ] assetId guardado tras create o update via MCP.
- [ ] Confirmacion del usuario antes de crear o actualizar sistema.
- [ ] apply_design_system solo a pantallas reales, sin instancias de sistema.
- [ ] Verificacion visual de colores, fuentes y redondeo en pantalla aplicada.
- [ ] Cambios chicos con vocabulario consistente por rol.
