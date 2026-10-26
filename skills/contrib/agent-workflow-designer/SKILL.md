---
name: agent-workflow-designer
description: "Disena flujos de agentes con patrones secuencial, paralelo, router, orquestador y evaluador. Usalo para automatizar tareas complejas con control de costo y calidad. (agents, workflow, orchestration, patterns)"
---

# Agent Workflow Designer

## Core Rule

Todo flujo se descompone en nodos con entrada, salida y criterio de exito medible. Ningun flujo usa un agente autonomo donde alcanza una cadena determinista. Esta regla controla costo, latencia y errores.

## Cuándo usar

- Una tarea tiene mas de tres pasos y se repite con frecuencia.
- El usuario pide "agente", "workflow", "pipeline de agentes" u "orquestacion".
- Un agente unico falla por contexto largo o por mezclar roles.
- Se necesita paralelizar subtareas independientes o enrutar por tipo de entrada.

## Process

1. Define el objetivo en una frase con metrica: `clasificar 200 tickets por dia con precision mayor a 0.85`. Sin metrica no se elige el patron.
2. Descompón la tarea en nodos pequenos con contrato `entrada | transformacion | salida | exito`. Marca dependencias reales y detecta nodos independientes.
3. Elige el patron minimo que resuelve el caso: secuencial para cadenas fijas, paralelo para independientes, router para clasificacion, orquestador para reparto dinamico, evaluador para generacion con verificacion.
4. Disena el control de errores por nodo: reintentos con limite, fallback determinista y escalado a humano. Cada nodo critico lleva timeout y presupuesto de tokens.
5. Define el estado compartido: que datos viajan entre nodos, donde se guardan y cuanto tiempo viven. Evita pasar el historial completo cuando alcanza un resumen.
6. Implementa observabilidad: log por nodo con entrada, salida, duracion y costo. Agrega un modo `dry-run` que muestra el plan sin ejecutar acciones.
7. Evalua con 20 casos reales antes de publicar: mide tasa de exito, costo por ejecucion y latencia p95. Publica solo si supera el umbral definido en el paso 1.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```python
# Un solo agente hace todo sin contratos ni control de errores.
respuesta = agente("Procesa estos 200 tickets, clasifica, responde y cierra los faciles")
```

Problema: mezcla clasificacion con accion, no mide calidad y un error contamina todo el lote sin trazabilidad.

Ejemplo correcto:

```python
# Flujo router mas trabajadores paralelos con contratos claros.
def flujo_tickets(lote):
    # Paso 1: el router clasifica cada ticket en una categoria fija.
    rutas = router_clasificar(lote)  # devuelve: soporte, ventas, reclamo
    # Paso 2: cada categoria se procesa en paralelo con su prompt.
    resultados = ejecutar_en_paralelo([
        lambda: worker_soporte(rutas["soporte"]),
        lambda: worker_ventas(rutas["ventas"]),
    ])
    # Paso 3: el evaluador verifica calidad antes de responder.
    return evaluador_calidad(resultados)  # aprueba o escala a humano
```

```typescript
// Contrato de nodo con criterio de exito explicito.
// Cada nodo recibe solo lo que necesita, no todo el historial.
type Nodo<TIn, TOut> = {
  nombre: string; // nombre corto para los logs
  ejecutar: (entrada: TIn) => Promise<TOut>; // transformacion unica
  exito: (salida: TOut) => boolean; // criterio medible
  reintentos: number; // limite fijo, por ejemplo 2
};
```

## Niveles de aplicación

- Nivel 1, cadena simple: dos o tres nodos secuenciales con contratos escritos y un log basico. Sirve para resúmenes o clasificacion unica.
- Nivel 2, paralelo con evaluador: router que reparte, workers en paralelo y evaluador que aprueba o escala. Requiere set de 20 casos y metricas de costo.
- Nivel 3, orquestado: orquestador dinamico con estado persistente, presupuesto por ejecucion y tableros de monitoreo. Se usa para volumen alto o acciones con riesgo.

## Reglas estrictas

- Nunca des a un worker permiso de escritura si solo necesita lectura. El menor permiso gana.
- Nunca permitas bucles sin limite. Todo ciclo lleva maximo de iteraciones y condicion de salida.
- Nunca ejecutes acciones irreversibles (enviar, cobrar, borrar) sin aprobacion del evaluador o del humano.
- Nunca pases secretos ni PII a un nodo que no los necesita. Filtra el estado compartido por nodo.
- Siempre registra costo y duracion por nodo. Sin estos datos no se optimiza el flujo.

## Checklist aplicable

- [ ] Objetivo con metrica numerica y umbral de exito definido.
- [ ] Nodos con contrato `entrada | salida | exito` y dependencias marcadas.
- [ ] Patron elegido con justificacion de por que es el minimo viable.
- [ ] Reintentos, timeouts y fallback definidos por nodo.
- [ ] Estado compartido acotado sin historial completo innecesario.
- [ ] Log por nodo con duracion y costo, mas modo `dry-run`.
- [ ] Evaluacion con 20 casos reales y tres metricas medidas.
- [ ] Puerta humana para acciones irreversibles documentada.

## Output Contract

Entrega siempre en este orden:

1. Diagrama textual `entrada -> nodo -> decision -> salida` con el patron nombrado.
2. Tabla de nodos `nodo | entrada | salida | exito | reintentos | costo estimado`.
3. Tabla de evaluacion `metrica | umbral | medido | veredicto`.
4. Riesgos y limites: maximo de iteraciones, presupuesto y puerta humana.

Ejemplo de salida valida:

```
Patron: router mas 2 workers en paralelo mas evaluador.
Nodos: 4 nodos, costo estimado 0.08 USD por lote de 20 tickets.
Evaluacion: exito 0.90 sobre umbral 0.85, p95 42 s, veredicto publicar.
Limites: 2 reintentos, presupuesto 0.15 USD, humano aprueba cierres.
```

## Referencias oficiales

- Guia de Anthropic sobre agentes efectivos: https://www.anthropic.com/engineering/building-effective-agents
- Guia de agentes de OpenAI: https://platform.openai.com/docs/guides/agents
- Documentacion de LangGraph para orquestacion: https://langchain-ai.github.io/langgraph/
- Documentacion de AutoGen de Microsoft: https://microsoft.github.io/autogen/
