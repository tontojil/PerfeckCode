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

# Sistema de diseño en Stitch

Crea y mantiene una fuente única de verdad para el lenguaje visual del proyecto, con tokens versionados y aplicación controlada a pantallas.

## Cuándo usar

- El usuario necesita crear un sistema de diseño en Stitch desde un `DESIGN.md`.
- Existe un sistema previo que se debe actualizar o aplicar a nuevas pantallas.
- Se requiere auditar tokens, colores, fuentes y redondeo antes de generar pantallas.

## Paso 1 - Leer DESIGN.md y metadata

1. Lee `.stitch/DESIGN.md` si existe. Si no existe, créalo con el formato de 6 secciones de abajo o genera uno con la skill `stitch-extraer-diseno`.
2. Lee `.stitch/metadata.json` si existe para conocer `projectId`, pantallas cubiertas y tokens actuales.
3. Si falta alguno, registra qué se debe crear antes de llamar al MCP.

## Formato de DESIGN.md con tokens (6 secciones)

```markdown
# Sistema de diseño: [Título]

## 1. Tema visual y ambiente
(Ánimo, densidad y filosofía visual en lenguaje editorial.)

## 2. Paleta de colores y roles
(Lista cada color con nombre + hex + rol + token Material 3.)

## 3. Reglas de tipografía
(Familia, escala display/headline/body/label, pesos e interlineado.)

## 4. Estilos de componentes
(Botones, tarjetas, inputs: forma, color, sombra y área táctil mínima.)

## 5. Principios de layout
(Márgenes, espaciado base, grilla y breakpoints.)

## 6. Tokens y metadata
(Tabla de tokens, projectId y pantallas cubiertas.)
```

Tabla de tokens recomendada para la sección 6:

| Token | Valor | Rol | Referencia |
|:---|:---|:---|:---|
| `--color-primary` | `#2563EB` | Acciones principales | Material 3 `primary` |
| `--color-surface` | `#F7F3EC` | Fondo de página | Material 3 `surface` |
| `--color-error` | `#B3261E` | Errores | Material 3 `error` |
| `--font-display` | `Inter 700` | Títulos | Material 3 `headline`, Apple HIG `Title` |
| `--radius-full` | `9999px` | Botones pill | Material 3 `shape full` |
| `--spacing-base` | `8px` | Unidad base | Material 3 spacing, Apple HIG grilla 8pt |

Verifica contraste AA para texto, modo claro y oscuro según Apple HIG, y área táctil mínima de 44pt en controles.

## Metadata mínima (.stitch/metadata.json)

Guarda este archivo junto a `DESIGN.md` para llevar el estado:

```json
{
  "project": "projects/1234567890",
  "assetId": "assets/abcdef123456",
  "colors": [
    {"nombre": "Azul primario", "hex": "#2563EB", "rol": "acciones principales", "token": "primary"}
  ],
  "fonts": [
    {"familia": "Inter", "uso": "títulos y cuerpo", "escala": "headline/body/label"}
  ],
  "spacing": {"base": "8px", "seccion": "64px"},
  "screens": [
    {"titulo": "Home", "id": "abc123"}
  ]
}
```

## Ejemplo mínimo

`DESIGN.md` reducido y válido:

```markdown
---
name: demo-tienda
colors:
  primario: "#2563EB"
  fondo: "#F7F3EC"
---
# Sistema de diseño: Demo Tienda

## 1. Tema visual y ambiente
Minimalismo editorial calmo con fondo papel y aire generoso.

## 2. Paleta de colores y roles
- **Azul primario** #2563EB: acciones principales. Token `primary`.
- **Fondo papel** #F7F3EC: fondo de página. Token `surface`.

## 3. Reglas de tipografía
Inter para títulos y cuerpo. H1 32px/700, cuerpo 16px/1.6. Escala alineada a Material 3.

## 4. Estilos de componentes
Botones pill de 9999px con altura mínima de 44px. Tarjetas de 16px con borde fino.

## 5. Principios de layout
Ancho máximo 1200px, grilla de 12 columnas, secciones cada 64px.

## 6. Tokens y metadata
Tokens en tabla. Proyecto `projects/1234567890`. Pantalla inicial Home.
```

## Paso 2 - Crear o actualizar el sistema vía MCP Stitch

1. Busca el prefijo MCP con `list_tools`. Usa ese prefijo para todo (por ejemplo, `stitch:`).
2. Busca el proyecto con `list_projects` y anota el `projectId`.
3. Pide confirmación al usuario antes de crear o actualizar: muestra nombre, colores clave, fuentes, redondeo y lista de pantallas afectadas.
4. Crea o actualiza el sistema con `create_design_system_from_design_md`, pasando `projectId` y el contenido completo de `DESIGN.md`.
5. Guarda el `assetId` devuelto en `metadata.json`. Sin este paso el sistema queda sin referencia.

## Paso 3 - Aplicar a pantallas

1. Pide `get_project` para listar `screenInstances`. Usa solo `id` y `sourceScreen`, sin coordenadas ni tamaños.
2. Pide `list_design_systems` para obtener el `assetId` (parte después de `assets/`).
3. Filtra instancias tipo `DESIGN_SYSTEM_INSTANCE`. Solo envía pantallas reales.
4. Llama a `apply_design_system`:

```json
{
  "projectId": "projects/1234567890",
  "assetId": "abcdef123456",
  "selectedScreenInstances": [
    {
      "id": "instancia-home-001",
      "sourceScreen": "projects/1234567890/screens/abc123"
    }
  ]
}
```

Aplica primero a una pantalla piloto, verifica, y luego extiende al resto.

## Paso 4 - Verificar

1. Revisa que `DESIGN.md` tenga las 6 secciones completas y hex exactos.
2. Revisa que `metadata.json` tenga `project`, `assetId`, `colors`, `fonts` y `screens` al día.
3. Abre una pantalla aplicada y confirma colores, fuentes, redondeo y espaciado.
4. Verifica contraste, jerarquía tipográfica y objetivos táctiles según Material 3 y Apple HIG.
5. Si algo falla, corrige `DESIGN.md` y repite los pasos 2 y 3 con cambios pequeños.

## Buenas prácticas

- Nombres por rol más token, no solo por color. Ejemplo: `Azul primario (primary)`.
- Hex exacto siempre entre paréntesis.
- Mismo vocabulario en todo el archivo.
- Cambios pequeños y verificados, no todo de una vez.
- Documenta modo claro y oscuro si el proyecto lo soporta.

---

## Referencias oficiales y checklist

Fuentes oficiales:

- Stitch DESIGN.md overview: https://stitch.withgoogle.com/docs/design-md/overview
- Stitch view edit export: https://stitch.withgoogle.com/docs/design-md/usage
- Stitch MCP guide: https://stitch.withgoogle.com/docs/mcp/guide
- Material 3, color: https://m3.material.io/styles/color/roles
- Material 3, tipografía: https://m3.material.io/styles/typography/overview
- Material 3, espaciado: https://m3.material.io/styles/spacing/overview
- Material 3, forma: https://m3.material.io/styles/shape/overview
- Material 3, tokens: https://m3.material.io/
- Apple HIG, color: https://developer.apple.com/design/human-interface-guidelines/foundations/color
- Apple HIG, tipografía: https://developer.apple.com/design/human-interface-guidelines/foundations/typography
- Apple HIG, layout: https://developer.apple.com/design/human-interface-guidelines/foundations/layout
- W3C Design Tokens: https://www.w3.org/community/design-tokens/
- Material Components Web GitHub: https://github.com/material-components/material-components-web

Checklist:

- [ ] `DESIGN.md` con 6 secciones, tabla de tokens y hex exactos por color.
- [ ] Tokens mapeados a roles Material 3 y verificados con Apple HIG.
- [ ] `metadata.json` con `project`, `assetId`, `colors`, `fonts`, `spacing` y `screens` al día.
- [ ] `assetId` guardado tras crear o actualizar vía MCP.
- [ ] Confirmación del usuario antes de crear o actualizar el sistema.
- [ ] `apply_design_system` solo a pantallas reales, con piloto primero.
- [ ] Verificación visual de color, fuente, redondeo, espaciado y área táctil.
- [ ] Contraste AA y vocabulario consistente por rol.
