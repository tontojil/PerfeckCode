---
name: inacap
description: Generar documentos académicos formato INACAP en DOCX, informes, evaluaciones, portada y trabajos universitarios. (DOCX, academic, document, python-docx)
---

# INACAP Academic Document Generator — v4

Genera documentos DOCX con formato institucional INACAP.

## Filosofia

3 pilares:

1. **Instrucciones del profesor > todo**
2. **Contenido investigado, no inventado**
3. **Formato institucional INACAP** (esta skill)

---

## Flujo de trabajo

### Paso 1: Recolectar datos

Preguntar (si no estan en el contexto):

| Dato | Ejemplo |
|---|---|
| Carrera | `"Ingenieria en Informatica"` |
| Asignatura | `"Aseguramiento de Calidad"` |
| Titulo | `"Analisis de Calidad ISO 25010 — Zoom"` |
| Subtitulo (opcional) | `""` |
| Profesor | `"Roberto Conejeros Gomez"` |
| Integrantes | `["Persona 1", "Persona 2"]` |
| Fecha | `"Mayo 2026"` |
| Sede | `"INACAP Santiago Centro"` |
| Instrucciones del profesor | pegar texto, adjuntar PDF, o describir |

### Paso 2: Analizar instrucciones

Extraer: secciones exigidas, extension, tipo de informe, metodo de citacion, rubrica.

### Paso 3: Investigar

WebSearch con al menos 3 queries. 5+ fuentes verificables.

### Paso 4: Escribir contenido

Lenguaje formal tercera persona. Cada parrafo: afirmacion + evidencia + analisis.

### Paso 5: Generar DOCX

Script Python que importa de `template.py`.

### Paso 6: Auto-evaluar

Contra rubrica del profesor. Si < 80%, corregir.

---

## Formato del documento — Especificaciones EXACTAS

### Pagina

| Propiedad | Valor |
|---|---|
| Tamano | US Letter (8.5 × 11") |
| Margenes | 2.50 cm todos |
| Header distancia | 0.79 cm |
| Footer distancia | 0.96 cm |
| Orientacion | Portrait |
| Primera pagina | `titlePg` (sin header/footer estandar) |

### Colores institucionales INACAP

| Constante | Hex | Uso |
|---|---|---|
| `INACAP_RED` | `#ed1c24` | Rojo corporativo base |
| `INACAP_DARK` | `#231f20` | Negro corporativo base |
| `COVER_TITLE` | `#C00000` | Titulo en portada |
| `COVER_SUBTITLE` | `#4C4C4C` | Subtitulo, lineas institucionales |
| `COVER_META` | `#404040` | Profesor, integrantes, sede |
| `COVER_DATE` | `#606060` | Fecha de entrega |
| `HEADING1` | `#231f20` | Heading 1 (negro corporativo) |
| `HEADING2` | `#ed1c24` | Heading 2 (rojo INACAP) |
| `HEADING3` | `#404040` | Heading 3 (gris oscuro) |
| `TABLE_HEADER_BG` | `#231f20` | Fondo cabecera tabla |
| `TABLE_HEADER_TEXT` | `#FFFFFF` | Texto cabecera tabla |
| `TABLE_BORDER` | `#BFBFBF` | Bordes de tabla |
| `ROW_ALT_A` | `#FFFFFF` | Fila tabla — blanca |
| `ROW_ALT_B` | `#E7E6E6` | Fila tabla — gris alternada |
| `DIVIDER_RED` | `#ed1c24` | Lineas divisorias |
| `FOOTER_TEXT` | `#666666` | Texto footer |
| `FIGURE_GRAY` | `#595959` | Pie de figura |

**NUNCA usar azules (#1F4E79, #2E74B5, #4472C4) ni verdes. Solo rojo INACAP, negro corporativo, grises y blanco.**

### Tipografia v4 (reglas institucionales INACAP)

**UNICA fuente: Arial**. Interlineado: 1.0 (sencillo) para todo.

| Elemento | Pt | Bold | Color | Alineacion |
|---|---|---|---|---|
| Titulo portada | 16 | Si | `#C00000` | Centro |
| Subtitulo portada | 14 | No | `#4C4C4C` | Centro |
| Profesor | 12 | No | `#404040` | Centro |
| Integrantes | 12 | No | `#404040` | Centro |
| Fecha | 12 | No | `#606060` | Centro |
| Sede | 12 | No | `#404040` | Centro |
| Heading 1 | 14 | Si | `#231f20` | Izquierda |
| Heading 2 | 12 | Si | `#ed1c24` | Izquierda |
| Heading 3 | 12 | Si | `#404040` | Izquierda |
| Heading 4 | 11 | Si | `#404040` | Izquierda |
| Heading 5 | 11 | Si | `#000000` | Izquierda |
| Heading 6 | 11 | Si | `#000000` | Izquierda |
| Body / Normal | 11 | No | `#000000` | Justificado |
| Footer | 10 | No | `#666666` | — |
| Tabla header | 11 | Si | `#FFFFFF` | Centro |
| Tabla datos | 11 | No | `#000000` | Izquierda |
| Bullet points | 11 | No | `#000000` | Justificado |
| Pie de figura | 9 | No (italic) | `#595959` | Centro |

### Heading 1 — con linea divisoria

- 14pt bold `#231f20`
- Borde inferior: single, sz=8, color=`#ed1c24`, space=4
- SpaceBefore=Pt(12), SpaceAfter=Pt(4)

### Portada

Estructura vertical (gold standard validado por usuario):

```
[cover_banner_wide.png — full-width en header de seccion 1, 22.46cm ancho]

(12 lineas en blanco)

TITULO — 16pt bold #C00000 centro
Subtitulo (si hay) — 14pt #4C4C4C centro

(1 linea)

Profesor — 12pt #404040 centro

(1 linea)

Integrante 1 — 12pt #404040 centro
Integrante 2 — 12pt #404040 centro
...

(1 linea)

Fecha — 12pt #606060 centro

(1 linea)

Sede — 12pt #404040 centro
```

Sin labels ("Profesor:", "Integrantes:"). Solo los valores. Sin linea divisoria.

### Header (paginas 2+)

- Logo `inacap_logo.png` a la izquierda, **8.31 cm** ancho
- Linea divisoria inferior: single, sz=6, color=`#ed1c24`, space=4

### Footer (paginas 2+)

- Borde superior: single, sz=4, color=`#BFBFBF`, space=4
- Texto: `"Asignatura."` izquierda, 10pt, `#666666`
- Numero de pagina: derecha via PAGE field

### Tablas

```
┌──────────────────────────────────────┐
│  Header Col 1  │  Header Col 2  │... │ ← #231f20 bg, blanco 11pt bold
├──────────────────────────────────────┤
│  dato 1        │  dato 2        │... │ ← #FFFFFF bg (fila 0)
├──────────────────────────────────────┤
│  dato 3        │  dato 4        │... │ ← #E7E6E6 bg (fila 1)
├──────────────────────────────────────┤
│  dato 5        │  dato 6        │... │ ← #FFFFFF bg (fila 2)
└──────────────────────────────────────┘
```

- 6 bordes: single, sz=4, color=`#BFBFBF`
- Header: `#231f20` bg, texto blanco 11pt bold centrado
- Filas: alternancia `#FFFFFF` / `#E7E6E6`
- Texto celdas: 11pt Arial

---

## Workflow DOCX

### Dependencias

```bash
pip install python-docx
```

### Patron de uso

```python
import sys, os
sys.path.insert(0, os.path.expanduser("~/.claude/skills/inacap"))
from template import create_doc, heading, body, section, table, page_break, figure, save

doc = create_doc(
    carrera="Ingenieria en Informatica",
    asignatura="Aseguramiento de Calidad",
    titulo="Titulo del Informe",
    profesor="Nombre Profesor",
    integrantes=["Persona 1", "Persona 2"],
    fecha="Mayo 2026",
    sede="INACAP Santiago Centro",
)

section(doc, "1. Introduccion", [
    "Parrafo 1...",
    "Parrafo 2...",
], level=1)

section(doc, "2.1 Sub-seccion", [
    "Parrafo 1...",
], level=2)

table(doc, ["Col A", "Col B"], [
    ["v1", "v2"],
    ["v3", "v4"],
])

save(doc, "/ruta/output.docx")
```

### API completa

| Funcion | Descripcion |
|---|---|
| `create_doc(carrera, asignatura, titulo, profesor, integrantes, fecha, sede, subtitulo="")` | Crea documento con portada y headers |
| `insert_toc(doc, levels=3)` | Inserta campo de Tabla de Contenido (actualizar con F9 en Word) |
| `heading(doc, text, level=1)` | Heading jerarquico (1-6) |
| `body(doc, text)` | Parrafo justificado 11pt con spacing |
| `section(doc, title, paragraphs, level=1)` | heading + n parrafos body |
| `bullet(doc, text)` | Bullet point 11pt |
| `bullets(doc, items)` | Lista de bullets |
| `sub_heading(doc, text, color="red")` | Sub-heading coloreado (red/dark) |
| `image(doc, path, width_cm=None, description=None, number=None)` | Inserta imagen centrada con pie de figura opcional |
| `table(doc, headers, rows, col_widths=None)` | Tabla formato INACAP |
| `page_break(doc)` | Salto de pagina |
| `figure(doc, number, description)` | Pie de figura 9pt italic |
| `cite_apa(authors, year, page=None)` | Cita parentetica APA 7. Usa "&" entre autores. Retorna string |
| `cite_apa_narrative(authors, year, page=None)` | Cita narrativa APA 7. Usa "y" entre autores. Retorna string |
| `reference_book(doc, author, year, title, publisher, edition=None)` | Referencia APA 7ma: libro |
| `reference_book_chapter(doc, author, year, chapter_title, editor, book_title, pages, publisher, edition=None)` | Referencia APA 7ma: capitulo de libro |
| `reference_article(doc, author, year, title, journal, volume, issue=None, pages=None, doi=None)` | Referencia APA 7ma: articulo |
| `reference_website(doc, author, year, title, site, url)` | Referencia APA 7ma: pagina web |
| `save(doc, filepath)` | Guardar .docx |

---

## Uso de nuevas funciones

### Tabla de Contenido

Llamar `insert_toc(doc)` justo despues de `create_doc()`. Inserta UNICAMENTE el campo automatico de Word con `TOC \o "1-3" \h \z \u`. Usa Heading 1, Heading 2 y Heading 3 reales en el cuerpo. Al abrir vaya a Referencias > Actualizar tabla y el indice se rellena solo. No se genera lista manual.

```python
doc = create_doc(...)
insert_toc(doc)  # solo campo automatico
section(doc, "1. Introduccion", [...])  # Heading 1 real
```

### Imagenes

```python
image(doc, "diagrama.png", width_cm=14, description="Arquitectura del sistema", number=1)
# Genera: imagen centrada + "Figura 1: Arquitectura del sistema" abajo
```

### Citas APA 7ma

`cite_apa()` retorna string para intercalar en parrafos (parentetica, usa "&"):

```python
body(doc, f"La calidad del software es fundamental {cite_apa('Pressman', 2020)}.")
body(doc, f"Estudios recientes {cite_apa(['Sommerville', 'Sawyer'], 2022, page=156)} confirman...")
```

`cite_apa_narrative()` para citas narrativas (autor como parte de la oracion, usa "y"):

```python
body(doc, f"Segun {cite_apa_narrative('Pressman', 2020)}, la calidad es fundamental.")
body(doc, f"{cite_apa_narrative(['Sommerville', 'Sawyer'], 2022)} plantean que...")
```

Referencias al final del documento:

```python
heading(doc, "Referencias Bibliograficas", level=1)
reference_book(doc, "Pressman, R.", 2020,
    "Software Engineering: A Practitioner's Approach",
    "McGraw-Hill", edition="9")
reference_article(doc, "Sommerville, I. y Sawyer, P.", 2022,
    "Requirements Engineering: Current Practices", "IEEE Software", "39",
    issue="3", pages="22-31", doi="10.1109/MS.2022.3172917")
reference_book_chapter(doc, "Fernandez, M.", 2021,
    "Calidad en equipos agiles", "Garcia, L. (Ed.)",
    "Ingenieria de Software Moderna", "45-67", "McGraw-Hill")
reference_website(doc, "ISO", 2011,
    "ISO 25010: Systems and software Quality Requirements and Evaluation",
    "ISO", "https://www.iso.org/standard/35733.html")
```

---

## Assets

Ubicacion: `~/.claude/skills/inacap/assets/`

| Archivo | Uso | Ancho |
|---|---|---|
| `inacap_logo.png` | Header paginas 2+ y banner portada | 8.31 cm / 22.46 cm |
| `cover_banner_wide.png` | Header de seccion portada | 22.46 cm |

---

## Citacion APA

Default: APA 7ma Edicion. Si el profesor pide otra cosa, seguir al profesor.

**Cita en texto**: `(Apellido, Ano)` para 1 autor, `(Apellido y Apellido, Ano)` para 2, `(Apellido et al., Ano)` para 3+.

---

## Redaccion academica y detectores de IA

### Contexto

Los detectores de IA (ZeroGPT, GPTZero, Turnitin) tienen **tasas de falsos positivos de 16-20%** en textos académicos en español (PeerJ Computer Science, 2025). El texto académico formal en tercera persona — exactamente lo que INACAP exige — es particularmente propenso a ser mal clasificado porque comparte patrones estadísticos con texto generado por IA: perplejidad baja, estructura predecible, vocabulario formal uniforme.

**La skill NO genera contenido — solo formatea.** Si el contenido lo escribis vos, no deberia haber problema. Pero ciertas practicas de redaccion reducen naturalmente el riesgo de falsos positivos sin comprometer la calidad academica.

### Tecnicas de redaccion que reducen falsos positivos

Estas tecnicas NO son "anti-deteccion" — son buenas practicas de escritura academica que ademas producen texto estadisticamente mas "humano":

1. **Variar longitud de oraciones.** Los detectores marcan la uniformidad extrema como patron "machine-like". Alternar oraciones cortas (10-15 palabras) con largas (25-35 palabras) rompe ese patron.
2. **Evitar conectores mecanicos repetitivos.** "Ademas", "Por otro lado", "Asimismo", "En conclusion" en CADA parrafo dispara alertas. Usar transiciones variadas o ninguna transicion explicita cuando el flujo logico es claro.
3. **Incluir datos, ejemplos y cifras especificas.** El texto generico sin anclaje empirico es la principal señal de IA. Cada afirmacion debe respaldarse con evidencia concreta: numeros, fuentes, casos.
4. **Agregar reflexiones criticas genuinas.** Los LLM no hacen autentica autocrítica. Señalar limitaciones del analisis, reconocer sesgos en las fuentes, o discutir interpretaciones alternativas son marcas humanas dificiles de imitar.
5. **Preservar vocabulario tecnico del dominio.** No reemplazar terminos tecnicos por sinonimos "mas naturales". El vocabulario preciso del campo demuestra conocimiento genuino.
6. **Citar fuentes especificas con contexto.** No solo nombrar autores — explicar POR QUE esa fuente es relevante, QUE limitaciones tiene, COMO se relaciona con otras fuentes.

### Que NUNCA hacer

- **"Humanizadores" de texto**: introducen errores factuales, distorsionan significado tecnico y parecen ocultacion intencional (mas grave que el uso transparente de IA).
- **Parafraseo automatico** para evadir detectores: distorsiona terminos tecnicos y genera inconsistencias entre secciones.
- **Copiar y pegar** texto generado por IA sin revision sustancial.

### Defensa ante falsos positivos

Si un profesor cuestiona la autoria:

1. **Historial de versiones.** Google Docs, Word con control de cambios, o commits Git muestran el proceso de escritura incremental (prueba de autoría humana).
2. **Artefactos del proceso.** Notas de investigacion, borradores, busquedas de WebSearch guardadas, datos recolectados.
3. **Conocimiento demostrable.** Poder explicar oralmente cualquier parte del informe — un LLM no puede defender tu trabajo en persona.

### Postura de la skill

Esta skill es un **asistente de formato**, no un generador de contenido. La investigacion (WebSearch) y la redaccion (parrafos) las hace el usuario. La skill aplica formato INACAP, APA 7ma, tablas, TOC y referencias. Esto es uso etico y transparente de IA — analogo a usar una plantilla de Word, no a que alguien escriba por vos.

---

## Reglas CRITICAS

### Formato
1. **Tipografia**: SIEMPRE Arial. Calibri PROHIBIDO.
2. **Colores**: NUNCA azul. Solo rojo `#ed1c24`, negro `#231f20`, grises, blanco.
3. **Body**: 11pt justificado (regla institucional v4).
4. **H1**: 14pt bold `#231f20` + borde inferior rojo `#ed1c24`.
5. **H2**: 12pt bold `#ed1c24` (rojo INACAP).
6. **Header logo**: 8.31 cm ancho (tamano exacto de referencia).
7. **Footer borde**: `#BFBFBF` gris, NO rojo ni negro.
8. **Footer texto**: `#666666` gris, NO negro.
9. **Tabla header bg**: `#231f20` negro corporativo, NO azul.
10. **Tabla filas alternadas**: `#E7E6E6` gris, NO celeste.
11. **Portada**: sin labels ("Profesor:", "Integrantes:"). Solo valores centrados.
12. **Interlineado**: 1.0 sencillo para todo.
13. **Parrafos consecutivos**: espacio visible (6pt space_after).

### Contenido
- NUNCA inventar datos, estadisticas, o citas.
- NUNCA texto placeholder o lorem ipsum.
- SIEMPRE investigar con WebSearch antes de escribir.
- SIEMPRE lenguaje formal academico tercera persona.
- CADA parrafo de desarrollo = afirmacion + evidencia + analisis.

### Instrucciones del profesor
- Prioridad ABSOLUTA sobre esta skill.
- Si el profesor contradice algo aca → seguir al profesor.
- Siempre preguntar por instrucciones si no fueron proporcionadas.

---

## Archivos de la skill

```
~/.claude/skills/inacap/
├── SKILL.md              # Este archivo
├── template.py           # Generador DOCX (python-docx)
└── assets/
    ├── inacap_logo.png       # Logo header (982×131 px)
    └── cover_banner_wide.png # Banner portada (2550×700 px)
```

**Compatibilidad:** la ruta canónica es `~/.claude/skills/inacap` y no debe cambiarse. En OpenCode esta skill se descubre y resuelve de forma nativa, sin copiarla; el proyecto la refleja en `skills/inacap/` solo como espejo idéntico.

---

## Anexo 7.0 INACAP — Sistema especializado para maxima calificacion (v2 definitiva)

Sintesis de 7 informes INACAP con nota maxima. Usted aplica este anexo en todo trabajo INACAP sin excepcion.

### A. Portada y datos exactos que el docente revisa primero

Orden: titulo, subtitulo si hay, profesor nombre completo, integrantes completos, fecha dia de mes de ano, sede. Sin labels. Usted verifica letra por letra: codigo asignatura (FGIE03, TIHI84, ATEP01, TIHI43), seccion (IEI(1)-N8-C2), nombre docente (Mabel Del Carmen Zepeda Zuniga, Juan Jose Mir, Rory Walter Alveal Lira, Manuel Sanchez Carcamo, Roberto Alveal Ortega). Un codigo o tilde mal puestos bajan la nota.

### B. Densidad 7.0 INACAP

1 tabla cada 1.5 a 2 paginas con formato "Tabla N. Titulo. Fuente: Elaboracion propia." Mas Nota cuando aplica. Figuras con "Figura N. Titulo. Nota. Elaboracion propia." Indices de tablas y figuras al inicio cuando hay mas de 5. Minimo 5 referencias APA 7 con fecha de recuperacion en trabajo corto, 10 en medio, 20 en titulo. Guia base obligatoria: INACAP (s.f.). Guia para citas y referencias bibliograficas segun Norma APA, 7.a edicion. https://digital.inacap.cl/documentos/biblioteca/Norma_APA_7ma_ed_v2.pdf

### C. Trazabilidad INACAP con codigos

D1-Dn evidencias del equipo, F1-Fn fuentes oficiales, CU/RF/CA/KPI segun carrera, S01 supuestos, R01 riesgos. Mas 3 tablas: objetivos vs capitulos, trazabilidad completa, correspondencia informe vs rubrica del docente (criterio, seccion, evidencia). Esta ultima es la que el docente usa para calificar.

### D. Contenido por carrera (plantillas verificadas)

- Informatica software: historias HU, cronograma Scrum, arquitectura 4+1, interfaces por rol, BD con diccionario campo por campo, OWASP, plan pruebas CP01-CPn, UML 8 tipos.
- Informatica datos o BI: diagnostico fragmentacion, gobierno DAMA (politicas, estandares, procesos, personas, tecnologias), ciclo de vida 6 etapas, comparativa ponderada PowerBI vs Tableau, plan 12 semanas, KPI con dueno.
- Evaluacion proyectos: descripcion, inversion (fijos + puesta en marcha + capital trabajo), CAPM con 4 parametros justificados, WACC, depreciacion SII, flujos 5 anos, VAN/TIR/PRI con interpretacion, sensibilidad 4 escenarios, factibilidad realista.
- Innovacion FGIE03: lienzo exploratorio, 2 entrevistas (usuario + experto) con 6 objetivos cada una, PESTAL 6 factores, vaciado con codigos T1/T2, categorizacion con citas, priorizacion, 4 antecedentes con ficha resuelto/por resolver, 40 ideas AT/VC/AS/GA, metricas SMART, co-creacion 45 min, plan T-7 a T-1 con horas-persona.

### E. Honestidad y limites que suben la nota

Incluya siempre supuestos S01, riesgos R01 con probabilidad/impacto/mitigacion, y subseccion Limites declarados (N entrevistas no generalizan, metas por validar, instrumento disenado no aplicado, precios y licencias por verificar). Frases modelo: "supuesto de dimensionamiento que debera validarse", "objetivos por validar, no resultados", "planificados; no se presentan como ejecutados".

### F. Ortografia chilena perfecta

Tildes (Evaluacion, Introduccion, Araucania), mayusculas (INACAP, Ley 21.719, SII, CORFO), numeros ($3.800.000, 14,6%), fechas (13 de octubre de 2026). Verifique nombres propios contra enunciado. Prohibido TODO, TBD, lorem ipsum.

### G. Entrega 7.0

Usted entrega: ruta completa + paginas estimadas (palabras / 450) + tablas + figuras + palabras + referencias + puntaje rubrica 100 (menos de 80 corrige) + pendientes del estudiante (datos personales, fechas, docente, plazo). Usted aplica verificacion-final antes de declarar listo. Para metodologia de contenido vea `informe-maestro`.

### H. Checklist pre-generacion INACAP (obligatorio, evita el demo sin formato)

Antes de correr el script usted verifica: 1. Usa `inacap/template.py`, nunca el template neutro, con `create_doc(carrera, asignatura, titulo, profesor, integrantes, fecha, sede, subtitulo)`. 2. Llama `insert_toc(doc)` inmediatamente despues de `create_doc`, antes de las secciones, Y ADEMAS escribe el indice estatico visible con cada titulo de capitulo y seccion palabra por palabra, porque el campo TOC solo muestra numeros tras F9. 3. Usa jerarquia real H1 para capitulos, H2 para secciones y H3 para subsecciones; el conteo final debe mostrar los tres niveles. 4. Cada tabla se crea con `table(doc, headers, rows)` precedida de un parrafo "Tabla N. Titulo." y seguida de "Fuente: Elaboracion propia." 5. Verifica assets con `_verificar_assets()` o la lista de candidatos; si falta un PNG, lo informa y no genera un DOCX sin banner ni logo. 6. Estima paginas SOLO con minimos reales: cada body 90 palabras minimo y cada tabla 6 filas minimo mas titulo y fuente. Si incumple, la estimacion miente y Word muestra menos. 7. Verifica paginas REALES en Word o PDF antes de declarar listo. Si piden 80 y Word muestra 51, expande con contenido genuino hasta 82 reales.

### I. Prohibiciones que separan 7.0 de 4.0 (causa raiz de demos flojos)

1. PROHIBIDO `doc.add_table` en crudo con `Table Grid`: deja tablas sin cabecera #231f20 ni alternancia. Use siempre `table(doc, headers, rows)` del template. QA exigido: tablas con header #231f20 = total de tablas.
2. PROHIBIDO `doc.add_heading` en crudo sin linea: deja H1 sin borde rojo. Use siempre `heading(doc, text, level)`. QA exigido: H1 con linea #ed1c24 = total de H1.
3. PROHIBIDO lista manual de indice: el indice es UNICAMENTE el campo automatico `TOC \o "1-3" \h \z \u` con Heading 1, 2 y 3 reales. Al abrir vaya a Referencias > Actualizar tabla. No se escribe estatico ni suplemento tipeado.
4. PROHIBIDO Read en PDF de 30 a 124 paginas: falla con `PDF parser FaaS call failed`. Use `pypdf` en local para patron oro (Diente Feliz 124p, 59 tablas, 35 figuras, 26058 palabras, 14 cierres, 25 refs).

---

## Repositorios

- Generacion DOCX: https://github.com/python-openxml/python-docx - crear y modificar documentos Word con Python, base de `template.py` en esta skill.

## Ejemplo minimo

```python
from docx import Document
doc = Document()
doc.add_heading("Informe INACAP", level=1)
doc.add_paragraph("Introduccion con evidencia y analisis.")
doc.add_table(rows=2, cols=2)
doc.save("informe_inacap.docx")
```
