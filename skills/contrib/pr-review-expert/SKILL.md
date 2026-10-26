---
name: pr-review-expert
description: "Revisa pull requests con blast radius, cobertura delta y formato path:line: [SEVERIDAD]. Úsalo antes de aprobar un PR, al pedir revisión experta o al definir criterios de merge. (PR, revisión, severidad, cobertura)"
---

# PR Review Expert

Revisa pull requests con criterio de riesgo y evidencia. El objetivo es estimar el impacto del cambio, verificar pruebas y entregar hallazgos accionables en un formato que el autor puede corregir sin ambigüedad.

## Core Rule

**Ningún PR se aprueba sin blast radius estimado, delta de cobertura verificado y cada hallazgo en formato path:line: [SEVERIDAD].**

## When to Use (Cuándo usar)

- Un pull request necesita revisión antes del merge.
- El usuario pide "revisa este PR", "aprueba estos cambios" o "evalúa el riesgo".
- El cambio toca pagos, autenticación, migraciones o API pública.
- Después de una actualización grande del PR que invalida la revisión anterior.
- Al definir la política de aprobación del equipo o los criterios de merge.

## Process

1. Calcula el blast radius con archivos tocados, migraciones y dependencias afectadas.
2. Verifica que la descripción del PR explica el qué, el porqué y el plan de reversión.
3. Ejecuta lint y pruebas, y mide el delta de cobertura sobre el código tocado.
4. Revisa el diff por dimensiones: corrección, seguridad, rendimiento y pruebas.
5. Emite cada hallazgo en formato path:line: [SEVERIDAD] con sugerencia concreta.
6. Cierra con veredicto APROBAR, COMENTAR o BLOQUEAR según la severidad máxima.

### Matriz de blast radius

| Nivel | Señales | Exigencia |
|---|---|---|
| Bajo | Solo docs, tests o un archivo aislado | Revisión simple y CI en verde |
| Medio | Varios módulos sin migración ni API pública | Cobertura delta sin caída y 1 revisor |
| Alto | Migración, auth, pagos o contrato de API | 2 revisores, plan de reversión y prueba en staging |
| Crítico | Esquema irreversible o cambio de seguridad global | Revisión experta, ventana de deploy y monitoreo dedicado |

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente (revisión vaga):

```text
# Revisión sin formato ni severidad
Se ve bien en general, quizás revisa la parte de pagos, apruebo.
```

Problema: no estima riesgo, no cita líneas y aprueba un módulo crítico sin evidencia.

Ejemplo correcto:

```text
# Revisión con blast radius y hallazgos accionables
Blast radius: ALTO, toca pagos y agrega migración irreversible.
Cobertura delta: -2,1 % en src/pagos/, falta caso de reembolso.
src/pagos/cobro.ts:42: [HIGH] Falta validación de monto negativo antes del cargo. Agregar guarda con ValueError.
src/pagos/migracion.sql:8: [CRITICAL] Migración sin reversión documentada. Agregar script DOWN y probar en staging.
Veredicto: BLOQUEAR
```

Este formato funciona porque estima el riesgo, mide la cobertura y cada hallazgo indica archivo, línea y severidad.

## Niveles de aplicación

- Nivel básico: cambios de blast radius bajo con CI en verde y revisión de legibilidad.
- Nivel intermedio: cambios de blast radius medio con cobertura delta y revisión de las cuatro dimensiones.
- Nivel avanzado: cambios de blast radius alto o crítico con dos revisores, plan de reversión y verificación en staging.

## Reglas estrictas

- Nunca apruebes un PR con CI en rojo o con conflictos sin resolver.
- Nunca uses comentarios vagos, todo hallazgo lleva path, línea y severidad.
- Nunca apruebes migraciones irreversibles sin script de reversión probado.
- Nunca ignores una caída de cobertura en código nuevo o modificado.
- Nunca mezcles elogios con bloqueos, los hallazgos van primero y el veredicto al final.

## Checklist aplicable

- [ ] Blast radius estimado según la matriz con archivos y dependencias listados.
- [ ] Descripción del PR con qué, porqué, alcance y plan de reversión.
- [ ] CI en verde con lint, pruebas y build sin errores ni warnings nuevos.
- [ ] Delta de cobertura medido sobre el código tocado, sin caída injustificada.
- [ ] Hallazgos emitidos en formato path:line: [SEVERIDAD] con sugerencia concreta.
- [ ] Seguridad verificada en entradas, auth, secretos y datos personales.
- [ ] Veredicto final APROBAR, COMENTAR o BLOQUEAR según la severidad máxima.

## Output Contract

Entrega la revisión en este orden y con oraciones completas:

- **Blast radius**: nivel, archivos críticos y justificación del riesgo.
- **Cobertura delta**: porcentaje global y por módulo tocado con comando ejecutado.
- **Hallazgos**: una línea por hallazgo con formato path:line: [SEVERIDAD] más sugerencia.
- **Pruebas**: qué se ejecutó, resultado y casos faltantes.
- **Veredicto**: `APROBAR`, `COMENTAR` o `BLOQUEAR` con la condición para avanzar.
- **Estado final**: lista de pendientes con responsable cuando el veredicto no es APROBAR.

## Referencias oficiales

1. Documentación de GitHub sobre revisión de PR: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests
2. Guía de revisión de código de Google: https://google.github.io/eng-practices/review/
3. Especificación de Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0/
4. Documentación de GitHub sobre estados de CI: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features
