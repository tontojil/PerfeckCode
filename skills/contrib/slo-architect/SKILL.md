---
name: slo-architect
description: "Diseña SLI, SLO y error budget con alertas por burn rate. Úsalo para definir objetivos de confiabilidad, configurar alertas útiles o revisar SLO existentes. (SLI, SLO, error budget, burn rate)"
---

# SLO Architect

Diseña objetivos de confiabilidad que el equipo puede medir y defender. El objetivo es alinear expectativas de disponibilidad con un presupuesto de error explícito y con alertas que avisan antes de incumplir el objetivo.

## Core Rule

**Todo SLO se mide con un SLI cuantificable, tiene un error budget explícito y solo genera alertas accionables basadas en burn rate.**

## When to Use (Cuándo usar)

- El equipo necesita definir SLI y SLO para un servicio nuevo.
- Las alertas actuales generan ruido y no reflejan impacto al usuario.
- El usuario pide "define el SLO", "configura el error budget" o "arregla las alertas".
- Antes de firmar un SLA con clientes o antes de un lanzamiento importante.
- En la revisión trimestral de confiabilidad del servicio.

## Process

1. Identifica el recorrido crítico del usuario y elige el SLI que lo representa.
2. Define el SLO como porcentaje sobre una ventana móvil de 30 días.
3. Calcula el error budget en minutos permitidos y define la política de gasto.
4. Configura alertas de burn rate rápido y lento con severidad distinta.
5. Documenta el SLO, el tablero y el procedimiento de respuesta.
6. Revisa el cumplimiento cada mes y ajusta el objetivo con datos reales.

### Fórmulas base

```text
# Cálculo de error budget para un SLO mensual
SLO 99,9 % sobre 30 días = 43,2 minutos de error budget.
SLO 99,95 % sobre 30 días = 21,6 minutos de error budget.
SLO 99,99 % sobre 30 días = 4,3 minutos de error budget.
```

### Alertas por burn rate

| Alerta | Ventana | Condición | Severidad |
|---|---|---|---|
| Rápida | 1 hora | Consume 10 % del budget en 1 hora | Página inmediata |
| Lenta | 6 horas | Consume 10 % del budget en 6 horas | Ticket para el día |
| Agotamiento | 3 días | Proyección de incumplimiento del SLO | Revisión con el equipo |

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente (SLO sin medición):

```yaml
# slo-deficiente.yaml
# Objetivo vago, sin SLI ni ventana de medición
objetivo: "el servicio debe estar rápido y disponible"
```

Problema: no define qué se mide, no fija porcentaje y no permite calcular el error budget.

Ejemplo correcto:

```yaml
# slo-correcto.yaml
# SLO medible con SLI, ventana y política de error budget
api:
  sli: "proporción de respuestas HTTP 2xx en /pagos menor a 500 ms"
  slo: 99.9
  ventana: "30d"
  error_budget_minutos: 43.2
  politica: "si el budget baja de 20 %, se congelan lanzamientos no críticos"
```

Este formato funciona porque el SLI es medible, el SLO tiene ventana y el error budget activa una política concreta.

## Niveles de aplicación

- Nivel básico: un SLO de disponibilidad por servicio con ventana de 30 días.
- Nivel intermedio: SLO de disponibilidad más SLO de latencia con alertas de burn rate rápido y lento.
- Nivel avanzado: SLO por recorrido de usuario, con revisión mensual y congelamiento de lanzamientos según gasto del budget.

## Reglas estrictas

- Nunca definas un SLO sin SLI medible, ventana de tiempo y fuente de datos.
- Nunca crees alertas sin umbral de burn rate, el umbral fijo sobre errores totales genera ruido.
- Nunca prometas un SLO más alto que el eslabón más débil de la dependencia crítica.
- Nunca ignores un error budget agotado, el gasto total exige congelar cambios riesgosos.
- Nunca uses promedios simples para latencia, usa percentiles p95 o p99.

## Checklist aplicable

- [ ] SLI definido como proporción o percentil medible desde el punto de vista del usuario.
- [ ] SLO expresado en porcentaje con ventana móvil de 30 días.
- [ ] Error budget calculado en minutos y política de gasto documentada.
- [ ] Alerta rápida y alerta lenta configuradas con burn rate y severidad distinta.
- [ ] Tablero con SLI actual, budget restante y proyección de cumplimiento.
- [ ] Procedimiento de respuesta enlazado a cada alerta con responsable claro.
- [ ] Revisión mensual agendada con registro de decisiones y ajustes.

## Output Contract

Entrega la propuesta en este orden y con oraciones completas:

- **SLI**: definición exacta, consulta de medición y fuente de datos.
- **SLO**: porcentaje, ventana y justificación del valor elegido.
- **Error budget**: cálculo en minutos y política cuando el budget baja.
- **Alertas**: tabla con ventana, condición, severidad y procedimiento enlazado.
- **Tablero**: métricas incluidas y enlace al panel de seguimiento.
- **Estado final**: `APROBADO` o `REQUIERE AJUSTE` con la lista de puntos pendientes.

## Referencias oficiales

1. Google SRE Workbook, capítulo de SLI y SLO: https://sre.google/workbook/implementing-slos/
2. Google SRE Book, capítulo de alertas por burn rate: https://sre.google/sre-book/alerting-on-slos/
3. Especificación OpenSLO: https://openslo.com/
4. Documentación de alertas de Prometheus: https://prometheus.io/docs/alerting/latest/alertmanager/
