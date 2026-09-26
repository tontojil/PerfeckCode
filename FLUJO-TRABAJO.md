# Cómo trabajar en este repo (léeme en otro chat)

Instrucciones para seguir mejorando opencode en cualquier sesión nueva.

## 1. Dónde vive cada cosa

- Esta carpeta (`PerfeckCode/`) es la fuente de verdad. Se edita aquí.
- Lo instalado vive en `C:/Users/Pablo/.config/opencode/` (opencode) y `C:/Users/Pablo/.claude/` (Claude Code + skills).
- Ambas deben quedar gemelas. El instalador copia de aquí hacia allá.

## 2. Reglas de edición

- Lea el archivo con Read antes de editar. Cambios chicos, nunca rewrites.
- Español neutro, habla normal y neutra, sin modismos. Tildes y ñ sí, comillas ASCII rectas.
- `color:` en frontmatter solo hexadecimal entre comillas (`"#ff0000"`), nunca nombres (`red` falla el esquema).
- Rutas Windows completas (`C:/Users/Pablo/...`), nunca `~`. Skills se leen con Read, no existe herramienta `skill`.
- Wrappers en `opencode/agents/` siguen el patrón: `description` ES+EN, `mode: subagent`, puntos 1-3, `Usted`.

## 3. Al crear skills o agentes

- Skill: carpeta `skills/<nombre>/SKILL.md` con frontmatter `name` + `description` con tildes y triggers entre paréntesis.
- Agente: base completa en `claude-agents/<nombre>.md` (frontmatter `name/description/color/model/tools/skills/maxTurns` + rol + pasos + constraints + formato) + wrapper en `opencode/agents/<nombre>.md`.
- Registrar: fila en `skill-registry.md` + total, fila con ejemplo en `opencode/AGENTS.md`, conteos en `README.md`.

## 4. Igualar instalado

- Corra `powershell -ExecutionPolicy Bypass -File .\install.ps1` (respalda solo con `.backup-*`, nunca toca `settings.json`).
- Para volver atrás: `.\scripts\uninstall.ps1` restaura el respaldo más reciente.

## 5. Verificar antes de decir listo

```powershell
git status --short; git diff --stat
(Get-ChildItem -Directory .\skills).Count      # = instalado en ~/.claude/skills
(Get-ChildItem .\opencode\agents).Count        # = instalado en ~/.config/opencode/agents
(Get-ChildItem .\claude-agents).Count          # = instalado en ~/.claude/agents
opencode agent list                             # exit 0, sin errores
```

- Hashes repo vs instalado iguales (`Get-FileHash`).
- Cero `~/` y cero `herramienta skill` en `opencode/`.
- No haga commit salvo que se lo pidan (otra ventana los hace).

## 6. Revisión con agentes

- Cambios chicos: 2-3 agentes relacionados, 3 pasadas, solo lectura.
- Cambios grandes: los 24 agentes, 3-5 pasadas, respuesta breve (máx 8-12 líneas cada uno).
- Aplique solo lo mejor, sincronice y vuelva a verificar.
