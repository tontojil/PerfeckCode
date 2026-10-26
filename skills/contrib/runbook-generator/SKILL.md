---
name: runbook-generator
description: "Genera runbooks operativos desde el codigo real, con comandos exactos y criterios de escalado. Usalo para incidentes, guardias y tareas repetidas en produccion. (runbook, operations, incident, sre)"
---

# Runbook Generator

## Core Rule

Todo runbook describe una sola falla o tarea, con comandos copiables y criterios numericos de exito y escalado. Si un paso no se puede copiar y pegar, el runbook esta incompleto. Esta regla reduce el tiempo de respuesta en guardia.

## Cuándo usar

- Se repite un incidente y el equipo necesita pasos escritos.
- El usuario pide "runbook", "playbook operativo" o "guia de guardia".
- Se va a entregar un servicio a operacion y falta su manual.
- Una tarea manual se ejecuta cada semana y se quiere estandarizar.

## Process

1. Define el alcance en una frase: servicio afectado, sintoma observable y entorno (por ejemplo `API de pagos, latencia p95 mayor a 800 ms, produccion`).
2. Lee el codigo y la infraestructura real: health checks, logs, metricas, flags y scripts de deploy. Copia rutas y comandos exactos, con sus flags.
3. Escribe el encabezado fijo: proposito, dueno, severidad, horario de aplicacion, riesgos y tiempo estimado. Sin este encabezado no se publica el runbook.
4. Redacta diagnostico en orden de barato a caro: panel, log, health endpoint, base de datos y traza. Cada paso lleva comando, salida esperada y decision `si ves X, haz Y`.
5. Redacta mitigacion con pasos reversibles primero y pasos destructivos al final, cada uno con comando de verificacion y comando de rollback.
6. Define criterios de escalado con numeros: `si p95 no baja de 500 ms en 15 min, escala a SRE` o `si hay mas de 5 errores 5xx por minuto por 10 min, declara incidente mayor`.
7. Agrega apendice: enlaces a paneles, comandos de limpieza, notas post incidente y fecha de ultima verificacion. Marca los comandos probados en staging contra los solo leidos.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```markdown
## Caida de la API

1. Revisar los logs.
2. Reiniciar el servicio si sigue mal.
3. Avisar a alguien si no funciona.
```

Problema: no dice que comando usar, que salida esperar ni cuando escalar. No sirve en una guardia real.

Ejemplo correcto:

```markdown
## API de pagos, p95 mayor a 800 ms

Dueno: equipo pagos. Severidad: alta. Tiempo estimado: 30 min.

### 1. Diagnostico

curl -s http://localhost:8080/health | jq .
# Salida esperada: {"status": "ok", "db": "up"}
# Si db es down, ir a mitigacion paso 2.

kubectl logs -l app=pagos --tail=200 --since=15m
# Buscar: "timeout" o "connection refused".
```

```bash
# Verifica la salud del servicio con salida estructurada.
curl -s http://localhost:8080/health | jq .

# Muestra los ultimos errores del despliegue de pagos.
kubectl logs -l app=pagos --tail=200 --since=15m | grep -i "error"

# Mide la latencia p95 real antes de mitigar.
kubectl top pods -l app=pagos
```

## Niveles de aplicación

- Nivel 1, nota rapida: una pagina con sintoma, dos comandos de diagnostico y un contacto de escalado. Sirve para tareas simples y reversibles.
- Nivel 2, runbook estandar: diagnostico completo, mitigacion con rollback y criterios numericos de escalado. Requiere comandos verificados en staging.
- Nivel 3, runbook critico: incluye simulacro (game day), permisos exactos, ventana de mantenimiento y plan de comunicacion a clientes. Se revisa cada trimestre.

## Reglas estrictas

- Nunca uses `latest`, rutas relativas ambiguas ni comandos sin flags. Cada comando debe ser copiable tal cual.
- Nunca pongas un paso destructivo (borrar datos, reiniciar base, escalar a cero) sin su comando de verificacion previa y su rollback.
- Nunca publiques un runbook sin dueno, severidad y criterios numericos de escalado.
- Nunca incluyas secretos en el runbook. Usa referencias al vault con el nombre exacto de la variable.
- Siempre marca cada comando como `probado en staging` o `solo leido del codigo`.

## Checklist aplicable

- [ ] Alcance definido con servicio, sintoma y entorno.
- [ ] Cada paso tiene comando exacto con flags y directorio de ejecucion.
- [ ] Cada paso tiene salida esperada y decision `si ves X, haz Y`.
- [ ] Mitigacion ordenada de reversible a destructiva, con rollback.
- [ ] Criterios de escalado con numeros de metrica, ventana de tiempo y contacto.
- [ ] Enlaces a paneles, logs y trazas verificados y vigentes.
- [ ] Fecha de ultima verificacion y proxima revision anotadas.
- [ ] Simulacro o prueba en staging registrada cuando el nivel lo exige.

## Output Contract

Entrega siempre en este orden:

1. Runbook en Markdown con encabezado, diagnostico, mitigacion, escalado y apendice.
2. Tabla `paso | comando | salida esperada | reversible (si o no) | probado en (staging o no probado)`.
3. Criterios de escalado en una lista numerada con metrica, umbral, ventana y contacto.
4. Nota de riesgos con el paso mas peligroso y su mitigacion.

Ejemplo de salida valida:

```
Runbook: RUNBOOK-pagos-latencia.md, 5 diagnostico + 4 mitigacion.
Tabla: 9 pasos, 7 probados en staging, 2 solo leidos.
Escalado: 1) p95 mayor a 500 ms por 15 min, escalar a SRE de turno.
Riesgo mayor: paso 7 reinicia despliegue, mitigado con rollout undo probado.
```

## Referencias oficiales

- Libro Google SRE sobre respuesta a emergencias: https://sre.google/sre-book/table-of-contents/
- Guia de PagerDuty sobre que es un runbook: https://www.pagerduty.com/resources/learn/what-is-a-runbook/
- Guia de gestion de incidentes de Atlassian: https://www.atlassian.com/incident-management
- Guia de manejo de incidentes del NIST SP 800-61: https://csrc.nist.gov/pubs/sp/800/61/r2/final
