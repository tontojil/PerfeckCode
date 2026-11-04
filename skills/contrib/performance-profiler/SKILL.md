---
name: performance-profiler
description: "Mide profiling en Node, Python y Go con análisis de bundle y pruebas de carga. Úsalo cuando hay lentitud, alto consumo o regresión de rendimiento. (profiling, bundle, carga, latencia)"
---

# Performance Profiler

Mide el rendimiento con datos antes de optimizar. El objetivo es encontrar el cuello de botella real con profiling, reducir el costo medido y verificar la mejora con la misma prueba repetida.

## Core Rule

**Ninguna optimización se propone sin medición previa, el cuello de botella se demuestra con profiling y la mejora se verifica con la misma carga.**

## When to Use (Cuándo usar)

- La API responde lento o el p95 sube sin causa clara.
- El usuario pide "optimiza esto", "perfilalo" o "está lento en producción".
- El bundle del frontend crece y afecta la carga inicial.
- Una prueba de carga muestra errores, timeouts o saturación.
- Antes de escalar infraestructura para confirmar que no hay desperdicio.

## Process

1. Define la métrica objetivo y captura la línea base con la carga actual.
2. Ejecuta profiling en el stack correspondiente y guarda el reporte.
3. Identifica el cuello de botella con el top de funciones, queries o módulos.
4. Aplica una sola optimización por ciclo y mide de nuevo con la misma prueba.
5. Verifica bundle, memoria y p95 contra la línea base con evidencia.
6. Documenta el cambio, la ganancia y el costo de mantenimiento agregado.

### Comandos por stack

| Stack | Profiling | Carga |
|---|---|---|
| Node.js | `node --prof app.js` y `node --prof-process` | `npx autocannon -c 50 -d 30 http://localhost:3000/api` |
| Python | `python -m cProfile -o perfil.prof app.py` | `locust -f locustfile.py --headless -u 50 -r 5` |
| Go | `go test -bench=. -cpuprofile=cpu.out` y `go tool pprof` | `k6 run carga.js` |
| Frontend | Lighthouse y `npx vite-bundle-visualizer` | Web Vitals en campo con p75 |

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente (optimización sin medición):

```python
# cache-deficiente.py
# Agrega caché sin medir el cuello de botella real
cache = {}

def obtener_reporte(usuario_id):
    if usuario_id not in cache:
        cache[usuario_id] = db.consulta_pesada(usuario_id)  # nunca expira
    return cache[usuario_id]
```

Problema: optimiza sin profiling, la caché nunca expira y puede servir datos obsoletos.

Ejemplo correcto:

```python
# cache-correcto.py
# Optimización con medición previa y expiración explícita
import time

cache = {}  # llave con marca de tiempo para expirar entradas
TTL_SEGUNDOS = 300  # expira a los 5 minutos

def obtener_reporte(usuario_id):
    # Revisa caché solo si la entrada sigue vigente
    entrada = cache.get(usuario_id)
    if entrada and (time.time() - entrada["hora"] < TTL_SEGUNDOS):
        return entrada["datos"]
    datos = db.consulta_pesada(usuario_id)  # cuello de botella confirmado con cProfile
    cache[usuario_id] = {"datos": datos, "hora": time.time()}
    return datos
```

Este formato funciona porque la optimización responde a un cuello de botella medido y la caché tiene expiración explícita.

## Niveles de aplicación

- Nivel básico: medición de línea base con p95, memoria y bundle actual.
- Nivel intermedio: profiling con reporte, una optimización por ciclo y verificación con la misma carga.
- Nivel avanzado: pruebas de carga sostenida, presupuesto de rendimiento en CI y monitoreo continuo de p95.

## Reglas estrictas

- Nunca optimices sin línea base, toda mejora se compara contra la medición inicial.
- Nunca cambies dos cosas a la vez, cada ciclo prueba una sola optimización.
- Nunca uses datos de producción en pruebas de carga sin anonimizar.
- Nunca aceptes una mejora que rompe corrección o que agrega deuda sin registrarla.
- Nunca reportes promedios solos, incluye siempre p95 o p99 y tamaño de muestra.

## Checklist aplicable

- [ ] Métrica objetivo definida con p95, memoria y bundle inicial registrados.
- [ ] Profiling ejecutado con reporte guardado y cuello de botella identificado.
- [ ] Una sola optimización aplicada por ciclo con diff mínimo y reversible.
- [ ] Misma prueba de carga repetida con evidencia de antes y después.
- [ ] Bundle verificado sin crecimiento injustificado en el frontend.
- [ ] Sin regresión funcional, las pruebas del módulo siguen en verde.
- [ ] Ganancia documentada con números, costo y decisión de mantener o revertir.

## Output Contract

Entrega el informe en este orden y con oraciones completas:

- **Línea base**: p95, throughput, memoria y bundle con comando y fecha.
- **Hallazgo**: cuello de botella con función, query o módulo y porcentaje del tiempo.
- **Optimización**: cambio aplicado con diff resumido y justificación.
- **Resultado**: tabla de antes contra después con la misma prueba repetida.
- **Evidencia**: fragmentos de profiling y de carga con exit code y duración.
- **Estado final**: `MEJORADO`, `SIN CAMBIO` o `EMPEORADO` con el próximo paso.

## Referencias oficiales

1. Guía de diagnósticos de Node.js: https://nodejs.org/en/docs/guides/diagnostics
2. Documentación de cProfile en Python: https://docs.python.org/3/library/profile.html
3. Guía de pprof en Go: https://go.dev/blog/pprof
4. Documentación de Web Vitals: https://web.dev/articles/vitals
