---
name: imagemagick
description: Conversión y edición de imágenes con ImageMagick, resize, compresión, recorte, rotado, marca de agua, formatos WebP AVIF PNG JPG ICO, favicons, thumbnails, PDF y batch. (ImageMagick, magick, convert, images)
---

ImageMagick 7 ships the `magick` command. Legacy `convert`/`mogrify` still work but emit deprecation warnings on v7 — prefer `magick` and `magick mogrify`.

## Common Operations

### Convert Format

```bash
# Single conversion (format inferred from extension)
magick input.png output.jpg

# PNG -> WebP (lossy, quality 80)
magick input.png -quality 80 output.webp

# PNG -> WebP (lossless)
magick input.png -define webp:lossless=true output.webp

# Any -> AVIF (best compression for web)
magick input.png -quality 50 output.avif

# JPG -> PNG (preserve transparency target)
magick input.jpg output.png
```

### Resize / Scale

```bash
# Resize to exact width, keep aspect ratio
magick input.jpg -resize 800x output.jpg

# Resize to fit within box (no upscaling with >)
magick input.jpg -resize 1920x1080\> output.jpg

# Resize by percentage
magick input.jpg -resize 50% output.jpg

# Force exact dimensions (ignore aspect ratio)
magick input.jpg -resize 800x600! output.jpg

# Fill + crop to exact size (cover)
magick input.jpg -resize 800x600^ -gravity center -extent 800x600 output.jpg
```

### Compress / Optimize

```bash
# JPG: quality + strip metadata
magick input.jpg -strip -quality 82 -interlace JPEG output.jpg

# PNG: max lossless compression
magick input.png -strip -define png:compression-level=9 output.png

# PNG: lossy quantization (fewer colors, smaller file)
magick input.png -strip -colors 256 -depth 8 output.png

# Strip ALL metadata (EXIF, GPS, color profile)
magick input.jpg -strip output.jpg
```

### Crop

```bash
# Crop region WxH+X+Y (offset from top-left)
magick input.jpg -crop 400x300+50+50 +repage output.jpg

# Center crop to square
magick input.jpg -gravity center -extent 500x500 output.jpg

# Trim surrounding solid border
magick input.png -trim +repage output.png
```

### Rotate / Flip

```bash
magick input.jpg -rotate 90 output.jpg
magick input.jpg -flip output.jpg          # vertical
magick input.jpg -flop output.jpg          # horizontal
magick input.jpg -auto-orient output.jpg   # honor EXIF orientation
```

### Watermark

```bash
# Image overlay, bottom-right with 10px margin
magick input.jpg watermark.png -gravity southeast -geometry +10+10 -composite output.jpg

# Image overlay with opacity
magick input.jpg \( watermark.png -alpha set -channel A -evaluate multiply 0.4 \) \
  -gravity center -composite output.jpg

# Text watermark
magick input.jpg -gravity southeast -pointsize 36 -fill 'rgba(255,255,255,0.6)' \
  -annotate +20+20 'COPYRIGHT' output.jpg
```

### Thumbnails

```bash
# Fast thumbnail (strips profiles, optimized)
magick input.jpg -thumbnail 200x200 output.jpg

# Square thumbnail, center-cropped
magick input.jpg -thumbnail 200x200^ -gravity center -extent 200x200 thumb.jpg
```

### Favicon (multi-resolution ICO)

```bash
# Single source -> multi-size .ico (16/32/48)
magick input.png -define icon:auto-resize=16,32,48 favicon.ico

# Apple touch icon
magick input.png -resize 180x180 apple-touch-icon.png
```

### PDF

PDF read/write needs Ghostscript (`brew install ghostscript`). Without it ImageMagick fails with `no decode delegate for this image format PDF`.

```bash
# Images -> single PDF
magick page1.jpg page2.jpg page3.jpg output.pdf

# PDF -> PNG per page (150 DPI)
magick -density 150 input.pdf -quality 90 page-%03d.png

# PDF -> single combined JPG
magick -density 150 input.pdf -append output.jpg
```

### Transparency / Background

```bash
# Make white background transparent
magick input.png -fuzz 10% -transparent white output.png

# Flatten transparent onto white (for JPG)
magick input.png -background white -flatten output.jpg

# Replace background color
magick input.png -fuzz 15% -fill '#0d1117' -opaque white output.png
```

### Effects / Color

```bash
magick input.jpg -colorspace Gray output.jpg          # grayscale
magick input.jpg -blur 0x8 output.jpg                 # gaussian blur
magick input.jpg -modulate 100,120,100 output.jpg     # +20% saturation
magick input.jpg -brightness-contrast 10x15 output.jpg
magick input.jpg -level 5%,95% output.jpg             # contrast stretch
```

### Combine / Montage

```bash
# Horizontal append
magick a.jpg b.jpg +append row.jpg

# Vertical append
magick a.jpg b.jpg -append col.jpg

# Contact sheet grid with labels
magick montage *.jpg -tile 4x -geometry 200x200+5+5 contact.jpg
```

### Batch Processing

```bash
# Convert all PNG to WebP (in place naming)
for f in *.png; do magick "$f" -quality 80 "${f%.png}.webp"; done

# mogrify edits in place (CAREFUL: overwrites) — resize whole folder
magick mogrify -resize 1200x -quality 85 *.jpg

# Safe batch into subfolder
mkdir -p out && magick mogrify -path out -resize 1200x -format webp *.jpg
```

### Inspect

```bash
magick identify input.jpg                              # format, dimensions, depth
magick identify -verbose input.jpg | head -40          # full metadata
magick identify -format '%wx%h %[size]\n' input.jpg    # custom format
```

## Rules

- v7 syntax: `magick ...`. Don't mix with v6 `convert` unless on legacy.
- `-strip` on web exports — removes EXIF/GPS/profiles, smaller + privacy-safe.
- WebP for web photos, AVIF for best ratio, PNG only when transparency or lossless needed.
- `+repage` after `-crop` to reset virtual canvas, else offsets persist.
- `^` = fill (cover), `!` = force, `>` = shrink-only. Pick deliberately.
- `magick mogrify` overwrites originals — always `-path` to a separate dir for safety.
- High `-density` BEFORE the PDF input for crisp rasterization, not after.

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar los comandos existentes. Úsela para validar sintaxis v7, formatos y privacidad.

### Documentación oficial

- ImageMagick Usage: https://imagemagick.org/Usage/ — guía completa por operación y ejemplo.
- Comando `magick`: https://imagemagick.org/script/command-line-processing.php — sintaxis v7 y orden de operadores.
- Resize: https://imagemagick.org/Usage/resize/ — `resize`, `thumbnail`, `extent` y geometrías.
- Formatos: https://imagemagick.org/script/formats.php — WebP, AVIF, PNG, JPG e ICO.
- Color y perfiles: https://imagemagick.org/Usage/color_basics/ — `colorspace`, `modulate` y perfiles.
- PDF con Ghostscript: https://imagemagick.org/Usage/formats/#pdf — densidad y delegados requeridos.
- Seguridad y privacidad: https://imagemagick.org/script/security-policy.php — políticas y `strip` de metadata.

### Repositorios famosos y listas curadas

- ImageMagick: https://github.com/ImageMagick/ImageMagick — código fuente y releases v7.
- Awesome Imaging: https://github.com/mahmoud/awesome-python-applications — sección de imágenes con ImageMagick.
- Squoosh: https://github.com/GoogleChromeLabs/squoosh — referencia de compresión WebP y AVIF.
- Sharp: https://github.com/lovell/sharp — alternativa Node para comparar calidad y velocidad.
- libvips: https://github.com/libvips/libvips — referencia de procesamiento rápido por lotes.

### Guías de profundización sugeridas

- Revise Usage de resize antes de elegir entre `resize`, `thumbnail` y `extent`.
- Consulte formatos para decidir WebP lossy 80, AVIF 50 o PNG lossless según destino.
- Valide favicon ICO multi-resolución con `identify` antes de publicar.
- Verifique PDFs con Ghostscript instalado y `-density` antes del input.
- Mida peso antes y después con `identify -format` y confirme `strip` en exports web.

### Checklist de verificación

- [ ] Se consultó `imagemagick.org/Usage/` para el operador utilizado.
- [ ] Se utiliza sintaxis v7 con `magick` y no `convert` legacy.
- [ ] Todo export web incluye `-strip` para remover EXIF y GPS.
- [ ] El formato se eligió deliberadamente: WebP, AVIF, PNG o JPG.
- [ ] Después de `-crop` se aplica `+repage` cuando corresponde.
- [ ] El batch con `mogrify` utiliza `-path` separado y no sobrescribe originales.
- [ ] La densidad PDF se declara antes del input para raster nítido.
- [ ] `identify` confirma dimensiones, peso y transparencia esperados.
