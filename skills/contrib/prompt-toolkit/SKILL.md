---
name: prompt-toolkit
description: "Versiona prompts, corre pruebas A/B y mide calidad con metricas. Usalo para estabilizar respuestas, comparar variantes y evitar regresiones. (prompts, versioning, ab-testing, evaluation)"
---

# Prompt Toolkit

## Core Rule

Ningun prompt se edita sin version, sin prueba contra un set fijo y sin metrica antes y despues. Todo cambio declara hipotesis, variante y veredicto. Esta regla evita mejoras aparentes que rompen casos reales.

## Cuándo usar

- Un prompt funciona a veces y falla otras sin causa clara.
- El usuario pide "mejorar este prompt", "versionar prompts" o "prueba A/B".
- Se prepara un cambio de modelo y se teme una regresion.
- El equipo necesita comparar dos redacciones con datos y no con opiniones.

## Process

1. Congela la version actual con nombre `prompt-<tarea>-v<n>` y registra modelo, temperatura y fecha. Esta version es la linea base contra la que compite todo.
2. Define la metrica de exito en numeros: `respuestas validas sobre 50 casos mayor a 0.90` o `rechazos correctos igual a 10 de 10`. Sin metrica no hay experimento.
3. Construye el set de prueba con 30 a 50 casos: tipicos, borde y adversos. Incluye la salida esperada y el criterio de aceptacion por caso.
4. Formula una hipotesis por variante: `si agrego tres ejemplos de formato, entonces los JSON invalidos bajan de 8 a 2`. Cambia una variable por variante.
5. Corre la prueba A/B con el mismo modelo y la misma semilla o temperatura 0: linea base contra variante, caso por caso. Registra costo y latencia por variante.
6. Decide con regla fija: la variante gana solo si supera el umbral y no rompe ningun caso que la base pasaba. Todo empate mantiene la base.
7. Publica la ganadora como nueva version con changelog de una linea y guia de rollback a la version anterior. Archiva las variantes perdedoras con su metrica.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```text
Prompt: Eres un asistente util. Resume este documento bien y rapido.
```

Problema: sin formato de salida, sin longitud, sin idioma y sin ejemplos. Cada ejecucion devuelve algo distinto e imposible de evaluar.

Ejemplo correcto:

```text
Prompt ventas-resumen v3:

Resume el reclamo en espanol en 3 lineas con este formato exacto:
Problema: <una frase>
Pedido: <una frase>
Prioridad: <alta, media o baja>

Si falta el pedido, escribe Pedido: no especificado.
No agregues consejos ni texto fuera del formato.
```

```python
# scripts/evaluar_prompts.py
# Compara la version base contra la variante con el mismo set.
casos = ["reclamo con pedido", "reclamo sin pedido", "reclamo ambiguo"]

def es_valida(salida: str) -> bool:
    # Valida el formato exacto exigido por el prompt.
    lineas = salida.strip().splitlines()
    # Exige 3 lineas que empiecen con las etiquetas pedidas.
    return (
        len(lineas) == 3
        and lineas[0].startswith("Problema:")
        and lineas[1].startswith("Pedido:")
        and lineas[2].startswith("Prioridad:")
    )

# Compara cada caso y cuenta validos por version.
for version in ["v2-base", "v3-variante"]:
    validos = sum(1 for c in casos if es_valida(ejecutar(version, c)))
    print(version + ": " + str(validos) + "/" + str(len(casos)))
```

## Niveles de aplicación

- Nivel 1, ficha estable: un prompt con version, formato de salida fijo y 10 casos de humo. Sirve para tareas internas de bajo riesgo.
- Nivel 2, A/B medido: 30 casos con metrica, comparacion base contra variante y changelog. Requiere temperatura 0 y registro de costo.
- Nivel 3, biblioteca: prompts versionados en repo con CI que corre el set completo en cada cambio y bloquea regresiones. Se usa para prompts de cara al cliente.

## Reglas estrictas

- Nunca cambies dos cosas a la vez en una variante. Una hipotesis por experimento.
- Nunca compares prompts con modelos o temperaturas distintas. La comparacion exige igual modelo e igual temperatura.
- Nunca publiques una variante que rompe un caso que la base pasaba, aunque mejore el promedio.
- Nunca guardes prompts con secretos o PII en los ejemplos. Usa datos ficticios claramente marcados.
- Siempre usa comillas ASCII en los ejemplos y marca el idioma de salida de forma explicita.

## Checklist aplicable

- [ ] Version base congelada con modelo, temperatura y fecha.
- [ ] Metrica de exito con umbral numerico definido antes del experimento.
- [ ] Set de 30 a 50 casos con tipicos, borde y adversos.
- [ ] Hipotesis escrita con cambio esperado en numeros.
- [ ] Corrida A/B con igual modelo, igual temperatura y registro de costo.
- [ ] Tabla caso por caso con regresiones marcadas.
- [ ] Veredicto con regla fija y version ganadora publicada.
- [ ] Rollback documentado a la version anterior en una linea.

## Output Contract

Entrega siempre en este orden:

1. Ficha `prompt | version | modelo | temperatura | fecha`.
2. Tabla A/B `caso | base (pasa o falla) | variante (pasa o falla) | delta`.
3. Metricas `metrica | base | variante | umbral | veredicto`.
4. Prompt ganador completo listo para copiar, mas comando de rollback.

Ejemplo de salida valida:

```
Ficha: ventas-resumen v3, gpt-4o-mini, temp 0, 2026-10-20.
A/B: 30 casos, base 24 de 30, variante 28 de 30, cero regresiones.
Metricas: validos 0.80 a 0.93, umbral 0.90, veredicto publicar v3.
Rollback: volver a v2 con git revert del archivo prompts/ventas-resumen-v2.md.
```

## Referencias oficiales

- Guia de ingenieria de prompts de OpenAI: https://platform.openai.com/docs/guides/prompt-engineering
- Guia de ingenieria de prompts de Anthropic: https://www.anthropic.com/docs/build-with-claude/prompt-engineering/overview
- Mejores practicas de OpenAI para prompts: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
- Guia Prompting Guide: https://www.promptingguide.ai/
- Guia de Azure OpenAI sobre prompts: https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/prompt-engineering
