#!/usr/bin/env bash
# Desinstalador PerfeckCode (macOS/Linux). Restaura el respaldo mas reciente de cada ruta.
set -euo pipefail

restaurar_ultimo() {
  local destino="$1"
  local padre="$(dirname "$destino")"
  local base="$(basename "$destino")"
  if [ -L "$destino" ]; then echo "Symlink, omito: $destino"; return 0; fi
  local bk="" f
  for f in "$padre/$base.backup-"*; do
    [ -e "$f" ] || continue
    if [ -z "$bk" ] || [ "$f" -nt "$bk" ]; then bk="$f"; fi
  done
  if [ -z "$bk" ]; then
    if [ -e "$destino" ] || [ -L "$destino" ]; then
      rm -rf "$destino"; echo "Eliminado (sin respaldo): $destino"
    else
      echo "Sin respaldo: $destino"
    fi
    return 0
  fi
  local tmp="$destino.tmp-del"
  [ -e "$destino" ] && mv "$destino" "$tmp"
  if ! mv "$bk" "$destino"; then
    [ -e "$tmp" ] && mv "$tmp" "$destino"
    echo "ERROR en $destino: no se pudo restaurar"; return 1
  fi
  rm -rf "$tmp"
  echo "Restaurado: $destino desde $bk"
}

RUTAS=(
  "$HOME/.config/opencode/agents"
  "$HOME/.config/opencode/commands"
  "$HOME/.config/opencode/AGENTS.md"
  "$HOME/.config/opencode/opencode.jsonc"
  "$HOME/.claude/agents"
  "$HOME/.claude/skills"
  "$HOME/.claude/output-styles"
  "$HOME/.claude/rules"
  "$HOME/.claude/templates"
  "$HOME/.claude/commands"
  "$HOME/.claude/hooks"
  "$HOME/.claude/scripts"
  "$HOME/.claude/skill-registry.md"
)

for ruta in "${RUTAS[@]}"; do restaurar_ultimo "$ruta"; done
echo "settings.json intacto por diseno (revise sus claves)."
echo "Respaldos restantes: ls -d ~/.claude/*.backup-* ~/.config/opencode/*.backup-*"
echo ""
echo "Listo. Su configuracion anterior volvio a su lugar. Reinicie opencode/Claude Code."
