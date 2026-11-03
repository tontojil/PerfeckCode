---
description: Equipo full de programacion que itera hasta dejar tests en verde
agent: tonto-jil
---

Ejecuta $ARGUMENTS con el equipo de programacion en este orden estricto. Eres tonto-jil, el primario orquestador. No implementes directo, delega con la herramienta Task.

1. Planifica y escribe HANDOFF.md con objetivo medible, alcance, archivos tocados y criterio de exito. Si la tarea es ambigua, usa Task con jefe-producto para PRD minimo antes de codificar.
2. Diseno: Task a arquitecto-backend para contrato API y esquema de datos. Task a disenador-ui-ux si hay UI. Ambos solo entregan especificacion, no codigo final.
3. Implementacion en paralelo: lanza en el mismo turno Task a arquitecto-backend y Task a desarrollador-frontend con el contrato del paso 2 y solo los archivos relevantes. Cada worker entrega diff pequeno.
4. Verificacion: Task a ingeniero-calidad-qa para correr build, lint y tests del proyecto. Debe devolver comando corrido, exit code y log exacto. No edita codigo.
5. Loop hasta verde: si hay fail, Task a depurador con file:line, stack exacto y log del paso 4. El depurador aplica fix minimo y devuelve. Vuelve al paso 4. Maximo 5 iteraciones totales. Si supera 5, guarda contexto en HANDOFF.md y escala a humano.
6. Endurecimiento: Task a revisor-codigo solo lectura para bloqueantes. Task a auditor-seguridad solo lectura si hay auth, secretos o pagos. Task a ingeniero-rendimiento si hay lentitud o N+1.
7. Cierre: corre /verify con evidencia fresca. Termina solo con tests en verde y <promise>DONE</promise>. No hagas push, merge ni deploy sin confirmacion explicita. Comentarios de codigo en espanol.
