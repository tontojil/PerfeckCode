# PerfeckCode

Configuracion para opencode y Claude Code: agentes especialistas, skills por tarea y reglas de verificacion, con respuestas en español neutro.

## Tabla de contenido

- [Qué es](#qué-es)
- [Por qué existe](#por-qué-existe)
- [Demo de uso](#demo-de-uso)
- [Qué incluye](#qué-incluye)
- [Instalación](#instalación)
  - [Requisitos](#requisitos)
  - [Windows (PowerShell)](#windows-powershell)
  - [macOS / Linux (Bash)](#macos--linux-bash)
  - [Después de instalar](#después-de-instalar)
  - [Solución de problemas](#solución-de-problemas)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Seguridad](#seguridad)
- [FAQ](#faq)
- [Licencia](#licencia)

## Qué es

PerfeckCode convierte su asistente de programacion (opencode o Claude Code) en un equipo de trabajo definido: en lugar de un chat que parte de cero en cada sesion, usted obtiene especialistas a los que llama por nombre, habilidades que se activan segun la tarea y reglas que exigen evidencia antes de declarar algo como terminado.

Usted describe el objetivo en lenguaje normal y el sistema deriva al especialista que corresponde, con sus reglas y herramientas ya cargadas. Usted revisa el resultado, no el proceso.

## Por qué existe

Los asistentes de IA olvidan decisiones entre sesiones, no siguen las convenciones del proyecto y obligan a repetir contexto. PerfeckCode aporta tres elementos:

- Memoria de trabajo: 60 skills con criterios por area (backend, frontend, movil, documentos, DevOps, testing, seguridad).
- Oficios definidos: 26 agentes en opencode (25 especialistas mas el agente primario `tonto-jil`) y 25 agentes en Claude Code, cada uno con ambito y formato de salida propios.
- Disciplina: verificar con comandos recien ejecutados antes de decir "listo", commits atómicos con Conventional Commits y prohibicion de secretos en el codigo.

El resultado es menos repeticion, menos errores evitables y menos tokens gastados.

## Demo de uso

Ejemplo real con el depurador. Usted escribe:

```text
@depurador La API responde 500 en /api/login con un usuario valido
```

El agente `depurador` captura el error, reproduce el caso, aisla la causa raiz y propone el cambio minimo. Respuesta esperada (formato resumido):

```text
## Root Cause
La migracion agrego la columna email sin valor por defecto y las filas existentes quedaron en NULL.

## Evidence
- File:line donde se origina el fallo: src/auth/login.ts:42
- Estado que provoca el fallo: user.email es null
- Por que funcionaba antes: la columna no existia y el codigo no la leia

## Reproduction
curl -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@test.com","password":"test"}'

## Fix
old_string: WHERE id = ? (sin control de NULL)
new_string: control explicito de NULL mas backfill de la columna

## Regression Test
Test que falla sin el fix y pasa con el: login con fila anterior a la migracion.

## Prevention
Verificacion previa de migracion y consistencia de datos antes del despliegue.
```

El detalle del flujo (capturar, reproducir, aislar, probar, corregir) esta definido en `claude-agents/depurador.md` y `opencode/agents/depurador.md`.

## Qué incluye

| Parte | Contenido |
|---|---|
| 26 agentes en opencode | 25 especialistas mas el agente primario `tonto-jil` (se elige con Tab) |
| 25 agentes en Claude Code | Mismos 25 especialistas en `claude-agents/` |
| 60 skills | Backend, frontend, movil, documentos universitarios, DevOps, testing, seguridad |
| Comandos en opencode | `/verify` (evidencia antes del "listo"), `/ralph` (itera hasta terminar) |
| Comandos en Claude Code | 4 comandos en `claude-commands/` (`code-review`, `security-scan`, `plan`, `model-route`) |
| Reglas | Estilo de codigo, flujo git, testing, seguridad y anti-filtracion de secretos en `rules/` |
| Plantillas SDD | 7 plantillas de especificacion en `templates/` |
| Estilo | Español neutro, directo, primero codigo |

Cada agente y cada skill es un archivo Markdown que usted puede leer y ajustar.

## Instalación

### Requisitos

| Requisito | Windows | macOS / Linux |
|---|---|---|
| opencode o Claude Code | Instalado y en el PATH | Instalado y en el PATH |
| Node.js 18+ | `winget install OpenJS.NodeJS` | `brew install node` o su gestor de paquetes |
| Git | `winget install Git.Git` | Preinstalado o `brew install git` |
| PowerShell 5.1+ / Bash | Incluido en Windows | Incluido |

### Windows (PowerShell)

```powershell
git clone https://github.com/tontojil/PerfeckCode.git
cd PerfeckCode
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Si Windows bloquea el script, esa linea lo permite solo para esta ejecucion, sin cambiar nada permanente.

### macOS / Linux (Bash)

```bash
git clone https://github.com/tontojil/PerfeckCode.git
cd PerfeckCode
chmod +x install.sh
./install.sh
```

### Después de instalar

1. El instalador respalda su configuracion previa con fecha y hora. Su `settings.json` existente nunca se sobrescribe.
2. Si es primera vez, complete sus claves de proveedor en `~/.claude/settings.json` guiandose por `settings.template.json`.
3. Reinicie opencode o Claude Code.
4. Pruebe con `@depurador hola` (debe responder el depurador).
5. Con Tab cambie al agente `tonto-jil`.

### Solución de problemas

- **No se reconoce `@depurador`**: no reinicio la aplicacion despues de instalar. Cierrela y abrala de nuevo.
- **Windows bloquea `install.ps1`**: use la linea con `-ExecutionPolicy Bypass` tal cual.
- **`./install.sh: permiso denegado`**: ejecute `chmod +x install.sh` primero.
- **Quiere volver atras**: elimine las carpetas instaladas y renombre los respaldos `.backup-<fecha>` quitandoles el sufijo.

## Estructura del repositorio

```text
PerfeckCode/
├── opencode/               # 26 agentes, 2 comandos, AGENTS.md global, opencode.jsonc
├── claude-agents/          # 25 agentes para Claude Code
├── claude-commands/        # 4 comandos para Claude Code
├── skills/                 # 60 skills, cada una con SKILL.md
├── output-styles/          # estilo tonto-jil
├── rules/                  # 5 reglas en common/ mas npm-security.md
├── templates/              # 7 plantillas de especificacion (SDD)
├── hooks/                  # 6 hooks (incluye secret-detect)
├── scripts/                # utilidades (squash-auto-saves)
├── skill-registry.md       # indice de las 60 skills
├── settings.template.json  # plantilla SIN claves
├── security_rules.md       # protocolos de seguridad y operacion
├── CLAUDE.md               # instrucciones globales
├── install.ps1             # instalador Windows
├── install.sh              # instalador macOS/Linux
└── LICENSE                 # MIT
```

Conteos verificados en esta revision: 26 archivos en `opencode/agents`, 25 en `claude-agents`, 60 directorios en `skills`, 2 comandos en `opencode/commands`, 4 en `claude-commands`.

## Seguridad

Este repositorio no contiene claves, tokens ni datos personales. Solo se publica `settings.template.json` con valores de ejemplo.

Medidas aplicadas:

- `settings.json`, `.env` y `secrets/` estan en `.gitignore` y no se commitean.
- `settings.template.json` define permisos por defecto: niega lectura de `.env` y `secrets/`, y pide confirmacion para `npm install` y `git push`.
- El hook `hooks/secret-detect.sh` detecta claves privadas y tokens antes de commitear.
- `npm install` y `npm i` requieren confirmacion explicita. Se prefiere `npm ci`.
- Si encuentra un secreto por accidente, reportelo para revocarlo y purgarlo del historial.

## FAQ

**1. ¿Pierdo mi configuracion actual al instalar?**

No. Ambos instaladores respaldan cada carpeta existente como `.backup-<fecha>` y nunca sobrescriben su `settings.json`. Si es primera vez, se crea uno desde `settings.template.json` para que complete sus claves.

**2. ¿Funciona igual en opencode y en Claude Code?**

Si, con la misma base. opencode usa 26 agentes (incluye el primario `tonto-jil`) y 2 comandos; Claude Code usa 25 agentes y 4 comandos. Las 60 skills y las reglas son compartidas.

**3. ¿Por que `@depurador` no responde despues de instalar?**

En la mayoria de los casos falta reiniciar la aplicacion. Cierre opencode o Claude Code por completo, abralo de nuevo y pruebe `@depurador hola`. En opencode, use Tab para cambiar al agente `tonto-jil` si desea el trato general.

**4. ¿Como actualizo o revierto?**

Para actualizar, repita el `git clone` o `git pull` y ejecute el instalador de su sistema; lo anterior queda respaldado. Para revertir, elimine las carpetas instaladas y renombre los respaldos `.backup-<fecha>` quitandoles el sufijo.

## Licencia

MIT. Ver `LICENSE`.
