# PerfeckCode

Configuración completa de agentes IA para **opencode** y **Claude Code**: 53 skills, 23 agentes opencode, 22 agentes Claude, comandos, reglas y estilo propio. Español neutro.

## Contenido

| Carpeta | Qué es |
|---|---|
| `opencode/` | 23 agentes (`@depurador`, `@revisor-codigo`...), comandos `/verify` y `/ralph`, `AGENTS.md` global |
| `claude-agents/` | 22 agentes para Claude Code |
| `skills/` | 53 skills (backend, frontend, móvil, docs INACAP, DevOps, testing) |
| `output-styles/` | Estilo `tonto-jil` (español neutro, code-first) |
| `rules/`, `templates/` | Reglas y plantillas SDD |
| `claude-commands/`, `hooks/`, `scripts/` | Comandos, hooks y utilidades |
| `settings.template.json` | Plantilla de ajustes (sin claves) |

## Requisitos

- opencode o Claude Code instalado
- Node.js 18+, Git
- Windows, macOS o Linux

## Instalación

```powershell
git clone https://github.com/tontojil/PerfeckCode.git
cd PerfeckCode
.\install.ps1        # Windows
```

```bash
bash install.sh      # macOS / Linux
```

El instalador respalda su configuración previa con fecha antes de copiar.
Su `settings.json` existente nunca se sobrescribe. Complete sus claves de
proveedor en `~/.claude/settings.json` (ver `settings.template.json`).

Reinicie opencode/Claude Code y pruebe con `@depurador hola`.

## Seguridad

Este repo **no contiene claves ni tokens**. Si encuentra un secreto por
accidente, repórtelo por favor.
