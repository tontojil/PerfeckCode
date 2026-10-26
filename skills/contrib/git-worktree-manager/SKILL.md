---
name: git-worktree-manager
description: "Trabaja en varias ramas en paralelo con git worktree, con puertos aislados y limpieza segura. Usalo para tareas simultaneas, revision de PR y experimentos sin cambiar de rama. (git worktree, parallel work, ports, cleanup)"
---

# Git Worktree Manager

## Core Rule

Un worktree por tarea activa, con nombre predecible y limpieza obligatoria al terminar. Ninguna tarea paralela comparte directorio de trabajo ni puerto local. Esta regla evita contaminacion entre ramas y puertos ocupados.

## Cuándo usar

- El usuario necesita trabajar en dos o mas ramas al mismo tiempo.
- Se debe revisar un pull request sin interrumpir el trabajo actual.
- Se quiere probar un experimento riesgoso en una copia aislada.
- El usuario pide "en paralelo", "sin cambiar de rama" o "worktree".
- El repositorio tiene servicios locales que colisionan por puerto.

## Process

1. Verifica el estado del repositorio principal con `git status` y `git worktree list`. No crees un worktree si hay cambios sin guardar que puedan confundirse con la tarea nueva.
2. Define el nombre del worktree con el formato `wt-<rama-corta>` y la ruta fuera del arbol principal, por ejemplo `../<repo>-<rama-corta>`. Registra la rama base exacta.
3. Crea el worktree con `git worktree add` en modo `detach` solo si es lectura, o con rama nueva si es escritura. Confirma que el comando termina con codigo 0.
4. Asigna puertos aislados por worktree con un desplazamiento fijo. Documenta el mapa `worktree -> puerto` en un archivo visible o en la salida del agente.
5. Instala dependencias y copia solo los archivos locales necesarios (por ejemplo `.env.ejemplo` a `.env`). Nunca copies secretos reales entre worktrees.
6. Ejecuta la tarea dentro del worktree asignado. No edites archivos del worktree principal desde el worktree secundario.
7. Al terminar, ejecuta pruebas minimas, hace commit o genera el diff, abre el PR si corresponde y luego limpia con `git worktree remove --force` solo despues de verificar que no quedan cambios sin guardar.
8. Prune final con `git worktree prune` y verifica con `git worktree list` que no quedan restos. Reporta el mapa final y los puertos liberados.

## Ejemplo deficiente contra ejemplo correcto

Ejemplo deficiente:

```bash
# Crea worktrees sin convencion, comparte el mismo puerto y nunca limpia.
git worktree add ../tmp1 -b experimento
# El servidor usa el mismo puerto 3000 en ambos worktrees y falla el segundo.
npm run dev -- --port 3000
# El directorio ../tmp1 queda abandonado por meses.
```

Problema: nombres impredecibles, colision de puertos y basura acumulada que confunde a git.

Ejemplo correcto:

```bash
# Lista worktrees actuales antes de crear uno nuevo.
git worktree list

# Crea un worktree con nombre predecible para la rama de pago.
git worktree add ../miapp-pago -b feat/pago-tarjeta origin/main

# Asigna un puerto aislado por worktree y lo deja registrado.
# worktree: ../miapp-pago -> puerto 3001
# worktree: ../miapp-auth -> puerto 3002
PORT=3001 npm run dev

# Al terminar, verifica que no hay cambios pendientes y limpia.
git status --porcelain
git worktree remove --force ../miapp-pago
git worktree prune
git worktree list
```

```powershell
# Mismo flujo en Windows PowerShell con verificacion de puerto.
# Muestra los worktrees actuales.
git worktree list

# Crea el worktree para la tarea de pago.
git worktree add ..\miapp-pago -b feat/pago-tarjeta origin/main

# Verifica que el puerto 3001 esta libre antes de usarlo.
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
# Si no muestra nada, el puerto esta libre y se puede usar.
$env:PORT = "3001"; npm run dev
```

## Niveles de aplicación

- Nivel 1, lectura: un worktree en modo `detach` para revisar un PR o comparar ramas. Sin instalacion de dependencias. Limpieza inmediata.
- Nivel 2, tarea aislada: un worktree con rama propia, dependencias instaladas y puerto asignado. Incluye pruebas minimas antes de limpiar.
- Nivel 3, paralelo sostenido: dos o tres worktrees activos con mapa de puertos documentado, cada uno con su base de datos o esquema aislado. Requiere checklist completo y limpieza programada.

## Reglas estrictas

- Nunca crees un worktree dentro de otro worktree. Usa siempre rutas hermanas al repositorio principal.
- Nunca compartas el mismo puerto entre dos servicios activos. Cada worktree recibe un puerto distinto y registrado.
- Nunca elimines un worktree con cambios sin guardar sin confirmacion explicita del usuario.
- Nunca copies archivos `.env` con secretos reales. Genera valores locales de desarrollo por worktree.
- Siempre verifica `git worktree list` antes de crear y despues de limpiar.

## Checklist aplicable

- [ ] `git status` del repositorio principal esta limpio o los cambios estan identificados.
- [ ] Nombre del worktree sigue el formato `wt-<rama-corta>` o `../<repo>-<rama-corta>`.
- [ ] Rama base registrada (por ejemplo `origin/main` con hash del commit).
- [ ] Puerto asignado y verificado como libre.
- [ ] Dependencias instaladas dentro del worktree, sin enlaces al principal.
- [ ] Variables de entorno locales configuradas sin secretos reales.
- [ ] Pruebas minimas ejecutadas antes del commit o del PR.
- [ ] `git worktree remove` ejecutado y `git worktree list` confirma cero restos.

## Output Contract

Al terminar, entrega siempre este bloque en este orden:

1. Tabla `worktree | rama | ruta | puerto | estado`.
2. Comandos ejecutados con codigo de salida.
3. Resultado de pruebas minimas (comando y resumen).
4. Estado de limpieza: `limpio` o `pendiente: <motivo>` con el comando exacto para completar la limpieza.

Ejemplo de salida valida:

```
worktree | rama | ruta | puerto | estado
../miapp-pago | feat/pago-tarjeta | ../miapp-pago | 3001 | removido
Comandos: git worktree add (0), npm test (0), git worktree remove (0)
Pruebas: npm test, 12 pasadas, 0 fallidas.
Limpieza: limpio, git worktree list sin restos.
```

## Referencias oficiales

- Documentacion de git worktree: https://git-scm.com/docs/git-worktree
- Libro Pro Git sobre worktree y ramificacion: https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
- Guia de GitHub sobre clonacion y ramas: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository
- Referencia de puertos y conexiones en PowerShell: https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection
