---
name: litreview
description: Revisa literatura academica con matriz de evidencia, sintesis por temas y citas en APA 7. Usala cuando necesites el marco teorico de un informe. (literatura, marco teorico, APA)
---

# Litreview

Construye el marco teorico de un informe a partir de literatura academica comparada. El objetivo es sintetizar lo que dicen los autores, identificar acuerdos y vacios, y dejar cada afirmacion con su cita en formato APA 7.

Esta skill complementa a informe-maestro sin duplicarla. Esta skill produce la matriz de evidencia y la sintesis teorica. Informe-maestro usa ese insumo en los capitulos de antecedentes y desarrollo. Tambien complementa a redactor-tecnico porque entrega citas listas para redactar, sin reemplazar la redaccion final.

## Core Rule

Ningun autor entra a la sintesis sin ficha completa en la matriz de evidencia y sin cita en formato APA 7 verificada contra la fuente original.

## Cuándo usar

- Necesitas el marco teorico o los antecedentes de un informe, tesis o titulo.
- Tienes una lista de papers y debes compararlos por metodo, hallazgo y limite.
- El usuario pide "marco teorico", "revision de literatura" o "estado del arte".
- Vas a justificar una decision de diseno con literatura previa y no con opinion.

## Process

1. Define el proposito teorico en una oracion. Escribe que pregunta responde esta revision y que queda fuera.
2. Fija criterios de inclusion y exclusion. Define anos validos, idiomas, tipo de estudio y umbral minimo de calidad.
3. Busca en al menos dos bases academicas. Registra las consultas exactas, los filtros aplicados y la cantidad de resultados.
4. Selecciona con metodo PRISMA simplificado. Reporta cuantos documentos encontraste, cuantos descartaste y por que motivo.
5. Completa la matriz de evidencia. Una fila por fuente con autor, ano, metodo, muestra, hallazgo principal y limite declarado por el propio autor.
6. Sintetiza por temas, no por autor. Agrupa los hallazgos en dos a cuatro temas y compara acuerdos, contradicciones y vacios.
7. Redacta con cita en cada parrafo. Cada afirmacion teorica lleva su cita con autor y ano, y la lista final queda en formato APA 7.
8. Declara los vacios y entrega segun el Output Contract de esta skill.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```markdown
<!-- Resumen por autor sin sintesis -->
Fernandez (2022) habla de riesgo. Lopez (2023) habla de pagos.
Ambos son importantes para el proyecto.
```

Problema: no hay matriz, no hay comparacion, no hay metodo ni limite, y la sintesis no responde a una pregunta.

Ejemplo correcto:

```markdown
<!-- Sintesis tematica con matriz -->
Tema 1: Prima de riesgo en mercados pequenos.
Fernandez (2022), con muestra de 120 empresas chilenas, estima
una prima de 7,0%. Lopez (2023), con muestra de 40 startups,
reporta un rango de 6,5% a 7,5% pero advierte que su muestra
no permite generalizar. Acuerdo: el rango converge. Vacio: no
hay estimacion especifica para IoT rural. Ver matriz E1-E2.
```

Explicacion: compara metodo y muestra, identifica acuerdo y vacio, y remite a la matriz de evidencia.

## Niveles de aplicación

- Nivel corto: cinco fuentes, una tabla de matriz simple, dos temas de sintesis. Sirve para un informe de 15 paginas.
- Nivel estandar: diez fuentes, matriz completa con metodo y limite, tres temas con tabla de acuerdos. Sirve para un informe de 30 paginas.
- Nivel titulo: veinte o mas fuentes, diagrama PRISMA con conteos, cuatro temas y seccion de vacios que justifica la propuesta. Sirve para tesis o trabajo de titulo.

## Reglas estrictas

- No cites de memoria. Toda cita se verifica contra el documento original antes de entregarla.
- No hagas resumen autor por autor sin sintesis tematica. La lista de resumenes no es una revision de literatura.
- No ocultes el limite que declara el propio autor. Si el paper dice que su muestra es pequena, lo incluyes en la matriz.
- No uses formato de cita inventado. La lista final sigue APA 7 con autor, ano, titulo, fuente y URL o DOI.
- No declares que la literatura respalda tu propuesta si solo hay vacio. El vacio justifica, no respalda.

## Checklist aplicable

- [ ] Proposito teorico escrito con pregunta y exclusiones claras.
- [ ] Criterios de inclusion y exclusion registrados por escrito.
- [ ] Busqueda en al menos dos bases con consultas y filtros documentados.
- [ ] Conteo PRISMA con encontrados, descartados y motivo de descarte.
- [ ] Matriz de evidencia con autor, ano, metodo, muestra, hallazgo y limite.
- [ ] Sintesis organizada por temas con acuerdos, contradicciones y vacios.
- [ ] Cada parrafo teorico con cita de autor y ano.
- [ ] Lista de referencias en APA 7 con URL o DOI verificado.

## Output Contract

Entrega siempre en este orden:

```markdown
1. Proposito y criterios de inclusion y exclusion.
2. Diagrama o conteo PRISMA con numeros reales.
3. Matriz de evidencia: codigo E1-En, autor, ano, metodo, muestra, hallazgo, limite.
4. Sintesis por temas con citas en cada parrafo.
5. Tabla de acuerdos, contradicciones y vacios.
6. Referencias en APA 7 ordenadas alfabeticamente.
```

Formato de fila de matriz:

```markdown
E1: Fernandez (2022) | Metodo: cuantitativo, n=120 | Hallazgo: prima 7,0% | Limite: solo empresas urbanas.
```

## Referencias oficiales

- Guia oficial APA 7: https://apastyle.apa.org
- Norma APA 7 version INACAP: https://digital.inacap.cl/documentos/biblioteca/Norma_APA_7ma_ed_v2.pdf
- Google Scholar: https://scholar.google.com
- PRISMA para revisiones sistematicas: https://www.prisma-statement.org
