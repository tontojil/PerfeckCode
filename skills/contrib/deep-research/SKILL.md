---
name: deep-research
description: Investiga un tema en profundidad con preguntas definidas, fuentes primarias verificadas y limites declarados. Usala cuando necesites evidencia solida antes de redactar. (investigacion, fuentes, evidencia)
---

# Deep Research

Investiga un tema con rigor antes de escribir conclusiones. El objetivo es responder una pregunta concreta con fuentes primarias verificables y con los limites declarados de forma explicita.

Esta skill complementa a informe-maestro sin duplicarla. Esta skill produce el insumo verificado. Informe-maestro produce el documento final con formato y densidad. Tambien complementa a redactor-tecnico porque entrega evidencia citada que luego se redacta, y a finanzas porque verifica supuestos de mercado antes de modelar numeros.

## Core Rule

Ninguna afirmacion factual entra al informe sin una fuente primaria verificada el dia de entrega y sin un limite declarado cuando la evidencia no permite generalizar.

## Cuándo usar

- Necesitas responder una pregunta de investigacion antes de redactar un capitulo.
- Tienes fuentes secundarias pero te faltan la norma, el dato oficial o el estudio original.
- El usuario pide "investiga", "busca evidencia" o "verifica este dato".
- Vas a alimentar a informe-maestro con el paso de investigacion y quieres trazabilidad completa.

## Process

1. Define la pregunta central en una oracion y tres subpreguntas que la descomponen. Escribe tambien lo que queda fuera del alcance.
2. Registra el punto de partida. Anota lo que ya sabes, lo que supones y lo que necesitas verificar con una fuente externa.
3. Disena la busqueda. Planifica un minimo de tres consultas distintas con terminos diferentes y con criterios de inclusion y exclusion.
4. Recolecta fuentes primarias. Prioriza en este orden: norma oficial, dato oficial, estudio academico, documentacion tecnica del fabricante, y solo al final prensa o blogs.
5. Verifica cada fuente el dia de entrega. Abre cada URL, confirma que el contenido respalda la cita y registra la fecha de recuperacion.
6. Clasifica la evidencia por fuerza. Marca cada hallazgo como confirmado, parcial o supuesto pendiente de validacion con codigo S01.
7. Declara los limites. Escribe que no se pudo verificar, con que muestra se trabajo y que no se puede generalizar.
8. Entrega el paquete de evidencia segun el Output Contract de esta skill.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```markdown
<!-- Resumen sin trazabilidad -->
El mercado de pagos digitales en Chile crece muy rapido.
Fuente: varios articulos de internet.
```

Problema: no hay pregunta definida, no hay fuente primaria, no hay fecha de recuperacion y la afirmacion no se puede verificar.

Ejemplo correcto:

```markdown
<!-- Hallazgo trazable con fuente primaria -->
Pregunta: "Cual fue el volumen de pagos digitales en Chile en 2025".
Hallazgo H1: El informe estadistico del Banco Central reporta X operaciones.
Fuente: F1 Banco Central de Chile (2026), URL verificada el 26 de octubre de 2026.
Limite L1: La cifra cubre solo operaciones reportadas y no incluye efectivo.
Estado: Confirmado.
```

Explicacion: la pregunta es concreta, la fuente es primaria, la fecha de verificacion existe y el limite queda declarado.

## Niveles de aplicación

- Nivel rapido: una pregunta, tres fuentes primarias, un limite declarado. Sirve para verificar un dato puntual en menos de una hora.
- Nivel estandar: pregunta central mas tres subpreguntas, cinco fuentes con al menos una norma y un dato oficial, matriz de hallazgos completa. Sirve para un capitulo de informe.
- Nivel exhaustivo: multiples preguntas, diez o mas fuentes, tabla de contradicciones entre fuentes y registro de busquedas descartadas. Sirve para tesis o titulo.

## Reglas estrictas

- No cites una URL que no abriste el dia de entrega. Si la URL no abre, la eliminas del informe.
- No presentes un supuesto como resultado. Todo supuesto lleva codigo S01 y frase de validacion pendiente.
- No uses solo prensa para un dato que tiene fuente oficial. La prensa orienta, la fuente oficial acredita.
- No ocultes contradicciones. Si dos fuentes primarias discrepan, las reportas en una tabla y explicas cual usas.
- No reutilices una investigacion vieja sin revalidar. Las cifras y las normas cambian cada ano.

## Checklist aplicable

- [ ] Pregunta central escrita en una oracion con alcance y exclusiones.
- [ ] Minimo tres consultas distintas registradas con terminos usados.
- [ ] Minimo cinco fuentes con al menos una norma, un dato oficial y un estudio.
- [ ] Cada fuente abierta y verificada el dia de entrega con fecha de recuperacion.
- [ ] Cada hallazgo clasificado como confirmado, parcial o supuesto S01.
- [ ] Tabla de contradicciones incluida cuando las fuentes discrepan.
- [ ] Seccion de limites declarados con muestra, cobertura y restricciones.
- [ ] Paquete entregado segun el Output Contract sin afirmaciones sin fuente.

## Output Contract

Entrega siempre en este orden:

```markdown
1. Pregunta central y subpreguntas.
2. Tabla de hallazgos: codigo H1-Hn, afirmacion, fuente F1-Fn, fecha de recuperacion, estado.
3. Tabla de fuentes: codigo, autor, ano, titulo, URL, fecha de verificacion.
4. Tabla de contradicciones cuando aplica.
5. Limites declarados en bullets completos.
6. Pendientes de validacion con codigo S01.
```

Formato de linea de hallazgo:

```markdown
H1: [Confirmado] Descripcion del hallazgo. Fuente F1, recuperado el 26 de octubre de 2026.
```

## Referencias oficiales

- Banco Central de Chile, base estadistica: https://www.bcentral.cl
- Biblioteca del Congreso Nacional, Ley Chile: https://www.bcn.cl/leychile
- Guia APA 7 para citas: https://apastyle.apa.org
- Google Scholar para literatura academica: https://scholar.google.com
