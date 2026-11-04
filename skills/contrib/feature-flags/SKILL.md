---
name: feature-flags
description: "Gestiona feature flags por entorno con rollout progresivo y kill switch. Úsalo para lanzar funciones con riesgo controlado, revertir sin deploy o separar deploy de release. (flags, rollout, kill switch)"
---

# Feature Flags

Controla el lanzamiento de funciones con interruptores explícitos por entorno. El objetivo es separar el despliegue del código de la liberación a usuarios y revertir una función sin hacer un deploy nuevo.

## Core Rule

**Toda función riesgosa sale detrás de un flag con dueño, fecha de expiración y un kill switch que revierte en menos de un minuto.**

## When to Use (Cuándo usar)

- Una función nueva tiene riesgo y necesita rollout progresivo.
- El usuario pide "lanza esto por porcentaje", "agrega un kill switch" o "separa deploy de release".
- Un incidente exige desactivar una función sin hacer rollback del deploy.
- El equipo mantiene flags antiguos que ya cumplieron su propósito.
- Antes de un experimento A/B o de una migración de comportamiento.

## Process

1. Define el flag con nombre, tipo, entorno y porcentaje inicial en cero.
2. Implementa el flag con valor por defecto seguro cuando el proveedor falla.
3. Lanza por etapas con criterios de avance y de reversión por etapa.
4. Monitorea errores y métricas de negocio durante cada etapa del rollout.
5. Retira el flag cuando llega al 100 % y completa la limpieza del código.
6. Audita los flags activos cada mes y elimina los vencidos o huérfanos.

### Tipos de flags

| Tipo | Propósito | Vida útil |
|---|---|---|
| Release | Liberar una función por porcentaje o segmento | Semanas, se retira al 100 % |
| Kill switch | Desactivar una ruta riesgosa en emergencia | Permanente, siempre evaluado |
| Experimento | Comparar variantes A y B con métricas | Duración del experimento |
| Operativo | Cambiar comportamiento por entorno o carga | Permanente, con dueño claro |

### Etapas de rollout

```text
# Plan de rollout progresivo con criterios de avance
Etapa 1: 1 % interno, 24 h, error rate menor a 0,1 %.
Etapa 2: 10 % beta, 48 h, sin caída de conversión.
Etapa 3: 50 % general, 72 h, p95 estable.
Etapa 4: 100 % general, retira el flag en 14 días.
```

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente (flag sin control):

```typescript
// flags-deficiente.ts
// Sin valor seguro, sin expiración y sin registro del dueño
if (flags.nuevoPago) {
  procesarConNuevoProveedor();
}
```

Problema: si el proveedor de flags falla, el comportamiento es indefinido y nadie sabe quién retira el flag.

Ejemplo correcto:

```typescript
// flags-correcto.ts
// Flag con valor seguro, expiración y dueño registrado
// Dueño: equipo pagos. Expira: 2026-11-30. Tipo: release.
const usarNuevoPago = flags.obtener("pagos.nuevo-proveedor", {
  valorSeguro: false, // si el proveedor falla, usa la ruta anterior
  entorno: "produccion",
});
if (usarNuevoPago) {
  procesarConNuevoProveedor();
} else {
  procesarConProveedorActual();
}
```

Este formato funciona porque define el valor seguro ante fallas, registra dueño y expiración, y mantiene la ruta anterior como respaldo.

## Niveles de aplicación

- Nivel básico: flags booleanos por entorno con valor seguro y kill switch manual.
- Nivel intermedio: rollout por porcentaje con etapas, métricas y criterios de reversión.
- Nivel avanzado: flags con segmentación por usuario, experimentos y auditoría mensual de limpieza.

## Reglas estrictas

- Nunca lances una función riesgosa sin flag, el deploy sin interruptor impide la reversión rápida.
- Nunca dejes un flag sin dueño ni fecha de expiración, todo flag temporal se retira.
- Nunca uses el flag como configuración permanente, si dura más de 90 días conviértelo en configuración.
- Nunca evalúes el flag sin valor por defecto seguro ante falla del proveedor.
- Nunca avances de etapa sin métricas verdes registradas en la etapa anterior.

## Checklist aplicable

- [ ] Flag con nombre único, tipo, entorno y porcentaje inicial documentados.
- [ ] Valor por defecto seguro cuando el proveedor de flags no responde.
- [ ] Kill switch probado que revierte el comportamiento en menos de un minuto.
- [ ] Plan de rollout por etapas con criterios de avance y de reversión.
- [ ] Métricas técnicas y de negocio monitoreadas en cada etapa.
- [ ] Fecha de expiración y responsable de limpieza registrados.
- [ ] Código del flag retirado después del 100 % sin dejar ramas muertas.

## Output Contract

Entrega la propuesta en este orden y con oraciones completas:

- **Flag**: nombre, tipo, entornos, valor seguro y fecha de expiración.
- **Rollout**: tabla con etapa, porcentaje, duración y criterio de avance.
- **Kill switch**: procedimiento exacto de desactivación y tiempo esperado.
- **Métricas**: errores, latencia y métrica de negocio que vigilan cada etapa.
- **Limpieza**: fecha de retiro del flag y responsable de la tarea.
- **Estado final**: `LISTO PARA ROLLOUT` o `BLOQUEADO` con el riesgo que falta mitigar.

## Referencias oficiales

1. Martin Fowler sobre feature toggles: https://martinfowler.com/articles/feature-toggles.html
2. Documentación de OpenFeature: https://openfeature.dev/docs
3. Documentación de Unleash: https://docs.getunleash.io/
4. Documentación de LaunchDarkly sobre flags: https://docs.launchdarkly.com/home/
