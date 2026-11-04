---
name: pandoc
description: "Convierte documentos entre Markdown, DOCX, PDF, HTML, EPUB, LaTeX y PPTX, con plantillas, citas, indice y metadatos. (pandoc, document converter, markdown)"
---

Pandoc converts between markup formats. Source format inferred from input extension, target from `-o` extension (or force with `-f`/`-t`).

## Cuando usar

- Conversion rapida libre entre Markdown, DOCX, PDF, HTML, EPUB, LaTeX y PPTX.
- Documentos generales sin plantilla institucional estricta.
- Si es entrega INACAP estricta, utilice la skill `inacap` en lugar de `pandoc`.
- Utilice `pandoc` solo como motor de conversión con `--reference-doc` INACAP.
- Esta regla evita rechazos por formato en la U.

## Common Operations

### Markdown -> PDF

```bash
# Requires a LaTeX engine (see Rules). Default engine:
pandoc input.md -o output.pdf

# Pick engine + nicer defaults
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  -V geometry:margin=1in -V mainfont="Helvetica Neue"

# With TOC and section numbering
pandoc input.md -o output.pdf --toc --number-sections
```

### Markdown -> DOCX

```bash
# Plain conversion
pandoc input.md -o output.docx

# Using a styled reference document (corporate template)
pandoc input.md -o output.docx --reference-doc=template.docx

# Generate an editable reference doc to customize, then reuse:
pandoc -o reference.docx --print-default-data-file reference.docx
```

```bash
# Ejemplo INACAP (entrega con plantilla + citas + imagenes).
# Primero genere su plantilla una vez (linea 42) y luego reutilicela:
pandoc informe.md -o informe.docx --reference-doc=./mi-plantilla.docx --citeproc --bibliography=refs.bib --extract-media=./media
```

> Windows: `choco install pandoc` o `winget install JohnMacFarlane.Pandoc`.

### Markdown -> HTML

```bash
# Standalone page (full <html> wrapper)
pandoc input.md -o output.html --standalone

# Self-contained (CSS/images inlined, single portable file)
pandoc input.md -o output.html --standalone --embed-resources

# With custom CSS + TOC
pandoc input.md -o output.html -s --toc -c styles.css
```

### DOCX / HTML -> Markdown

```bash
# Word -> Markdown, extract embedded images to ./media
pandoc input.docx -o output.md --extract-media=./media

# HTML -> GitHub-flavored Markdown
pandoc input.html -f html -t gfm -o output.md
```

### Markdown -> PPTX (slides)

```bash
# Slides split on headings (## = new slide)
pandoc slides.md -o slides.pptx

# With a branded template
pandoc slides.md -o slides.pptx --reference-doc=brand.pptx
```

### Markdown -> EPUB

```bash
pandoc book.md -o book.epub --toc \
  --metadata title="My Book" --metadata author="Author" \
  --epub-cover-image=cover.png
```

### Markdown -> Beamer / reveal.js

```bash
# PDF slide deck (LaTeX Beamer)
pandoc slides.md -t beamer -o slides.pdf

# HTML reveal.js deck
pandoc slides.md -t revealjs -s -o slides.html \
  -V revealjs-url=https://unpkg.com/reveal.js
```

### Citations / Bibliography

```bash
# CSL citations from a .bib file
pandoc paper.md --citeproc --bibliography=refs.bib -o paper.pdf

# Specific citation style
pandoc paper.md --citeproc --bibliography=refs.bib \
  --csl=ieee.csl -o paper.pdf
```

## Metadata

YAML front matter drives titles, authors, TOC, and template variables:

```markdown
---
title: "Document Title"
author: "Your Name"
date: "2026-06-04"
lang: es
toc: true
number-sections: true
---
```

Or pass inline: `--metadata title="X"` / `-V key=value` for template variables.

## Useful Flags

```bash
--toc                      # table of contents
--number-sections          # numbered headings
--standalone / -s          # full document wrapper, not a fragment
--embed-resources          # inline all assets (HTML)
--reference-doc=FILE       # DOCX/PPTX styling template
--template=FILE            # custom output template
--highlight-style=kate     # code syntax theme (kate, pygments, breezedark...)
--resource-path=DIR        # where to find images/includes
--from gfm --to docx       # force formats explicitly
--toc-depth=2              # limit TOC nesting
```

## Rules

- PDF output needs a LaTeX engine. macOS: `brew install --cask basictex` (then `tlmgr`) or `brew install tectonic` (lighter, self-fetching). Without it, PDF export fails.
- For Word/PowerPoint styling, edit a `--reference-doc`, don't fight raw output.
- `--embed-resources --standalone` for a single portable HTML file (email, archive).
- `--extract-media` when importing DOCX, or images get lost.
- Force formats with `-f`/`-t` when extensions are ambiguous or piping.
- `--citeproc` is required for `--bibliography` to render citations (not automatic).
- Math renders natively to LaTeX/PDF; for HTML add `--mathjax`.

## Fuentes oficiales

Documentacion verificable del proyecto Pandoc, CSL y LaTeX:

- Sitio oficial de Pandoc: https://pandoc.org/
- Manual completo de Pandoc: https://pandoc.org/MANUAL.html
- Codigo fuente y releases: https://github.com/jgm/pandoc
- Guia de estilos de cita CSL: https://citationstyles.org/
- Proyecto LaTeX (motores PDF): https://www.latex-project.org/

Estas fuentes son la referencia para sintaxis de comandos, formatos soportados y cambios entre versiones.

## Repositorios famosos

Repositorios de referencia para conversion, estilos y plantillas:

- `jgm/pandoc` - convertidor universal de documentos: https://github.com/jgm/pandoc
- `citation-style-language/styles` - mas de 10.000 estilos CSL (`apa.csl`, `ieee.csl`, `vancouver.csl`): https://github.com/citation-style-language/styles
- `jgm/pandoc-templates` - plantillas por defecto de Pandoc: https://github.com/jgm/pandoc-templates
- Referencia solicitada `wattsikon` - buscar en GitHub: https://github.com/search?q=wattsikon&type=repositories

Nota: si la referencia `wattsikon` no devuelve un repositorio concreto, utilice `jgm/pandoc-templates` como base para personalizar plantillas LaTeX, DOCX y HTML.

## Version minima requerida

Version minima soportada por esta skill: Pandoc 3.x.

Verificacion en Windows (PowerShell), macOS y Linux:

```bash
pandoc --version
```

Salida esperada (ejemplo en Pandoc 3.1):

```text
pandoc 3.1.12.3
Features: +server +lua
Scripting engine: Lua 5.4
User data directory: C:\Users\<usuario>\AppData\Roaming\pandoc
Copyright (C) 2006-2025 John MacFarlane. Web: https://pandoc.org
This is free software; see the source for copying conditions.
There is no warranty, not even for merchantability or fitness
for a particular purpose.
```

Si la version es 2.x, actualice antes de usar `--citeproc`, `--extract-media` y `--embed-resources` con el comportamiento descrito en esta skill.

Instalacion y actualizacion en Windows con `winget`:

```powershell
winget install JohnMacFarlane.Pandoc
winget upgrade JohnMacFarlane.Pandoc
```

## Ejemplos probados

Comandos base validados contra el manual oficial https://pandoc.org/MANUAL.html. Todos asumen que `input.md` existe en la carpeta actual.

### Markdown a DOCX con documento de referencia

```bash
# Conversion simple
pandoc informe.md -o informe.docx

# Con plantilla de estilos corporativa o INACAP
pandoc informe.md -o informe.docx --reference-doc=./mi-plantilla.docx

# Flujo completo INACAP: plantilla + citas + imagenes extraidas
pandoc informe.md -o informe.docx --reference-doc=./mi-plantilla.docx --citeproc --bibliography=refs.bib --extract-media=./media --toc --number-sections
```

### Markdown a PDF con motor XeLaTeX

```bash
# Requiere distribucion LaTeX instalada (ver matriz de motores)
pandoc informe.md -o informe.pdf --pdf-engine=xelatex -V geometry:margin=1in

# Con indice y secciones numeradas
pandoc informe.md -o informe.pdf --pdf-engine=xelatex --toc --number-sections -V lang=es
```

### Citas y bibliografia con CSL

```bash
# Estilo por defecto (Chicago author-date)
pandoc paper.md --citeproc --bibliography=refs.bib -o paper.docx

# Estilo especifico descargado desde https://github.com/citation-style-language/styles
pandoc paper.md --citeproc --bibliography=refs.bib --csl=ieee.csl -o paper.pdf --pdf-engine=xelatex

# Verificar que las claves citadas existen en refs.bib, ejemplo de cita en Markdown:
# Esto esta demostrado en [@doe99, pp. 33-35].
```

### Extraccion de imagenes al importar Word

```bash
# DOCX a Markdown con imagenes en ./media
pandoc input.docx -o output.md --extract-media=./media

# DOCX a Markdown con plantilla y metadatos en espanol
pandoc input.docx -o output.md --extract-media=./media --metadata lang=es --standalone
```

## Matriz de motores PDF

| Motor (`--pdf-engine=`) | Instalacion tipica Windows | Ventajas | Limitaciones |
|---|---|---|---|
| `pdflatex` | MiKTeX o TeX Live | Rapido, estable, buena base | Fuentes Unicode limitadas |
| `xelatex` | MiKTeX o TeX Live (recomendado) | Unicode y fuentes del sistema (`-V mainfont=...`), ideal para espanol | Compilacion mas lenta |
| `lualatex` | MiKTeX o TeX Live | Unicode, scripts Lua, tipografia avanzada | Mas lento, mas memoria |
| `tectonic` | `winget install Tectonic.Tectonic` | Autodescarga paquetes, liviano | Menos control fino que TeX Live |
| `wkhtmltopdf` | `winget install wkhtmltopdf.wkhtmltopdf` | Rapido para HTML a PDF, sin LaTeX | Paginacion y matematicas inferiores |
| `weasyprint` | `pip install weasyprint` | CSS moderno, bueno para HTML | Requiere Python y Cairo, lento en Windows |
| `typst` | `winget install Typst.Typst` | Sintaxis simple, compilacion rapida | Formato distinto a LaTeX (`-t typst`) |

## Errores comunes en Windows

1. `pdflatex not found` o `xelatex not found` al exportar a PDF.
   Causa: no hay distribucion LaTeX instalada.
   Solucion:
   ```powershell
   winget install MiKTeX.MiKTeX
   # o
   winget install Tectonic.Tectonic
   pandoc informe.md -o informe.pdf --pdf-engine=xelatex
   ```

2. `pandoc: reference.docx: openBinaryFile: does not exist`.
   Causa: ruta de `--reference-doc` incorrecta.
   Solucion: generar la plantilla por defecto y luego personalizarla:
   ```powershell
   pandoc -o reference.docx --print-default-data-file reference.docx
   pandoc informe.md -o informe.docx --reference-doc=./reference.docx
   ```

3. Citas que aparecen como `[@clave]` sin formato.
   Causa: falta `--citeproc` o ruta de `--bibliography` incorrecta.
   Solucion:
   ```powershell
   Test-Path ./refs.bib
   pandoc paper.md --citeproc --bibliography=refs.bib -o paper.docx
   ```

4. Imagenes perdidas al convertir DOCX a Markdown.
   Causa: falta `--extract-media`.
   Solucion:
   ```powershell
   pandoc input.docx -o output.md --extract-media=./media
   ```

5. `winget` no encuentra el paquete Pandoc.
   Causa: indice desactualizado o ID incorrecto.
   Solucion:
   ```powershell
   winget source update
   winget search Pandoc
   winget install JohnMacFarlane.Pandoc
   ```
