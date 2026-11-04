---
name: rag-architect
description: "Disena pipelines RAG con chunking medido y evaluacion de retrieval. Usalo para asistentes sobre docs, busqueda semantica y grounding con citas. (rag, retrieval, chunking, evaluation)"
---

# RAG Architect

## Core Rule

Ninguna respuesta con recuperacion se entrega sin citas a fragmentos recuperados. Todo numero de calidad (recall, precision, faithfulness) se mide con un set de evaluacion fijo antes de cambiar el chunking o el modelo. Esta regla evita alucinaciones disfrazadas de busqueda.

## Cuándo usar

- El usuario pide un asistente que responda sobre sus documentos.
- La busqueda por palabras clave no encuentra contenido parafraseado.
- El usuario pide "RAG", "retrieval", "chunking" o "grounding".
- Un prototipo responde bien en demo pero falla con documentos reales.

## Process

1. Define el contrato de respuesta: idioma, formato de cita `[archivo:pagina:fragmento]`, que hacer cuando no hay evidencia y longitud maxima. Sin este contrato no se elige el pipeline.
2. Inventaria el corpus: formatos, volumen, idioma, frecuencia de actualizacion y restricciones de privacidad. Marca que documentos no pueden salir del entorno local.
3. Disena la ingestion: extraccion de texto, limpieza, division en chunks con tamano y solapamiento explicitos, y metadatos obligatorios (`fuente`, `fecha`, `pagina`, `seccion`).
4. Elige retrieval en dos etapas: primero busqueda hibrida (densa mas BM25) con `top_k` amplio, luego re ranking a `top_n` pequeno para el prompt. Registra el modelo de embeddings con su dimension.
5. Implementa grounding: el prompt solo puede usar los fragmentos entregados, cada afirmacion factual lleva cita y si el score maximo es bajo se responde `No hay evidencia suficiente`.
6. Construye el set de evaluacion con al menos 30 pares pregunta respuesta, con preguntas literales, parafraseadas y sin respuesta. Mide recall@k, precision@k y faithfulness antes y despues de cada cambio.
7. Itera una variable por vez: tamano de chunk, solapamiento, `top_k` o modelo. Publica solo si faithfulness no baja y recall@k mejora o se mantiene.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```python
# Divide por caracteres fijos, sin metadatos ni citas.
texto = open("manual.pdf", errors="ignore").read()
chunks = [texto[i:i+1000] for i in range(0, len(texto), 1000)]
respuesta = llm("Responde: " + pregunta + " " + chunks[0])
```

Problema: rompe tablas y frases, pierde la fuente y permite que el modelo invente sin citas.

Ejemplo correcto:

```python
# Ingestion con chunks solapados y metadatos para citar.
def dividir_en_chunks(parrafos, tamano=800, solape=120):
    # Acumula parrafos hasta llegar al tamano objetivo.
    chunks = []
    actual = ""
    for parrafo in parrafos:
        if len(actual) + len(parrafo) > tamano and actual:
            # Guarda el chunk con su fuente para citar despues.
            chunks.append({"texto": actual, "fuente": "manual.pdf"})
            # Conserva el solape para no cortar el contexto.
            actual = actual[-solape:]
        actual += "\n" + parrafo
    if actual.strip():
        chunks.append({"texto": actual, "fuente": "manual.pdf"})
    return chunks

# Prompt con grounding estricto y respuesta de rechazo.
plantilla = "Responde solo con los fragmentos. Cita [fuente]. Si no hay evidencia, di: No hay evidencia suficiente."
```

## Niveles de aplicación

- Nivel 1, prototipo: ingestion simple, `top_k=5` sin re ranking y 10 preguntas de prueba. Sirve para validar que el corpus responde.
- Nivel 2, produccion basica: busqueda hibrida, re ranking, citas obligatorias y set de 30 preguntas con recall@k y faithfulness. Requiere metadatos completos.
- Nivel 3, critico: particion por permisos, PII redactado, evaluacion continua y reindexado incremental. Se usa con datos sensibles o regulados.

## Reglas estrictas

- Nunca indexes secretos, tokens ni PII sin redaccion. Filtra antes de dividir en chunks.
- Nunca cambies dos variables del pipeline al mismo tiempo. Un cambio por experimento con metrica antes y despues.
- Nunca entregues una afirmacion factual sin cita al fragmento exacto.
- Nunca uses un modelo de embeddings sin registrar nombre, dimension y version.
- Siempre incluye preguntas sin respuesta en el set de evaluacion para medir rechazos correctos.

## Checklist aplicable

- [ ] Contrato de respuesta con formato de cita y frase de rechazo definido.
- [ ] Corpus inventariado con volumen, idioma y restricciones de privacidad.
- [ ] Tamano de chunk, solapamiento y metadatos documentados.
- [ ] Modelo de embeddings registrado con dimension y version.
- [ ] Retrieval en dos etapas con `top_k` y `top_n` explicitos.
- [ ] Prompt con grounding estricto y citas obligatorias.
- [ ] Set de evaluacion con 30 pares y tres tipos de pregunta.
- [ ] Metricas recall@k, precision@k y faithfulness medidas antes y despues.

## Output Contract

Entrega siempre en este orden:

1. Diagrama o lista del pipeline `ingestion -> index -> retrieval -> re rank -> generacion`.
2. Tabla de configuracion `parametro | valor | justificacion`.
3. Tabla de metricas `metrica | antes | despues | delta`.
4. Tres ejemplos trazables `pregunta | citas | respuesta | veredicto`.

Ejemplo de salida valida:

```
Pipeline: limpieza -> chunks 800/120 -> hibrido top_k 20 -> re rank top_n 5 -> citas.
Config: embeddings text-embedding-3-small 1536, justificado por costo y calidad.
Metricas: recall@5 0.71 a 0.83, faithfulness 0.88 a 0.91.
Ejemplos: 3 de 3 con citas validas, 1 rechazo correcto en pregunta sin evidencia.
```

## Referencias oficiales

- Articulo original Retrieval-Augmented Generation: https://arxiv.org/abs/2005.11401
- Documentacion de LlamaIndex sobre RAG: https://docs.llamaindex.ai/
- Documentacion de LangChain sobre retrieval: https://python.langchain.com/docs/
- Guia de Pinecone sobre RAG: https://www.pinecone.io/learn/retrieval-augmented-generation/
- Guia de OpenAI sobre embeddings: https://platform.openai.com/docs/guides/embeddings
