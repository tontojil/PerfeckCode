# -*- coding: utf-8 -*-
"""Extrae texto e imagenes de un PDF cuando el lector nativo falla (PyMuPDF).

Uso:
  python extraer_pdf.py "informe.pdf"
  python extraer_pdf.py "informe.pdf" --txt "salida.txt"
  python extraer_pdf.py "informe.pdf" --paginas 116-119,124 --imgs "C:\\temp\\paginas" --zoom 1.5
"""

import argparse
import sys
from pathlib import Path


def parsear_paginas(texto, total):
    """Convierte '1-5,10,20' en una lista de numeros de pagina validos."""
    paginas = []
    for parte in str(texto).split(","):
        parte = parte.strip()
        if not parte:
            continue
        if "-" in parte:
            inicio, fin = parte.split("-", 1)
            rango = range(int(inicio), int(fin) + 1)
        else:
            rango = [int(parte)]
        for n in rango:
            if 1 <= n <= total:
                paginas.append(n)
            else:
                print(f"Aviso: pagina {n} fuera de rango (1-{total})")
    return paginas


def main():
    parser = argparse.ArgumentParser(description="PDF a texto (y paginas a imagen) con PyMuPDF local.")
    parser.add_argument("pdf", help="Ruta del PDF de entrada")
    parser.add_argument("--txt", help="Ruta del .txt de salida (por defecto: junto al PDF)")
    parser.add_argument("--paginas", help="Paginas a renderizar, por ejemplo 116-119,124")
    parser.add_argument("--imgs", help="Carpeta de imagenes (por defecto: <pdf>_imgs junto al PDF)")
    parser.add_argument("--zoom", type=float, default=1.5, help="Zoom de render (por defecto 1.5)")
    parser.add_argument("--formato", default="jpg", choices=["jpg", "png"], help="Formato de imagen")
    args = parser.parse_args()

    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("Falta PyMuPDF. Instalar con: python -m pip install pymupdf")
        return 1

    pdf = Path(args.pdf)
    if not pdf.exists():
        print(f"No existe el PDF: {pdf}")
        return 1

    doc = fitz.open(str(pdf))
    total = len(doc)
    print(f"PAGINAS: {total}")

    salida_txt = Path(args.txt) if args.txt else pdf.with_suffix(".txt")
    with open(salida_txt, "w", encoding="utf-8") as f:
        f.write(f"TOTAL_PAGINAS={total}\n")
        for i, pagina in enumerate(doc):
            f.write(f"\n===== PAGINA {i + 1} =====\n")
            f.write(pagina.get_text("text"))
            f.write("\n")
    print(f"TEXTO: {salida_txt} ({salida_txt.stat().st_size // 1024} KB)")

    if args.paginas:
        carpeta = Path(args.imgs) if args.imgs else pdf.parent / (pdf.stem + "_imgs")
        carpeta.mkdir(parents=True, exist_ok=True)
        for n in parsear_paginas(args.paginas, total):
            pix = doc[n - 1].get_pixmap(matrix=fitz.Matrix(args.zoom, args.zoom))
            destino = carpeta / f"pag_{n:03d}.{args.formato}"
            if args.formato == "jpg":
                try:
                    pix.pil_save(str(destino), format="JPEG", quality=75)
                except Exception:
                    destino = destino.with_suffix(".png")
                    pix.save(str(destino))
            else:
                pix.save(str(destino))
            print(f"IMG: {destino}")

    doc.close()
    print("LISTO")
    return 0


if __name__ == "__main__":
    sys.exit(main())
