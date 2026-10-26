---
name: interview-mapper
description: Codifica entrevistas con categorias, matriz de hallazgos y citas verificadas. Usala cuando trabajes con evidencia cualitativa. (entrevistas, codificacion, cualitativo)
---

# Interview Mapper

Convierte entrevistas en evidencia ordenada y verificable. El objetivo es pasar de transcripciones sueltas a categorias con citas textuales que se pueden rastrear hasta el minuto exacto de la entrevista.

Esta skill complementa a informe-maestro sin duplicarla. Esta skill produce la matriz de codificacion y el libro de citas verificadas. Informe-maestro usa ese insumo en el diagnostico y en los anexos. Tambien complementa a deep-research porque aporta evidencia de campo que las fuentes secundarias no tienen.

## Core Rule

Ninguna cita de entrevista entra al informe sin codigo de categoria, sin identificador de entrevistado y sin verificacion literal contra la transcripcion original.

## Cuándo usar

- Tienes una o mas entrevistas y debes convertirlas en hallazgos para un diagnostico.
- Necesitas comparar lo que dijeron distintos entrevistados sobre el mismo tema.
- El usuario pide "analiza estas entrevistas" o "sistematiza el trabajo de campo".
- Vas a citar frases de entrevistados y quieres evitar citas inventadas o fuera de contexto.

## Process

1. Prepara el corpus. Reune transcripciones completas, registra fecha, duracion, rol del entrevistado y codigo anonimo P1-Pn.
2. Define el esquema inicial de categorias. Parte de tres a cinco categorias derivadas de la pregunta de investigacion.
3. Codifica en dos pasadas. En la primera marcas fragmentos relevantes. En la segunda agrupas, divides o fusionas categorias con justificacion escrita.
4. Construye la matriz de hallazgos. Cruza categorias con entrevistados y marca acuerdo, matiz o desacuerdo con la cita correspondiente.
5. Verifica cada cita palabra por palabra contra la transcripcion. Registra el timestamp o el numero de linea de origen.
6. Anonimiza con criterio. Reemplaza nombres y datos identificables, y deja constancia del procedimiento de anonimato.
7. Declara los limites del trabajo de campo. Indica el numero de entrevistas, el sesgo de seleccion y que los resultados orientan el diseno pero no permiten estimar frecuencias.
8. Entrega el paquete segun el Output Contract de esta skill.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```python
# registro.py
cita = "El sistema es malo"  # atribuido a P1 sin verificar
categoria = "general"
```

Problema: la cita no indica si es textual, no tiene timestamp, la categoria es vaga y no se puede rastrear al origen.

Ejemplo correcto:

```python
# registro.py
# Cita textual verificada contra la transcripcion original
cita = {
    "codigo": "C3-P2",  # categoria 3, entrevistado 2
    "texto": "La agenda se cae cuando hay dos reservas al mismo tiempo.",
    "origen": "P2, linea 48, minuto 12:30",
    "categoria": "C3 fallas de concurrencia",
}
```

Explicacion: la cita es rastreable hasta la linea exacta, tiene categoria especifica y distingue el texto literal del analisis.

## Niveles de aplicación

- Nivel exploratorio: dos a tres entrevistas, cinco categorias maximo, matriz simple. Sirve para orientar un prototipo rapido.
- Nivel estandar: cuatro a ocho entrevistas, libro de categorias con definicion y ejemplo, matriz completa con acuerdos. Sirve para un diagnostico de informe maestro.
- Nivel tesis: nueve o mas entrevistas, doble codificacion con acuerdo entre codificadores, saturacion declarada. Sirve para trabajo de titulo con defensa metodologica.

## Reglas estrictas

- No inventes citas ni completes frases. Si el audio no se entiende, lo marcas como inaudible con el minuto exacto.
- No cites fuera de contexto. Cada cita conserva la condicion que dijo el entrevistado antes y despues.
- No generalices frecuencias desde pocas entrevistas. Tres menciones orientan el diseno, no representan a una region.
- No expongas datos personales. Nombres, rut, direcciones y empleadores se anonimizan antes de entregar.
- No mezcles tu interpretacion con la voz del entrevistado. La cita va entre comillas y tu analisis va en parrafo separado.

## Checklist aplicable

- [ ] Corpus completo con fecha, duracion, rol y codigo P1-Pn por entrevista.
- [ ] Esquema de categorias con definicion operativa y ejemplo por categoria.
- [ ] Doble pasada de codificacion registrada con cambios justificados.
- [ ] Matriz de categorias contra entrevistados con acuerdos y desacuerdos.
- [ ] Cada cita verificada palabra por palabra con linea o timestamp.
- [ ] Anonimato aplicado y procedimiento declarado por escrito.
- [ ] Limites del trabajo de campo con numero de casos y sesgos.
- [ ] Paquete entregado segun el Output Contract con anexos citables.

## Output Contract

Entrega siempre en este orden:

```markdown
1. Ficha del trabajo de campo: n de entrevistas, fechas, roles, duracion total.
2. Libro de categorias: codigo C1-Cn, definicion, ejemplo textual corto.
3. Matriz de hallazgos: categoria contra entrevistado con acuerdo o matiz.
4. Libro de citas verificadas: codigo, texto literal, origen con linea o minuto.
5. Limites declarados y procedimiento de anonimato.
6. Anexo con transcripciones integras o extractos citados.
```

Formato de cita verificada:

```markdown
C3-P2: "La agenda se cae cuando hay dos reservas al mismo tiempo." (P2, linea 48)
```

## Referencias oficiales

- Ley 19.628 sobre proteccion de datos personales: https://www.bcn.cl/leychile
- Guia de codificacion cualitativa de la Universidad de Chile: https://www.uchile.cl
- Manual APA 7 para citas de comunicaciones personales: https://apastyle.apa.org
