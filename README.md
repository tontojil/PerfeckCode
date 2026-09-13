# PerfeckCode

## Qué es

PerfeckCode convierte su asistente de programación (opencode o Claude Code) en un equipo de trabajo completo: en vez de un chat que olvida todo a cada rato, usted obtiene 23 especialistas a los que puede llamar por nombre, 53 habilidades que se activan solas según la tarea, y un estilo de respuesta directo y profesional en español neutro.

Pida algo en palabras normales ("revísame la seguridad de este login", "hazme el informe INACAP", "arregla este error") y el sistema deriva al especialista que corresponde, con sus reglas y herramientas ya cargadas. Usted revisa el resultado, no el proceso.

## Por qué existe

Los asistentes de IA parten de cero en cada conversación: olvidan sus decisiones, no siguen las convenciones de su proyecto y hay que explicarles todo dos veces. PerfeckCode les da memoria de trabajo (skills), oficios definidos (agentes) y disciplina (verificar antes de decir "listo", commits prolijos, jamás secretos en el código). Menos repetición, menos errores tontos, menos tokens gastados.

## Qué incluye

| Parte | Contenido |
|---|---|
| 23 subagentes (`@nombre`) | Depurador, revisor de código, auditor de seguridad, arquitecto backend, diseñador UI, redactor técnico (INACAP/PPTX/XLSX) y más |
| Agente primario `tonto-jil` | El que habla con usted; se elige con Tab |
| 53 skills | Backend, frontend, móvil, documentos universitarios, DevOps, testing, seguridad |
| Comandos | `/verify` (evidencia antes del "listo"), `/ralph` (itera hasta terminar) |
| Reglas | Estilo de código, flujo git, testing, seguridad, anti-filtración de secretos |
| Estilo | Español neutro, directo, code-first |

Todo configurable: cada agente y skill es un archivo Markdown que usted puede leer y ajustar.

## Instalación

Requisitos: opencode o Claude Code instalado, Node.js 18+, Git. Windows, macOS o Linux.

```powershell
git clone https://github.com/tontojil/PerfeckCode.git
cd PerfeckCode
.\install.ps1        # Windows
```

```bash
bash install.sh      # macOS / Linux
```

El instalador respalda su configuración previa con fecha antes de copiar. Su `settings.json` existente nunca se sobrescribe. Complete sus claves de proveedor en `~/.claude/settings.json` (guíese por `settings.template.json`).

Reinicie opencode/Claude Code y pruebe con `@depurador hola`. Con Tab cambie al agente `tonto-jil`.

## Estructura del repositorio

```
PerfeckCode/
├── opencode/          # agentes, comandos, AGENTS.md global, opencode.jsonc
├── claude-agents/     # 22 agentes para Claude Code
├── skills/            # 53 skills con SKILL.md
├── output-styles/     # estilo tonto-jil
├── rules/             # reglas de codigo, git, testing, seguridad
├── templates/         # plantillas de especificacion (SDD)
├── claude-commands/   # comandos para Claude Code
├── hooks/ scripts/    # hooks y utilidades
├── skill-registry.md  # indice de skills
├── settings.template.json  # plantilla SIN claves
├── install.ps1 / install.sh
└── LICENSE (MIT)
```

## Seguridad

Este repositorio **no contiene claves, tokens ni datos personales**. Solo va `settings.template.json` con espacios vacíos. Si encuentra un secreto por accidente, repórtelo por favor.
