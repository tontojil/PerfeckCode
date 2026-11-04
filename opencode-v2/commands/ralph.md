---
description: Loop autonomo que itera hasta dejar DONE la tarea
---

Ejecute $ARGUMENTS en loop hasta terminar (patron Ralph):

1. Avance un paso concreto y verificable.
2. Corra la verificacion (tests/lint o `/verify`).
3. Si falla, corrija y repita. Maximo 5 iteraciones sin progreso:
   detengase, guarde contexto y pida ayuda.
4. Termine solo con evidencia fresca y `<promise>DONE</promise>`.
