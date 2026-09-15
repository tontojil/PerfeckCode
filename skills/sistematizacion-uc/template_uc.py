"""Template UC v1 — Formato Sistematizacion UC Trabajo Social Personas Mayores.
Adaptado de template INACAP v5. Cambios: colores UC azul #003366 + dorado #C9A86A,
Times 12 / Calibri 11, interlineado 1.5, margenes 2.54 cm, APA 7.
Uso: importar y llamar funciones. NO copiar este codigo.
"""
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os

# ── Colores institucionales UC ──
UC_BLUE = "003366"
UC_GOLD = "C9A86A"
UC_DARK = "1A1A1A"
COVER_TITLE = "003366"
COVER_SUBTITLE = "4C4C4C"
COVER_META = "404040"
COVER_DATE = "606060"
HEADING1_COLOR = "003366"
HEADING2_COLOR = "005A9C"
HEADING3_COLOR = "404040"
TABLE_HEADER_BG = "003366"
TABLE_HEADER_TEXT = "FFFFFF"
TABLE_BORDER = "BFBFBF"
ROW_ALT_A = "FFFFFF"
ROW_ALT_B = "E8EEF3"
FOOTER_TEXT = "666666"
FIGURE_GRAY = "595959"

MARGIN_CM = 2.54

def _hex_to_rgb(h):
    h = h.lstrip("#")
    return RGBColor(int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

def _setup_page(section):
    from docx.shared import Cm
    section.page_width = Cm(21.59)
    section.page_height = Cm(27.94)
    section.top_margin = Cm(MARGIN_CM)
    section.bottom_margin = Cm(MARGIN_CM)
    section.left_margin = Cm(MARGIN_CM)
    section.right_margin = Cm(MARGIN_CM)

def _center(doc, text, size, bold=False, color="000000"):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    r.font.size = size
    r.font.bold = bold
    r.font.color.rgb = _hex_to_rgb(color)
    r.font.name = "Calibri"
    return p

def _empty(doc):
    doc.add_paragraph("")

def _setup_styles(doc):
    # Estilo Normal: Calibri 11, interlineado 1.5, justificado
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(11)
    pf = style.paragraph_format
    pf.line_spacing = 1.5
    pf.space_after = Pt(6)
    pf.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    # Headings
    for i, (sz, col) in enumerate([
        (14, HEADING1_COLOR), (12, HEADING2_COLOR), (12, HEADING3_COLOR),
        (11, HEADING3_COLOR), (11, "000000"), (11, "000000"),
    ], start=1):
        hs = doc.styles[f"Heading {i}"]
        hs.font.name = "Calibri"
        hs.font.size = Pt(sz)
        hs.font.bold = True
        hs.font.color.rgb = _hex_to_rgb(col)

def create_doc(universidad="Pontificia Universidad Catolica de Chile",
               escuela="Escuela de Trabajo Social",
               titulo="Titulo del Informe",
               autora="Nombre Autora",
               docente_guia="Nombre Docente Guia",
               centro="Nombre Centro / Comuna",
               fecha="Septiembre 2026",
               subtitulo=""):
    """Crea documento UC con portada y seccion cuerpo. Retorna doc."""
    doc = Document()
    s1 = doc.sections[0]
    _setup_page(s1)
    # Portada UC (sin banner INACAP, franja azul simulada con texto)
    for _ in range(6):
        _empty(doc)
    _center(doc, universidad, Pt(12), bold=True, color=COVER_META)
    _center(doc, escuela, Pt(12), color=COVER_META)
    _empty(doc)
    _center(doc, titulo, Pt(16), bold=True, color=COVER_TITLE)
    if subtitulo:
        _center(doc, subtitulo, Pt(14), color=COVER_SUBTITLE)
    _empty(doc)
    _center(doc, f"Autora: {autora}", Pt(12), color=COVER_META)
    _center(doc, f"Docente guia: {docente_guia}", Pt(12), color=COVER_META)
    _center(doc, centro, Pt(12), color=COVER_META)
    _empty(doc)
    _center(doc, fecha, Pt(12), color=COVER_DATE)
    _empty(doc)
    # Franja UC (linea texto azul + dorado)
    _center(doc, "─" * 60, Pt(8), color=UC_BLUE)
    _center(doc, "─" * 60, Pt(6), color=UC_GOLD)
    # Seccion cuerpo
    s2 = doc.add_section()
    _setup_page(s2)
    _setup_styles(doc)
    return doc

def heading(doc, text, level=1):
    return doc.add_heading(text, level=level)

def body(doc, text):
    p = doc.add_paragraph(text)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    return p

def section(doc, title, paragraphs, level=1):
    heading(doc, title, level=level)
    for par in paragraphs:
        body(doc, par)

def bullet(doc, text):
    return doc.add_paragraph(text, style="List Bullet")

def bullets(doc, items):
    for it in items:
        bullet(doc, it)

def table(doc, headers, rows, col_widths=None):
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.style = "Table Grid"
    # Header
    for j, h in enumerate(headers):
        cell = t.rows[0].cells[j]
        cell.text = h
        for par in cell.paragraphs:
            par.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in par.runs:
                r.font.bold = True
                r.font.color.rgb = _hex_to_rgb(TABLE_HEADER_TEXT)
                r.font.size = Pt(11)
        shading = cell._tc.get_or_add_tcPr()
        from docx.oxml import parse_xml
        from docx.oxml.ns import nsdecls
        shading.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{TABLE_HEADER_BG}"/>'))
    # Rows
    for i, row in enumerate(rows):
        bg = ROW_ALT_A if i % 2 == 0 else ROW_ALT_B
        for j, val in enumerate(row):
            cell = t.rows[i + 1].cells[j]
            cell.text = str(val)
            shading = cell._tc.get_or_add_tcPr()
            from docx.oxml import parse_xml
            from docx.oxml.ns import nsdecls
            shading.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg}"/>'))
    return t

def page_break(doc):
    doc.add_page_break()

def figure(doc, number, description):
    p = doc.add_paragraph(f"Figura {number}: {description}")
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for r in p.runs:
        r.font.size = Pt(9)
        r.font.italic = True
        r.font.color.rgb = _hex_to_rgb(FIGURE_GRAY)
    return p

def cite_apa(authors, year, page=None):
    if isinstance(authors, list):
        a = " y ".join(authors) if len(authors) == 2 else f"{authors[0]} et al."
    else:
        a = authors
    return f"({a}, {year}, p. {page})" if page else f"({a}, {year})"

def cite_apa_narrative(authors, year, page=None):
    if isinstance(authors, list):
        a = " y ".join(authors) if len(authors) == 2 else f"{authors[0]} et al."
    else:
        a = authors
    return f"{a} ({year}, p. {page})" if page else f"{a} ({year})"

def _reference(doc, text):
    p = doc.add_paragraph(text)
    pf = p.paragraph_format
    pf.left_indent = Pt(36)
    pf.first_line_indent = Pt(-36)
    return p

def reference_book(doc, author, year, title, publisher, edition=None):
    ed = f" ({edition} ed.)." if edition else "."
    _reference(doc, f"{author} ({year}). {title}{ed} {publisher}.")

def reference_article(doc, author, year, title, journal, volume, issue=None, pages=None, doi=None):
    iss = f"({issue})" if issue else ""
    pg = f", {pages}" if pages else ""
    d = f" https://doi.org/{doi}" if doi else ""
    _reference(doc, f"{author} ({year}). {title}. {journal}, {volume}{iss}{pg}.{d}")

def reference_website(doc, author, year, title, site, url):
    _reference(doc, f"{author} ({year}). {title}. {site}. {url}")

def save(doc, filepath):
    doc.save(filepath)
    return filepath
