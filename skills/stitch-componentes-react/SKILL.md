---
name: stitch-componentes-react
description: "Conversión de diseños de Stitch en componentes modulares de Vite y React con validación automática. (Stitch, React, components)"
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "web_fetch"
---

# Componentes React desde Stitch

Convierte pantallas diseñadas en Stitch en componentes React modulares para proyectos Vite con TypeScript, con lógica separada, datos separados y validación automática.

## Cuándo usar

- El usuario pide pasar una pantalla de Stitch a React.
- Existe un `projectId` o `screenId` de Stitch y se necesita código funcional.
- Se requiere mantener consistencia visual mediante tokens del proyecto.

## Prerrequisitos

- Acceso al prefijo MCP de Stitch mediante `list_tools`.
- Proyecto Vite con React y TypeScript inicializado.
- Carpeta `.stitch/designs/` disponible para descargas locales.

## Flujo con tokens

### 1. Descubrir y obtener datos

1. Ejecuta `list_tools` para identificar el prefijo MCP real (por ejemplo, `stitch:`).
2. Llama a `[prefijo]:get_screen` para obtener el JSON de la pantalla: `width`, `htmlCode.downloadUrl`, `screenshot.downloadUrl`.
3. Revisa si ya existen `.stitch/designs/{pagina}.html` y `.stitch/designs/{pagina}.png`:
   - Si existen, pregunta al usuario si desea actualizar desde Stitch o reutilizar los archivos locales.
   - Si no existen, continúa con la descarga.

### 2. Descargar con alta confiabilidad

Las descargas desde Google Cloud Storage pueden fallar si la URL no va entre comillas.

- **HTML:** `curl -L -o ".stitch/designs/{pagina}.html" "[htmlCode.downloadUrl]"`
- **Captura:** agrega `=w{ancho}` a la URL para obtener resolución completa, donde `{ancho}` es el valor `width` del metadato. Luego: `curl -L -o ".stitch/designs/{pagina}.png" "[screenshot.downloadUrl]=w{ancho}"`
- Si `curl` falla por redirecciones, reintenta con `web_fetch` directo sobre el `downloadUrl`.

### 3. Auditoría visual y extracción de tokens

1. Abre el archivo PNG y confirma intención, jerarquía, densidad y estados visibles.
2. Extrae del `<head>` del HTML el bloque `tailwind.config` inline.
3. Registra tokens detectados en una tabla temporal:

| Categoría | Token en Stitch | Valor detectado |
|:---|:---|:---|
| Color fondo | `background` | `#F7F3EC` |
| Color primario | `primary` | `#294056` |
| Fuente títulos | `font-display` | `Inter 700` |
| Radio botones | `radius-full` | `9999px` |
| Espaciado base | `spacing-4` | `16px` |

### 4. Mapear a tokens del proyecto

No uses valores hexadecimales directos en los componentes. Reutiliza variables CSS o el archivo `tailwind.config.js` existente.

| Token Stitch | Destino recomendado | Base de referencia |
|:---|:---|:---|
| Colores `primary`, `surface`, `error` | Variables `--color-primary`, clases `bg-primary text-on-primary` | Roles de color Material 3 |
| Tipografía `headline`, `body`, `label` | Clases `font-display`, `text-headline-large`, `text-body-medium` | Escala tipográfica Material 3 |
| Espaciado `4px`, `8px`, `16px`, `24px` | Escala `spacing-1`, `spacing-2`, `spacing-4`, `spacing-6` | Espaciado Material 3, grilla 8pt de Apple HIG |
| Radios `12px`, `16px`, `9999px` | Tokens `radius-medium`, `radius-large`, `radius-full` | Formas Material 3 |
| Área táctil mínima | `min-h-[44px] min-w-[44px]` en botones y enlaces | Apple HIG, objetivos táctiles 44pt |

Si el proyecto no tiene tokens definidos, crea `src/styles/tokens.css` con variables y úsalo como fuente única.

### 5. Generar componentes modulares

Reglas de arquitectura:

- Un componente por archivo. Nada de archivos únicos gigantes.
- Cada componente define `interface [Nombre]Props` con modificador `Readonly`.
- Lógica y manejadores en `src/hooks/`.
- Textos, URL de imágenes y listas en `src/data/mockData.ts`.
- Sin encabezados de licencia de Google en los componentes finales.

### 6. Validar

1. `npx tsc --noEmit` para tipos.
2. Verificación manual: props con interfaz, sin hex fuera de tokens, sin archivo único gigante.
3. Inicia el servidor con `npm run dev` si el proyecto lo incluye y compara con el PNG.

## Ejemplo mínimo

`src/styles/tokens.css`:

```css
:root {
  --color-background: #F7F3EC;
  --color-surface: #E8EEF2;
  --color-primary: #294056;
  --color-on-primary: #FFFFFF;
  --font-display: "Inter", system-ui, sans-serif;
  --radius-full: 9999px;
  --spacing-4: 16px;
}
```

`src/data/mockData.ts`:

```ts
export const heroData = {
  titulo: "Notas del puerto",
  subtitulo: "Calma editorial para leer sin distracciones.",
  ctaPrimario: "Crear nota",
} as const;
```

`src/components/HeroCard.tsx`:

```tsx
import { heroData } from "../data/mockData.ts";

interface HeroCardProps {
  readonly titulo?: string;
}

export function HeroCard({ titulo = heroData.titulo }: HeroCardProps) {
  return (
    <section className="bg-[var(--color-background)] p-6 rounded-2xl">
      <h1 className="font-display text-4xl font-bold">{titulo}</h1>
      <p className="mt-2 text-base">{heroData.subtitulo}</p>
      <button
        type="button"
        className="mt-4 min-h-[44px] rounded-full bg-[var(--color-primary)] px-6 text-[var(--color-on-primary)]"
      >
        {heroData.ctaPrimario}
      </button>
    </section>
  );
}
```

`src/App.tsx`:

```tsx
import { HeroCard } from "./components/HeroCard.tsx";

export function App() {
  return (
    <main className="mx-auto max-w-[1200px] p-6">
      <HeroCard />
    </main>
  );
}
```

## Solución de problemas

- **Descarga sin comillas:** coloca siempre la URL entre comillas dobles en `curl` para evitar errores de shell con `&` y `?`.
- **Captura en baja resolución:** verifica que agregaste `=w{ancho}` al final de la URL de la captura.
- **Error de tipos:** ejecuta `npx tsc --noEmit`, revisa interfaces `Readonly`, importa tipos faltantes y elimina valores hex fuera de tokens.
- **Desfase visual:** compara de nuevo el PNG con `npm run dev`. Ajusta primero espaciado, luego color, al final tipografía.

---

## Referencias oficiales y checklist

Fuentes oficiales:

- Material 3, roles de color: https://m3.material.io/styles/color/roles
- Material 3, tipografía: https://m3.material.io/styles/typography/overview
- Material 3, espaciado: https://m3.material.io/styles/spacing/overview
- Material 3, forma: https://m3.material.io/styles/shape/overview
- Apple HIG, color: https://developer.apple.com/design/human-interface-guidelines/foundations/color
- Apple HIG, tipografía: https://developer.apple.com/design/human-interface-guidelines/foundations/typography
- Apple HIG, layout: https://developer.apple.com/design/human-interface-guidelines/foundations/layout
- React Server Components: https://react.dev/reference/rsc/server-components
- React Suspense: https://react.dev/reference/react/Suspense
- TypeScript tsconfig: https://www.typescriptlang.org/tsconfig/
- Material Components Web GitHub: https://github.com/material-components/material-components-web

Checklist:

- [ ] Descarga con URL entre comillas y captura con `=w{ancho}`.
- [ ] Auditoría visual del PNG antes de codificar.
- [ ] Tabla de tokens de Stitch mapeada a tokens del proyecto.
- [ ] Un componente por archivo con interfaz `Readonly Props`.
- [ ] Lógica en `src/hooks` y datos en `src/data/mockData.ts`.
- [ ] Sin colores hexadecimales fuera de tokens. Área táctil mínima de 44px en controles.
- [ ] Contraste de texto verificado según Material 3 y Apple HIG.
- [ ] `tsc --noEmit` en verde y servidor de desarrollo verificado.
- [ ] Sin encabezados de licencia de Google en componentes finales.
