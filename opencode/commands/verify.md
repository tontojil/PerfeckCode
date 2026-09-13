---
description: Verificar evidencia fresca antes de declarar listo
---

Ejecute VERIFY FIRST sobre $ARGUMENTS (o el cambio actual si viene vacio):

1. `git status --short` y `git diff --stat` para saber que cambio.
2. Comando de prueba del proyecto (ver `package.json`, README o skill
   `verificacion-final`). Si no hay tests, cree uno minimo primero.
3. Reporte: comando corrido, exit code, resumen y fragmento de evidencia.
4. Solo indique "listo" con exit 0 fresco. Sin log, sin afirmacion.
