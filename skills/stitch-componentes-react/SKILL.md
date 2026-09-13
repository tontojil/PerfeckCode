---
name: stitch-componentes-react
description: "Conversión de diseños de Stitch en componentes modulares de Vite y React con validación automática. (Stitch, React, components)"
allowed-tools:
  - "stitch*:*"
  - "Bash"
  - "Read"
  - "Write"
  - "WebFetch"
---

# Stitch to React Components

You are a frontend engineer focused on transforming designs into clean React code. You follow a modular approach and use automated tools to ensure code quality.

## Retrieval and networking
1. **Namespace discovery**: Run `list_tools` to find the Stitch MCP prefix. Use this prefix (e.g., `stitch:`) for all subsequent calls.
2. **Metadata fetch**: Call `[prefix]:get_screen` to retrieve the design JSON.
3. **Check for existing designs**: Before downloading, check if `.stitch/designs/{page}.html` and `.stitch/designs/{page}.png` already exist:
   - **If files exist**: Ask the user whether to refresh the designs from the Stitch project using the MCP, or reuse the existing local files. Only re-download if the user confirms.
   - **If files do not exist**: Proceed to step 4.
4. **High-reliability download**: Internal AI fetch tools can fail on Google Cloud Storage domains.
   - **HTML**: descarga con `web_fetch` o `curl -L -o ".stitch/designs/{page}.html" "[htmlCode.downloadUrl]"` (URL entre comillas).
    - **Screenshot**: Append `=w{width}` to the screenshot URL first, where `{width}` is the `width` value from the screen metadata (Google CDN serves low-res thumbnails by default). Luego: `curl -L -o ".stitch/designs/{page}.png" "[screenshot.downloadUrl]=w{width}"`
   - Si `curl` falla por redirects/handshake, reintenta con `web_fetch` directo del `downloadUrl`.
5. **Visual audit**: Review the downloaded screenshot (`.stitch/designs/{page}.png`) to confirm design intent and layout details.

## Architectural rules
* **Modular components**: Break the design into independent files. Avoid large, single-file outputs.
* **Logic isolation**: Move event handlers and business logic into custom hooks in `src/hooks/`.
* **Data decoupling**: Move all static text, image URLs, and lists into `src/data/mockData.ts`.
* **Type safety**: Every component must include a `Readonly` TypeScript interface named `[ComponentName]Props`.
* **Project specific**: Focus on the target project's needs and constraints. Leave Google license headers out of the generated React components.
* **Style mapping**:
    * Extract the `tailwind.config` from the HTML `<head>`.
    * Reusa tokens del proyecto (CSS vars / `tailwind.config.js` existente).
    * Use theme-mapped Tailwind classes instead of arbitrary hex codes.

## Execution steps
1. **Environment setup**: If `node_modules` is missing, run `npm install` to enable the validation tools.
2. **Data layer**: Create `src/data/mockData.ts` based on the design content.
3. **Component drafting**: Crea un componente por archivo. Nombre `[ComponentName]` + interface `Readonly [ComponentName]Props`. Sin headers de licencia de Google.
4. **Application wiring**: Update the project entry point (like `App.tsx`) to render the new components.
5. **Quality check**:
    * `npx tsc --noEmit` para tipos.
    * Verifica a mano: props con interface, sin estilos hardcodeados fuera de tokens, sin archivo gigante unico.
    * Start the dev server with `npm run dev` to verify the live result (si el proyecto lo tiene).

## Troubleshooting
* **Errores de descarga**: Asegura que la URL vaya entre comillas en el comando bash para evitar errores de shell.
* **Errores de validacion**: corre `npx tsc --noEmit` y revisa props con interface + sin hex hardcodeado, y corrige lo que falte.