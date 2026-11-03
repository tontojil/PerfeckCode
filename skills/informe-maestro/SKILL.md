---
name: informe-maestro
description: Sistema definitivo para informes de cualquier tema con maxima calificacion, densidad verificable, tablas y figuras numeradas, formulas justificadas, limites declarados, APA 7 y DOCX. (informes, reportes, tesis, diagnostico, diseno)
---

# Informe Maestro v3 — Sistema Definitivo para Maxima Calificacion

Sintesis de 7 informes modelo con nota maxima: Diente Feliz (124p, 59 tablas, 35 figuras, 26058 palabras, indice con puntos y numeros reales), CientoUno Titulo (57p, 42 tablas, 16 figuras), EVA2 Pymes Araucania (30p, 21 tablas, 8 figuras), EVA1 Portafolio (PESTAL, vaciado, categorizacion), GreenIoT Financiero (20 tablas, VAN/TIR/WACC), Andina PowerBI (gobierno datos DAMA), Rory GreenIoT (sensibilidad).

## 0. Formato y extension universal perfecta (cualquier tema, cualquier largo)

Usted define esto ANTES de redactar, nunca despues. Vale para tesis, diagnostico, software, BI, finanzas, innovacion, sistematizacion y titulo:

- Formato: INACAP con `inacap/template.py` si hay carrera o asignatura INACAP. Neutro con `informe-maestro/template.py` solo si el usuario pide neutro u otra institucion. PROHIBIDO crudo: siempre `heading`, `body`, `table` o `tabla_maestra`, `figure` o `figura_pie` y `cierre`.
- Extension REAL en Word con margen +2: nunca entregue justo. Si piden 80, entregue 82 a 84 reales en Word. Minimos no negociables por tipo: parrafo body 90 a 110 palabras, tabla 6 a 8 filas mas titulo `Tabla N. Titulo.` y `Fuente:` con Nota, figura con `Figura N. Titulo.` y Nota, cierre 100% de capitulos.
- QA estricto de extension antes de declarar listo: corra script que imprima promedio de palabras por parrafo body y maximo. Exija promedio mayor a 85 y ningun body largo por debajo de 70. Exija 6 a 8 filas por tabla con 3+ palabras por celda. Si promedio da 42 como fallo Informe40, reescriba a 95 reales. Luego verifique paginas REALES en Word hasta pedidas +2.
- Verificacion REAL en loop con imagenes: cada figura con imagen de 14 cm vale 0.50 paginas, cada tabla de 7 filas vale 0.35, cada parrafo de 100 palabras vale 0.22. Total real = palabras / 450 + tablas x 0.35 + figuras_con_imagen x 0.50 + 6. Si piden 80 con 10 figuras, planifique 13000 palabras + 120 tablas + 10 figuras = 28.9 + 42.0 + 5.0 + 6 = 81.9. Figura sin imagen NO cuenta espacio: use siempre `image(doc, path, width_cm=14, description, number)` con PNG existente, centrado y pie `Figura N. Titulo.` mas Nota 9pt. Verifique que cada PNG abre y que el Indice de Figuras calza. Si Word muestra 78 para 80, agregue 800 palabras + 4 tablas + 2 figuras.

## 1. Metricas de densidad para 7.0 (no negociables)

Todo informe maestro cumple estas densidades medidas en los 7 modelos. Usted las cuenta y las informa al entregar:

| Metrica | Minimo para 7.0 | Referencia modelo |
|---|---|---|
| Tablas numeradas | 1 cada 1.5 a 2 paginas (ej. 15 tablas en 30p, 40 en 60p) | Diente Feliz 59/124, CientoUno 42/57, EVA2 21/30, GreenIoT 20/25 |
| Figuras o diagramas | 1 cada 3 a 4 paginas, todas con Nota | Diente Feliz 35, CientoUno 16, EVA2 8 |
| Palabras cuerpo | 400 a 500 por pagina; informe 30p = 12.000 a 15.000 palabras | GreenIoT 4.545 en ~20p cuerpo, Andina 2.271 en ~12p cuerpo |
| Referencias APA 7 | Minimo 5 en informe corto, 10 en medio, 20 en titulo; todas con URL verificada y fecha de recuperacion | CientoUno 30 refs, GreenIoT 10 refs |
| Capitulos desarrollo | Minimo 5 secciones numeradas + introduccion + conclusiones + referencias, sin anexos por defecto | Todos los modelos |
| Cierres de capitulo | 100% de capitulos con parrafo de cierre que conecta al siguiente | Diente Feliz patron total |

Si no alcanza la densidad, usted expande contenido real (mas evidencia, mas tablas, mas analisis), nunca relleno.

## 2. Portada perfecta (universal + INACAP)

Orden exacto verificado en los 7 modelos:

```
TITULO PRINCIPAL (negrita, centrado)
Subtitulo o proyecto (si aplica)
NOMBRE: nombre completo cada integrante
CARRERA: nombre + sede (ej. Ingenieria en Informatica, INACAP Temuco)
ASIGNATURA: nombre + codigo (ej. Innovacion y Emprendimiento III, FGIE03)
SECCION: codigo curso (ej. IEI(1)-N8-C2)
PROFESOR o DOCENTE o ACADEMICO GUIA: nombre completo con tildes
FECHA: dia de mes de ano (ej. 13 de octubre de 2026)
```

Reglas: tildes obligatorias (Evaluacion -> Evaluacion con tilde, Araucania -> Araucania con tilde), mayusculas solo donde corresponde, sin faltas. En formato INACAP se usa `inacap/template.py`; en formato neutro se usa `informe-maestro/template.py`.

## 3. Estructura definitiva (plantilla que se adapta a cualquier tema)

```
Portada
Indice de contenido (con numeros de pagina reales)
Indice de Tablas (Tabla N + titulo exacto)
Indice de Figuras (Figura N + titulo exacto)
1. Introduccion (continuidad con trabajo previo + objetivo del portafolio + alcance y criterio de lectura + estructura)
2. Antecedentes o Diagnostico (problema, hallazgos, PESTAL o marco segun tema)
3. Desarrollo tematicos N capitulos (uno por objetivo, cada uno con apertura-desarrollo-cierre)
4. Propuesta o Diseno central (arquitectura, modelo, plan, con decisiones y fundamento)
5. Metricas, KPI o Plan de verificacion (formulas, metas, definiciones operativas, registros)
6. Organizacion, riesgos y supuestos (cronograma, RACI o responsables, horas-persona, S01, R01)
7. Conclusiones (por objetivo en orden + generales + limitaciones + trabajo futuro)
8. Referencias APA 7 (con fecha de recuperacion)
Sin anexos por defecto. PROHIBIDO generar anexos automaticos con comentarios internos de la IA. Solo agregue un anexo si el usuario lo pide de forma explicita y con contenido academico, nunca con trazabilidad interna, puntajes ni pendientes.
```

Para software: capitulos 3 a 5 son historias, arquitectura 4+1, interfaces, BD, pruebas, UML. Para finanzas: son inversion, WACC, depreciacion, flujos, VAN/TIR/PRI, sensibilidad. Para innovacion: son oportunidades, requerimientos, casos, ideacion, metricas, co-creacion. La logica no cambia.

## 4. Sistema de codigos de trazabilidad (solo interno, nunca en DOCX)

Los codigos D1-Dn, F1-Fn, CU, RF, CA, K, S01 y R01 son solo apuntes internos de la IA en el chat. PROHIBIDO escribirlos en el DOCX, en tablas visibles o en anexos. Si necesita verificar cobertura, informe en el chat en 1 parrafo, sin tablas de trazabilidad ni matriz contra rubrica en el documento.

PROHIBIDO incluir en el DOCX las 3 tablas internas: (a) objetivos vs capitulos, (b) trazabilidad completa, (c) informe vs rubrica. Esos comentarios de la IA van solo en el chat si el usuario los pide, nunca en el documento entregado.

## 5. Tablas y figuras formato 7.0

Tabla:

```
Tabla N. Titulo descriptivo con variables.
[contenido, encabezado negrita fondo oscuro, filas alternadas]
Nota. Elaboracion propia a partir de X / Sintesis de instrumento Y / Adaptado de Autor (ano).
```

Figura:

```
Figura N. Titulo descriptivo.
[imagen, diagrama, BPMN, UML, grafico o esquema]
Nota. Elaboracion propia. / Original proporcionado por el equipo, conservado integro.
```

Reglas: numeracion correlativa global, titulo con punto despues del numero, Nota siempre, fuente siempre. Tablas comparativas con matriz (alternativas x criterios con ponderacion y total) cuando hay decision. Ejemplo: matriz 0.30 tecnica + 0.25 economia + 0.25 implementacion + 0.20 portabilidad = total /5.

## 6. Formulas con parametros justificados (prohibido numero sin origen)

Toda cifra, formula o tasa lleva sus 4 partes: formula, valor de cada parametro, fuente de cada parametro, calculo aplicado:

```
Ke = Rf + beta x (Rm - Rf) + Ps
Rf = 5.5%: bonos Banco Central Chile BCP-10 primer trimestre 2026.
beta = 1.5: startups IoT mayor volatilidad que mercado, inferior a software puro.
(Rm - Rf) = 7.0%: prima mercado Chile, Fernandez (2022).
Ps = 3.0%: iliquidez y riesgo startup sin historial.
Calculo: Ke = 5.5% + 1.5 x 7.0% + 3.0% = 18.0%
WACC = Ke x (E/V) + Kd x (1-t) x (D/V) = 11.13% + 3.44% = 14.56% aprox 14.6%
```

Igual para VAN (tasa, horizonte, flujos), TIR (comparada con tasa), PRI (descontado, en anos), KPI (definicion, formula, fuente, meta, plazo, frecuencia, responsable, denominador congelado, que pasa si denominador cero). Metas no medidas se marcan como objetivo por validar, nunca como resultado.

## 7. Honestidad academica que sube la nota (seccion Limites declarados)

Todo informe maestro incluye parrafos de honestidad y una subseccion de limites. Frases modelo extraidas de los 7 informes:

- "Esta cantidad es un supuesto de dimensionamiento que debera validarse, no un resultado ya obtenido."
- "Las metas corresponden a objetivos por validar, no a resultados de una implementacion."
- "El alcance del levantamiento es cualitativo: permite orientar el diseno, pero no estimar la frecuencia del problema en toda la region."
- "Planificados; no se presentan como ejecutados."
- "La localizacion de los datos, por si sola, no acredita cumplimiento normativo."
- "Esta valoracion permite comparar esfuerzo; no representa remuneraciones contratadas."

Subseccion obligatoria al final antes de referencias o en conclusiones:

```
Limites declarados:
- El analisis se basa en N entrevistas y no permite generalizar a toda la poblacion.
- El umbral X y las metas Y son estimaciones y deben validarse en mas casos.
- El instrumento Z queda documentado como disenado; no se presenta como aplicado.
- Precios, licencias e integraciones dependen de versiones y deben verificarse al implementar.
```

## 8. Ortografia y redaccion chilena perfecta (checklist antes de entregar)

- Tildes: Evaluacion, Introduccion, Titulo, Tecnico, Informatica, Araucania, Temuco sin tilde pero Nunez, Fernandez, Sanchez con tilde donde va, mas/mas, solo/solo segun RAE vigente.
- Mayusculas: INACAP siempre mayusculas, Ley 19.628, Ley 21.719, SII, SERNAC, CORFO, SERCOTEC, PESTAL, FODA, KPI, SLA, VAN, TIR, PRI, WACC, CAPM.
- Numeros chilenos: $3.800.000 con punto miles, 14,6% con coma decimal, fechas "13 de octubre de 2026".
- Raya — para incisos, bullets • o guion medio, nunca mezclar.
- Nombres propios verificados letra por letra contra enunciado: Mabel Del Carmen Zepeda Zuniga, Juan Jose Mir, Rory Walter Alveal Lira, Manuel Sanchez Carcamo.
- Prohibido: TODO, TBD, por definir, lorem ipsum, "simply", "just", "obviously", repetir el mismo conector en cada parrafo.
- Variar longitud de oraciones (cortas 10-15 palabras con largas 25-35).
- Cada parrafo de desarrollo = afirmacion + evidencia + analisis.

## 9. Anexos (solo si el usuario los pide)

PROHIBIDO generar anexos automaticos. No agregue Anexo A, B, C ni D por defecto, y nunca incluya catalogos codificados, matrices de trazabilidad ni comentarios internos de la IA. Si el usuario pide un anexo academico de forma explicita, incluya solo ese contenido y citelo una vez en el cuerpo.

## 10. Flujo de trabajo en 7 pasos (no se salta ninguno)

1. Intake minimo en 1 mensaje: tema, tipo, audiencia, extension, portada completa, rubrica, insumos previos.
2. Propuesta de indice completo numerado antes de redactar. Sin indice aprobado no hay redaccion.
3. Investigacion: minimo 3 queries WebSearch, 5 fuentes (1 norma, 1 academica, 1 dato, 1 marco, 1 alternativa), WebFetch a cada URL el dia de entrega.
4. Escritura por capitulos con patron apertura-desarrollo-cierre. Cada capitulo con al menos 1 tabla. Conteo continuo de tablas, figuras, palabras.
5. Cobertura: verifique en el chat que cada objetivo quedo cubierto, sin escribir codigos ni tablas de trazabilidad en el DOCX.
6. Honestidad: agregue limites declarados y metas marcadas por validar. Supuestos y riesgos van redactados en prosa, sin codigos S01 ni R01 visibles en el documento.
7. QA y entrega: checklist ortografia, conteo real paginas/tablas/figuras/referencias, skill verificacion-final. El puntaje, la ruta y los pendientes del estudiante se informan solo en el chat, nunca dentro del DOCX.

## 11. Rubrica universal 100 puntos (autoaplicada, menos de 80 corrige)

| Criterio | Max | Que verifica para 7.0 |
|---|---|---|
| Portada y presentacion formal | 10 | Nombres, carrera, asignatura con codigo, seccion, docente completo, fecha, sede; cero faltas |
| Indices y estructura | 15 | Indice contenido + tablas + figuras con numeros reales; orden portada, indices, intro, desarrollo, conclusiones, referencias |
| Desarrollo y densidad | 30 | Responde todo lo pedido, 1 tabla cada 1.5-2p, figuras con Nota, formulas con parametros y fuentes |
| Trazabilidad y honestidad | 15 | Limites declarados y metas marcadas por validar, sin tablas internas en el documento |
| Conclusiones | 10 | Una por objetivo en orden, responde objetivo general, limitaciones, trabajo futuro, conclusiones personales si equipo |
| Bibliografia APA 7 | 10 | Minimo 5/10/20 segun extension, citas en texto, lista ordenada, URLs verificadas con fecha recuperacion |
| Redaccion y formato | 10 | Espanol neutro formal, fuente unica, interlineado uniforme, paginas numeradas, checklist ortografia pasado |

Usted informa puntaje por criterio solo en el chat, nunca dentro del DOCX.

## 12. Workflow DOCX

Contenido con esta metodologia. Formato segun pedido:

- Formato neutro universal: `informe-maestro/template.py` (create_doc, heading, body, cierre, tabla_maestra, figura_pie, save).
- Formato INACAP obligatorio: contenido de esta skill volcado con `inacap/template.py` (Arial, rojo #ed1c24, portada con banner, header con logo).
- Conversion a PDF: `pandoc` o Word con indice actualizado con F9.
- Reconstruccion obligatoria al final: despues de escribir todo, usted corre un script que escanea H1/H2 y titulos "Tabla N." y "Figura N." reales y reescribe el estatico. Nunca entrega el estatico hardcodeado del inicio sin reconstruir. Referencia: `gen50_final.py` (formatea 69 tablas a INACAP, agrega linea roja a H1, repone Tabla 70, agrega CAPM/WACC/VAN/TIR/PRI y suplemento 47 a 72).

```python
import sys, os
sys.path.insert(0, os.path.expanduser("~/.claude/skills/informe-maestro"))
from template import create_doc, heading, body, cierre, tabla_maestra, save
doc = create_doc(titulo="Titulo", autores=["Nombre 1"], asignatura="Asignatura FGIE03", docente="Docente", fecha="13 de octubre de 2026")
heading(doc, "1. Introduccion", level=1)
body(doc, "Parrafo de apertura...")
tabla_maestra(doc, numero=1, titulo="Evidencias disponibles y estado.", headers=["Registro","Contenido","Estado"], rows=[["D1","Portafolio EVA1","Realizado"]], fuente="Elaboracion propia a partir de los materiales del equipo.")
cierre(doc, "Con el diagnostico definido, el siguiente capitulo desarrolla los requerimientos.")
save(doc, "/ruta/Informe_Tema_v1.docx")
```

## 13. Diferencial 7.0 vs IA generica (por que Claude y Gemini se veian mejor)

Los informes flojos de 9 a 11 paginas con 11 a 15 tablas fallan en lo mismo. Usted corrige asi:

- Extension real desde el inicio: planifica con palabras / 450 + tablas x 0.33 + 6 y expande hasta superar lo pedido con margen de 2 paginas, nunca justo.
- Cierres 100%: cada capitulo abre con proposito y cierra conectando al siguiente. Diente Feliz tiene 14 cierres. Sin cierre el capitulo queda suelto y baja a 5.0.
- Tablas que deciden: al menos una matriz comparativa con ponderacion cuando hay decision (ejemplo 0.30 tecnica + 0.25 economia + 0.25 implementacion + 0.20 portabilidad). Las tablas descriptivas solas son de 6.0.
- Figuras con Nota siempre y citadas en cuerpo. 15 figuras con pie "Figura N. Titulo." mas Nota. Sin figura el informe es solo texto.
- Codigos en tablas tambien cuentan: D, F, CU, RF, RNF, CP, HU, S, R y N viven dentro de celdas. El conteo debe sumar parrafos mas celdas, no solo parrafos.
- PDF grandes sin FaaS: NUNCA use Read en PDF de 30 a 124 paginas porque falla con `PDF parser FaaS call failed`. Use `pypdf` en local para contar paginas, tablas, figuras y palabras del modelo.

## Reglas CRITICAS

- NUNCA inventar datos, entrevistas, cifras, citas ni URLs. Lo no validado es Supuesto S01.
- NUNCA numero sin formula, parametro y fuente. NUNCA meta presentada como resultado.
- SIEMPRE indice aprobado antes de redactar, patron apertura-cierre por capitulo y limites declarados. PROHIBIDO tablas de trazabilidad y matriz contra rubrica dentro del DOCX.
- SIEMPRE conteo real: paginas, tablas, figuras, palabras, referencias. Ruta completa + numeros solo en el chat, nunca en el documento.
- WebFetch a cada URL el dia de entrega. Si no abre, se elimina.

## Archivos

```
~/.claude/skills/informe-maestro/
├── SKILL.md
└── template.py
```

Espejo identico en `skills/informe-maestro/`.

---

## Repositorios

- Generacion DOCX: https://github.com/python-openxml/python-docx - crear y modificar documentos Word con Python, base de `template.py` en esta skill.
- Conversion de documentos: https://github.com/jgm/pandoc - convertidor universal de marcado para pasar entre Markdown, DOCX, PDF y otros formatos.
- Fuentes oficiales: https://apastyle.apa.org/ y https://digital.inacap.cl/documentos/biblioteca/Norma_APA_7ma_ed_v2.pdf - guia APA 7ma edicion para citas y referencias.

## Ejemplo minimo

```python
from docx import Document
doc = Document()
doc.add_heading("1. Introduccion", level=1)
doc.add_paragraph("Apertura con objetivo y alcance del informe.")
doc.add_table(rows=2, cols=3)
doc.save("informe_maestro.docx")
```
