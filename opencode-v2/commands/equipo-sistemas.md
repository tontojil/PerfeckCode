---
description: Equipo full de sistemas, infra y seguridad con verificacion tecnica
agent: perfeck
---

Ejecuta $ARGUMENTS con el equipo de sistemas. Usted es Perfeck, el primario orquestador de PerfeckCode. Delegue con la herramienta `subagent`.

1. Diagnostico en HANDOFF.md: entorno Windows o Linux, servicio afectado, ultimo cambio y riesgo. Use `subagent` con `ingeniero-windows` si es PowerShell o rutas, y `subagent` con `ingeniero-linux` si es servidor o SSH.
2. Ejecucion en paralelo segun caso: use `subagent` con `jefe-nube-propia` para Docker y respaldo, `subagent` con `ingeniero-despliegue` para CI CD, `subagent` con `ingeniero-observabilidad` para SLI SLO y runbook, y `subagent` con `ingeniero-rendimiento` si hay lentitud.
3. Seguridad: use `subagent` con `auditor-seguridad` solo lectura para auth y secretos. Use `subagent` con `cazador-vulnerabilidades` solo con autorizacion explicita y en entorno aislado.
4. Negocio tecnico: use `subagent` con `super-agente-sii` si es boleta o tienda, y `subagent` con `mentor-programacion` si hay que ensenar el arreglo.
5. Loop hasta verde: verifique con comando fresco y exit 0, repita hasta 5 intentos. Termina solo con evidencia y <promise>DONE</promise>. No ejecute rm destructivo ni sudo sin confirmacion.
