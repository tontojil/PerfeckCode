---
name: incident-commander
description: "Coordina la respuesta a incidentes de producción con severidad clara, roles definidos y postmortem sin culpa. Úsalo cuando hay una caída, degradación o error crítico en producción. (incidentes, severidad, roles, postmortem)"
---

# Incident Commander

Coordina la respuesta a incidentes de producción con orden y calma. El objetivo es restaurar el servicio lo antes posible, comunicar con claridad y aprender del incidente sin buscar culpables.

## Core Rule

**Una sola persona comanda el incidente, el servicio se restaura antes de buscar la causa raíz y ningún postmortem asigna culpa a personas.**

## When to Use (Cuándo usar)

- El servicio está caído o degradado en producción.
- Las alertas indican error masivo, latencia alta o pérdida de datos.
- El usuario pide "se cayó producción", "hay un incidente" o "coordina la respuesta".
- Después del incidente, cuando se pide el postmortem o la revisión.
- En simulacros de incidentes o ejercicios de preparación.

## Process

1. Declara el incidente con severidad inicial y nombra a la persona que comanda.
2. Reúne a los roles mínimos en un canal único y congela cambios no relacionados.
3. Estabiliza el servicio con mitigación rápida y registra cada acción con hora.
4. Declara la resolución cuando las métricas vuelven a rango normal durante 15 minutos.
5. Convoca el postmortem dentro de 48 horas y publica las acciones correctivas.
6. Da seguimiento a las acciones hasta cerrarlas con responsable y fecha.

### Tabla de severidad

| Severidad | Criterio | Tiempo de respuesta | Comunicación |
|---|---|---|---|
| SEV1 | Caída total o pérdida de datos | Inmediata, todo el equipo | Cada 15 minutos a dirección y clientes |
| SEV2 | Degradación grave de función principal | 30 minutos | Cada 30 minutos a partes interesadas |
| SEV3 | Falla parcial con alternativa disponible | 4 horas | Diaria en el canal del equipo |
| SEV4 | Problema menor sin impacto a usuarios | Próximo día hábil | Resumen al cierre |

### Roles del incidente

- Comandante: decide prioridades, asigna tareas y declara el cierre.
- Comunicaciones: redacta actualizaciones y atiende a partes interesadas.
- Operaciones: ejecuta la mitigación y registra los cambios aplicados.
- Observador: toma notas con marcas de tiempo para el postmortem.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente (texto de actualización durante el incidente):

```text
# Actualización confusa, sin severidad ni responsable
Creo que se cayó algo, estamos viendo qué pasa, quizás fue el deploy de alguien.
```

Problema: no declara severidad, no nombra comandante y sugiere culpa antes de mitigar.

Ejemplo correcto:

```text
# Actualización clara con severidad y comando definido
[SEV1] Caída de pagos desde 14:02 UTC. Comanda: Ana Ruiz.
Mitigación: reversión del deploy 3421 en curso. Próxima actualización: 14:15 UTC.
Canal único: #inc-2026-1026-pagos.
```

Este formato funciona porque declara la severidad, nombra al comandante, describe la mitigación y fija la próxima actualización.

## Niveles de aplicación

- Nivel básico: incidentes SEV3 y SEV4 con un comandante y un canal de coordinación.
- Nivel intermedio: incidentes SEV2 con los cuatro roles activos y actualizaciones cada 30 minutos.
- Nivel avanzado: incidentes SEV1 con puente permanente, comunicación a clientes y postmortem con acciones que cambian el sistema.

## Reglas estrictas

- Nunca asignes culpa a personas en el canal del incidente ni en el postmortem.
- Nunca apliques cambios sin registrar qué se cambió, quién lo hizo y a qué hora.
- Nunca declares el incidente resuelto sin 15 minutos de métricas estables.
- Nunca omitas la comunicación prometida, aunque no haya avances nuevos.
- Nunca inicies la búsqueda de causa raíz antes de aplicar la mitigación.

## Checklist aplicable

- [ ] Severidad declarada según la tabla y comandante nombrado por escrito.
- [ ] Canal único creado y cambios no relacionados congelados.
- [ ] Mitigación aplicada y registrada con hora, autor y comando exacto.
- [ ] Actualizaciones enviadas según la frecuencia de la severidad.
- [ ] Resolución verificada con 15 minutos de métricas en rango normal.
- [ ] Postmortem agendado dentro de 48 horas con cronología completa.
- [ ] Acciones correctivas con responsable, fecha y seguimiento hasta el cierre.

## Output Contract

Entrega el reporte en este orden y con oraciones completas:

- **Resumen**: qué pasó, impacto en usuarios y duración total.
- **Cronología**: lista con hora UTC, evento y responsable de cada acción.
- **Causa raíz**: explicación técnica verificada con evidencia de registros o métricas.
- **Mitigación**: qué restauró el servicio y a qué hora se confirmó.
- **Acciones correctivas**: tabla con acción, responsable, fecha límite y prioridad.
- **Estado final**: `RESUELTO` o `SEGUIMIENTO ABIERTO` con enlace al tablero de acciones.

## Referencias oficiales

1. Google SRE Book, capítulo de gestión de incidentes: https://sre.google/sre-book/managing-incidents/
2. PagerDuty Incident Response Guide: https://response.pagerduty.com/
3. Atlassian Incident Management Handbook: https://www.atlassian.com/incident-management
4. NIST SP 800-61, guía de manejo de incidentes de seguridad: https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final
