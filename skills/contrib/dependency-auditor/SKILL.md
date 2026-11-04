---
name: dependency-auditor
description: "Audita dependencias multi-lenguaje con licencias, vulnerabilidades y plan de actualización. Úsalo para revisar riesgos, aprobar upgrades o preparar releases. (dependencias, licencias, vulnerabilidades)"
---

# Dependency Auditor

Audita dependencias con inventario completo y plan de actualización. El objetivo es detectar vulnerabilidades, licencias incompatibles y paquetes abandonados antes de que lleguen a producción.

## Core Rule

**Toda dependencia queda inventariada con versión, licencia y riesgo, y ninguna actualización crítica entra sin prueba en rama aislada.**

## When to Use (Cuándo usar)

- El proyecto prepara un release y necesita revisión de dependencias.
- El usuario pide "audita dependencias", "revisa licencias" o "actualiza paquetes".
- Una alerta de seguridad reporta una vulnerabilidad en una librería usada.
- El build falla por versiones incompatibles o por paquetes desactualizados.
- En la revisión trimestral de salud del repositorio o antes de una auditoría.

## Process

1. Genera el inventario por ecosistema con versión exacta y alcance directo o transitivo.
2. Ejecuta el escáner de vulnerabilidades del ecosistema y registra cada hallazgo.
3. Revisa licencias contra la política del proyecto y marca incompatibilidades.
4. Clasifica cada riesgo por severidad y define la acción: actualizar, reemplazar o aceptar.
5. Aplica actualizaciones en rama aislada con pruebas completas en verde.
6. Documenta el plan con responsables, fechas y dependencias que quedan aceptadas.

### Comandos por ecosistema

| Ecosistema | Inventario | Auditoría |
|---|---|---|
| Node.js | `npm ls --all` | `npm audit --omit=dev` |
| Python | `pip freeze` o `uv pip list` | `pip-audit` |
| Go | `go list -m all` | `govulncheck ./...` |
| General | SBOM con `syft` | `osv-scanner` sobre el SBOM |

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente (actualización sin control):

```json
// package-deficiente.json
// Rango abierto que instala versiones no probadas en cada build
{
  "dependencies": {
    "facturacion-sdk": "*"
  }
}
```

Problema: el comodín instala cualquier versión futura sin auditoría y rompe la reproducibilidad del build.

Ejemplo correcto:

```json
// package-correcto.json
// Versión fijada con lockfile y auditoría registrada
{
  "dependencies": {
    "facturacion-sdk": "2.4.1"
  },
  "nota": "versión fijada, lockfile en package-lock.json, auditado el 2026-10-26"
}
```

Este formato funciona porque fija la versión exacta, exige lockfile y deja registro de la auditoría con fecha.

## Niveles de aplicación

- Nivel básico: inventario con vulnerabilidades críticas y altas corregidas.
- Nivel intermedio: inventario más licencias verificadas y plan de actualización por severidad.
- Nivel avanzado: SBOM versionado, monitoreo continuo con Dependabot o Renovate y política de licencias en CI.

## Reglas estrictas

- Nunca instales dependencias sin lockfile, el build debe ser reproducible.
- Nunca ignores una vulnerabilidad crítica aunque la actualización sea mayor.
- Nunca agregues una licencia incompatible con la política sin aprobación escrita.
- Nunca actualices producción sin rama aislada y suite completa en verde.
- Nunca aceptes un riesgo sin registrar responsable, motivo y fecha de revisión.

## Checklist aplicable

- [ ] Inventario por ecosistema con versión exacta y distinción directa o transitiva.
- [ ] Escáner de vulnerabilidades ejecutado con salida completa y exit code.
- [ ] Licencias revisadas contra la política con incompatibilidades marcadas.
- [ ] Plan de acción por hallazgo: actualizar, reemplazar o aceptar con justificación.
- [ ] Actualizaciones aplicadas en rama aislada con pruebas y build en verde.
- [ ] SBOM o lista de lockfiles adjunta al reporte para trazabilidad.
- [ ] Riesgos aceptados con responsable, motivo y fecha de próxima revisión.

## Output Contract

Entrega la auditoría en este orden y con oraciones completas:

- **Inventario**: tabla con paquete, versión, ecosistema y alcance directo o transitivo.
- **Vulnerabilidades**: tabla con CVE, severidad, paquete afectado y acción propuesta.
- **Licencias**: tabla con licencia detectada y veredicto compatible o incompatible.
- **Plan**: tabla con acción, responsable, fecha y orden de ejecución.
- **Evidencia**: comandos ejecutados con salida resumida y exit code.
- **Estado final**: `APROBADO`, `APROBADO CON RIESGOS` o `BLOQUEADO` con pendientes críticos.

## Referencias oficiales

1. Documentación de npm audit: https://docs.npmjs.com/cli/v10/commands/npm-audit
2. Base de vulnerabilidades OSV: https://osv.dev/
3. Lista de licencias SPDX: https://spdx.org/licenses/
4. OWASP Dependency-Check: https://owasp.org/www-project-dependency-check/
