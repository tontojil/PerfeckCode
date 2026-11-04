---
name: rescatar-pdf
description: "Rescata PDFs que el lector nativo no puede abrir: extrae el texto por página y renderiza páginas a imagen con PyMuPDF local. Úsala cuando aparezca 'PDF parser FaaS call failed', 'failed to parse PDF' o 'does not support pdf input', o cuando un PDF grande falle al leerse. (PDF roto, parser, FaaS, PyMuPDF, extraer texto)"
---

# Rescatar PDF (PyMuPDF local)

## Regla central

Si leer un PDF falla, no se reintenta el mismo camino. La lectura nativa adjunta el PDF a un servicio de parseo (FaaS) que puede caerse o no estar disponible, y eso no se arregla desde la sesión. La salida es procesar el archivo localmente con Python + PyMuPDF y trabajar con el resultado: texto completo y páginas a imagen.

Nunca declare "no puedo leer el PDF" sin haber intentado esta vía.

## Cuándo usar

- Error `failed to parse PDF at input[...].output[...]: PDF parser FaaS call failed`.
- Error `Cannot read pdf (this model does not support pdf input)`.
- Un PDF grande (varias decenas de MB o 100+ páginas) que falla, se corta o queda truncado al leerse.
- Hace falta citar páginas exactas de un PDF que no se deja abrir.

## Paso 1: verificar PyMuPDF

```powershell
python -c "import fitz; print('PyMuPDF', fitz.version)"
```

Si no está instalado: `python -m pip install pymupdf`.

## Paso 2: extraer el texto completo

Con el script incluido en esta skill:

```powershell
python "C:\Users\Pablo\.claude\skills\rescatar-pdf\extraer_pdf.py" "C:\ruta\informe.pdf"
```

Genera `informe.txt` en UTF-8, con marcadores `===== PAGINA N =====` y el total de páginas. Referencia real: un informe de 124 páginas y 8 MB produjo cerca de 200 KB de texto en segundos.

Alternativa inline (sin script), para una sola vez:

```powershell
@'
import fitz, pathlib
pdf = pathlib.Path(r"C:\ruta\informe.pdf")
doc = fitz.open(str(pdf))
print("PAGINAS:", len(doc))
with open(pdf.with_suffix(".txt"), "w", encoding="utf-8") as f:
    for i, pagina in enumerate(doc):
        f.write(f"\n===== PAGINA {i + 1} =====\n" + pagina.get_text("text") + "\n")
print("LISTO")
'@ | python -
```

## Paso 3: leer el texto por bloques

El `.txt` puede pasar de 2.000 líneas: léalo con Read usando `offset` y `limit` en bloques de 800 a 1.000 líneas. Los marcadores de página permiten ubicar cada sección y citar con precisión.

## Paso 4: páginas visuales a imagen

Para diagramas, capturas o tablas que importan por lo gráfico, renderice solo esas páginas y léalas como imagen. La lectura de imágenes sí funciona aunque el PDF no se pueda parsear:

```powershell
python "C:\Users\Pablo\.claude\skills\rescatar-pdf\extraer_pdf.py" "C:\ruta\informe.pdf" --paginas 116-119,124 --imgs "C:\temp\paginas" --zoom 1.5
```

Luego lea `pag_116.jpg`, `pag_117.jpg`, etc. con Read. Zoom recomendado: 1.2-1.5 para la página completa; 3-4 para una zona (con `clip` de PyMuPDF si hace falta recortar).

## Notas

- En consola Windows los acentos pueden verse rotos; el `.txt` queda correcto en UTF-8. No juzgue el archivo por lo que imprime la consola.
- PDF escaneado (sin capa de texto): la extracción sale vacía o mínima. Renderice las páginas y use OCR (skill `pdf`, pytesseract) o léalas como imagen directo.
- Todo el proceso es local: sin internet ni servicios externos.

## Verificación

- [ ] El `.txt` existe y contiene los marcadores `===== PAGINA N =====`.
- [ ] El total de páginas coincide con el PDF.
- [ ] Las páginas renderizadas se leen como imagen y son legibles.
