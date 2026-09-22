---
name: sistematizacion-uc
description: Sistematizacion UC Trabajo Social en centro personas mayores, plan de accion e informe licenciatura. Parametrizable por autor Jara/Martinic/Cifuentes, formato UC APA 7. (UC, sistematizacion, personas mayores, plan accion)
---

# Sistematizacion UC — Trabajo Social Personas Mayores v1

Genera Informe Plan de Accion (12-15 p.) y Propuesta Sistematizacion (8-10 p.) con formato UC, no INACAP.

## Filosofia

1. **Pauta docente UC > todo**
2. **Contenido investigado con voz de personas mayores, no inventado**
3. **Formato UC** (esta skill): azul UC `#003366`, dorado `#C9A86A`, Times 12 o Calibri 11, interlineado 1.5, margenes 2.54 cm, APA 7

## CONFIG_AUTORA (completar antes de redactar)

```text
CONFIG_AUTORA = {
  universidad: "Pontificia Universidad Catolica de Chile / Escuela de Trabajo Social",
  grado: "Licenciada en Trabajo Social / en proceso de titulacion",
  centro: "[Nombre] / Comuna / 30-90 participantes 60+",
  enfoque_teorico: "critico | sistemico | fenomenologico",
  rol_autora: "practicante | coordinadora",
  autor_sistematizacion: "Jara | Martinic | Cifuentes",
  periodo: "AAAA-MM a AAAA-MM (minimo 4 meses)",
  eje: "1 frase. Ej: Acompanamiento social y participacion: tension proteccion vs autonomia"
}
```

Regla: cambio de una variable = reescritura de objetivo + pregunta eje + tabla categorias. No mezclar autores en capitulo interpretativo.

## Flujo 6 fases (16-18 semanas)

F0 Propuesta (sem 1-2): delimitacion, objeto, objetivos, eje, metodo segun autor, cronograma, etica
F1 Diagnostico participativo (sem 2-5): ficha, mapa actores, arbol problemas, FODA, diario 01-04
F2 Priorizacion y Plan (sem 5-6): matriz gravedad/frecuencia/factibilidad/interes, marco logico, Gantt 8-12 sem, RACI, linea base
F3 Ejecucion y monitoreo (sem 7-12): bitacora semanal, plan A vs B, monitoreo sem 9
F4 Sistematizacion (sem 12-15): linea tiempo validada, interpretacion segun autor, reflexion epistemologica + etica UC, 5-7 lecciones
F5 Devolucion y cierre (sem 16-18): jornada 60-90 min lenguaje claro, folleto 2 p., acta firmada >=60% asistentes

## Ruta segun autor

| Autor | Elegir si | Capitulo que genera |
|---|---|---|
| Jara 5 tiempos | Facilitadora, aprendizajes transformadores | Recuperacion historica + interpretacion critica + puntos llegada |
| Martinic CIDE | Investigadora/gestora, eficacia | Hipotesis accion, consistencia teoria-practica |
| Cifuentes | Foco identidad TS | Categorias disciplinares, horizonte transformacion |
| Transversal | Todas | Aylwin-Toledo UC (ciclo operativo) + Schon (diario reflexivo) |

Categorias por enfoque:
critico: autonomia-decision, participacion-incidencia, edadismo institucional
sistemico: red familiar, rol equipo, derivacion efectiva
fenomenologico: sentido permanencia, habitar, cuerpo-tiempo

## Indices listos

### Informe Plan Accion (12-15 p. sin anexos)
Portada UC - Indice + siglas - Introduccion (0.5 p.)
1. Contexto institucional y territorial (2 p.)
2. Diagnostico social (3 p.)
3. Plan de Accion (3 p.): matriz + Gantt + presupuesto + RACI
4. Implementacion y seguimiento (2 p.)
5. Evaluacion preliminar y proyeccion a sistematizacion (1.5 p.)
Referencias APA 7 - Anexos 0-3

### Propuesta Sistematizacion (8-10 p.)
Portada UC - Resumen 200 palabras + keywords
Introduccion - 1. Objeto y eje (1 p.) - 2. Objetivos (1+3) - 3. Marco referencial (2 p.: Jara+Cifuentes+Martinic+Aylwin/Toledo+vejez)
4. Metodologia (1.5 p.) - 5. Plan trabajo y devolucion - Referencias - Anexos

## Marco normativo (resumen para Capitulo 1)

- Ley 19.828 crea SENAMA, 60+ define persona mayor, art.3 funciones
- SENAMA Centros Diurnos Comunitarios 30/60/90 dependencia leve 3x/semana areas personal/social/comunitaria; Referenciales 90 leve/moderada
- Envejecimiento Activo OMS: salud/participacion/seguridad
- Convencion Interamericana vigente Chile 14-09-2017 D.S.162
- Ley 21.144 cuarta edad 80+ (desagregar 60-79/80+)
- Ley 21.822 pub 01-06-2026 vigente 01-06-2027 (citar como horizonte)
- Ley 20.500 + 19.418 participacion (actas validacion)
- Ley 19.628 vigente + 21.719 desde 01-12-2026 (3 consentimientos separados, seudonimizacion PM-01)
- Codigo Etica Colegio TS + CEC UC Ciencias Sociales (caratula etica, devolucion)

Fuentes: senama.gob.cl, chileatiende.gob.cl, leychile.cl, cepal.org, admision.uc.cl/trabajo-social, repositorio.uc.cl

## Instrumentos I1-I6

I1 Diario reflexivo: fecha | hito | reflexion en accion | reflexion sobre accion | vinculo teorico | pendiente
I2 Matriz recuperacion Jara por fase Aylwin: prevista vs realizada | actores | facilitadores | obstaculos | efecto | fuente
I3 Linea tiempo papelografo con mayores (verde sirvio / rojo cambiar / amarillo sorprendio)
I4 Entrevista 15-25 min 8-12 mayores: que la trajo / dia escuchada / decisiones participa / que cambiaria / decidieron por usted / mensaje a nueva persona
I5 Grupo focal equipo 60-90 min + matriz lecciones (leccion | evidencia | categoria | recomendacion, 5-7 lecciones)
I6 Tabla categorias y rigor (triangulacion, devolucion, auditoria diario-supervision, anonimizacion)

## Metricas XLSX (ver skill xlsx)

Archivo `CC_PM_UC_metricas_v1.xlsx`: 00_Diccionario | 01_Caracterizacion | 02_Asistencia | 03_PAI_6m | 04_Seguimiento | 05_Dashboard
T0 dentro de 14 dias. P01 adherencia 3x/sem >=75%, P02 ocupacion 85-100%, P03 PAI >=90%, R01 retencion 90d >=80%, R02 Barthel >=70%, R05 satisfaccion >=85% notas 6-7, I01 WHOQOL Wilcoxon, I02 GDS-5 >=40% reducen
Usar skill `xlsx` para generar. Usar skill `pptx` solo para devolucion a mayores (letra grande, lenguaje claro).

## Formato UC (diferencia INACAP)

- Portada: escudo UC superior, "Pontificia Universidad Catolica de Chile / Facultad de Ciencias Sociales / Escuela de Trabajo Social", titulo, autora, docente guia, centro, ciudad-mes-ano. Franja inferior azul `#003366` + linea dorada `#C9A86A`. NUNCA rojo INACAP `#ed1c24`
- Cuerpo: Times 12 o Calibri 11 (una sola), interlineado 1.5, margenes 2.54 cm, paginacion inferior derecha desde Introduccion
- Tablas/figuras APA 7 numeradas con nota fuente. Lenguaje: personas mayores
- Citas: Jara, O. (2018); Cifuentes, R. M. (2019); Martinic, S. (1998); Aylwin, N. et al. (1976); Schon, D. (1983)

## Workflow DOCX

```bash
pip install python-docx
```

```python
import sys, os
sys.path.insert(0, os.path.expanduser("~/.claude/skills/sistematizacion-uc"))
# o ruta repo: skills/sistematizacion-uc
from template_uc import create_doc, heading, body, section, table, page_break, save

doc = create_doc(
    universidad="Pontificia Universidad Catolica de Chile",
    escuela="Escuela de Trabajo Social",
    titulo="Sistematizacion ... Centro ...",
    autora="Nombre Autora",
    docente_guia="Nombre Docente",
    centro="Nombre Centro / Comuna",
    fecha="Septiembre 2026",
)
section(doc, "Introduccion", ["Parrafo 1..."], level=1)
table(doc, ["Col A", "Col B"], [["v1", "v2"]])
save(doc, "/ruta/output.docx")
```

API: `create_doc`, `heading`, `body`, `section`, `bullet`, `bullets`, `table`, `page_break`, `cite_apa`, `reference_*`, `save` (igual que inacap, con colores UC).

## Gate calidad (bloqueante)

QC-01 paradigma unico + QC-05 plan trazable H->A + QC-06 afirmacion+evidencia + QC-07 5+ citas PM-01 + QC-09 descripcion+interpretacion+tension + QC-13 consentimiento+anonimato + QC-18 aporte vs cita + QC-19 similitud <15%. Rubrica 100 pts: epistemologia 20 + rigor 20 + voz mayores 20 + plan 15 + etica 10 + APA 15.

## Reglas CRITICAS

1. Pauta docente UC > esta skill. Si contradice, seguir docente.
2. NUNCA inventar datos, citas, testimonios. Cada afirmacion = evidencia + codigo (DC-01, PA-02, BT-03, AP-04).
3. NUNCA fotos frontales ni RUT/direccion/RSH nominales en cuerpo. Codigos PM-01.
4. NUNCA lenguaje edadista (abuelitos, viejitos, carga). Usar personas mayores, titulares de derechos.
5. SIEMPRE devolucion con acta firmada. Sin devolucion no hay sistematizacion UC.
6. SIEMPRE espanol neutro, trato de usted.

## Referencias UC verificadas 2026 (anexo sin borrar contenido previo)

Usted cita 5 o mas fuentes APA 7 con URL verificada el dia de entrega. Usted sigue la Guia Bibliotecas UC: https://guiastematicas.bibliotecas.uc.cl/apa7 (actualizada 16-06-2026). Usted verifica cada URL antes de declarar listo.

Sistematizacion (3 autores, no mezclar en interpretacion):

- Jara, O. (2018). La sistematizacion de experiencias: practica y teoria para otros mundos posibles. Bogota: CINDE. Ficha: https://repository.cinde.org.co/handle/20.500.11907/2121 . Guia: http://biblioteca.udgvirtual.udg.mx:8080/jspui/bitstream/123456789/3845/1/Orientaciones_teorico-practicas_sistematizar_experiencias.pdf y https://centroderecursos.alboan.org/ebooks/0000/0788/6_JAR_ORI.pdf
- Martinic, S. (1998). El objeto de la sistematizacion y sus relaciones con la evaluacion y la investigacion. Ponencia Medellin, CEAAL. PDF: https://centroderecursos.alboan.org/ebooks/0000/0748/6_CEA_OBJ.pdf
- Cifuentes, R. M. (1999). La sistematizacion de la practica del Trabajo Social. Buenos Aires: Lumen-Humanitas. Ficha: https://repositorio.ts.ucr.ac.cr/handle/123456789/196 . Entrevista 2024: https://uchile.cl/noticias/223640/entrevista-a-rosa-maria-cifuentes-educadora-colombiana y https://saludpublica.uchile.cl/noticias/223498/sistematizacion-de-experiencias-clave-para-construir-conocimiento

Transversales UC:

- Aylwin Acuna, N. Evolucion historica del trabajo social. Revista de Trabajo Social UC. URL: https://repositorio.uc.cl/handle/11534/6206
- Schon, D. (1983). The Reflective Practitioner. New York: Basic Books. Resena en espanol: Camejo, S. (2017). Educacion en Contexto, II(5), 113-117. URL: https://dialnet.unirioja.es/descarga/articulo/6296650.pdf

Institucional UC y vejez:

- Admision UC Trabajo Social (grado, titulo, 10 semestres, vacantes 70, malla): https://admision.uc.cl/carreras/trabajo-social . Malla PDF: https://admision.uc.cl/htdocs/content/uploads/2021/09/70.-Trabajo-Social.pdf . Perfil de egreso: https://trabajosocial.uc.cl/pregrado/perfil-de-egreso
- Revista de Trabajo Social UC N. 104 (2026): https://ojs.uc.cl/index.php/RTS/index y https://revistatrabajosocial.uc.cl/
- Portal Tesis UC: https://repositorio.uc.cl/pagina/tesis . Ejemplos: Plan DPD https://repositorio.uc.cl/handle/11534/64474 ; fuerza laboral y envejecimiento https://repositorio.uc.cl/handle/11534/64990
- CEVE UC vejez (Caro Puga, Miranda): https://inteligenciasocial.uc.cl/personas/sara-caro-puga y Reporte Vinculos: https://observatorioenvejecimiento.uc.cl/wp-content/uploads/2023/10/Reporte-Los-Vinculos-Sociales-de-las-Personas-Mayores-en-Chile.pdf
- Sistematizacion con personas mayores en Chile (Temuco): https://www.redalyc.org/journal/5742/574275303003/html . Participacion social mayores: https://repositorio.utalca.cl/repositorio/handle/1950/13127
