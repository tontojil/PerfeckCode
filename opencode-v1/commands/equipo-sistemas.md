---
description: Equipo full de sistemas, infra y seguridad con verificacion tecnica
agent: tonto-jil
---

Ejecuta $ARGUMENTS con el equipo de sistemas. Eres tonto-jil, el primario orquestador. Delega con la herramienta Task.

1. Diagnostico en HANDOFF.md: entorno Windows o Linux, servicio afectado, ultimo cambio y riesgo. Task a ingeniero-windows si es PowerShell o rutas, Task a ingeniero-linux si es servidor o SSH.
2. Ejecucion en paralelo segun caso: Task a jefe-nube-propia para Docker y respaldo, Task a ingeniero-despliegue para CI CD, Task a ingeniero-observabilidad para SLI SLO y runbook, Task a ingeniero-rendimiento si hay lentitud.
3. Seguridad: Task a auditor-seguridad solo lectura para auth y secretos. Task a cazador-vulnerabilidades solo con autorizacion explicita y en entorno aislado.
4. Negocio tecnico: Task a super-agente-sii si es boleta o tienda, Task a mentor-programacion si hay que ensenar el arreglo.
5. Loop hasta verde: verifica con comando fresco y exit 0, repite hasta 5 intentos. Termina solo con evidencia y <promise>DONE</promise>. No ejecutes rm destructivo ni sudo sin confirmacion.
