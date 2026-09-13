#!/usr/bin/env bash
# Instalador PerfeckCode (macOS/Linux). Respalda lo existente y copia la config.
set -euo pipefail
SRC="${BASH_SOURCE[0]:-$0}"
REPO="$(cd "$(dirname "$SRC")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S 2>/dev/null || echo nodate)-$$"

instalar_dir() {
  if [ ! -e "$1" ]; then
    echo "ERROR: origen no existe: $1" >&2
    return 1
  fi
  if [ -e "$2" ] || [ -L "$2" ]; then
    local BK="$2.backup-$STAMP"
    local i=1
    while [ -e "$BK" ] || [ -L "$BK" ]; do
      BK="$2.backup-$STAMP-$i"
      i=$((i + 1))
    done
    mv "$2" "$BK"
    echo "Respaldo: $BK"
  fi
  mkdir -p "$(dirname "$2")"
  cp -Rp "$1" "$2"
  echo "Instalado: $2"
}

instalar_dir "$REPO/opencode/agents" "$HOME/.config/opencode/agents"
instalar_dir "$REPO/opencode/commands" "$HOME/.config/opencode/commands"
mkdir -p "$HOME/.config/opencode" "$HOME/.claude"
cp -f "$REPO/opencode/AGENTS.md" "$HOME/.config/opencode/AGENTS.md"
cp -f "$REPO/opencode/opencode.jsonc" "$HOME/.config/opencode/opencode.jsonc"
instalar_dir "$REPO/claude-agents" "$HOME/.claude/agents"
instalar_dir "$REPO/skills" "$HOME/.claude/skills"
instalar_dir "$REPO/output-styles" "$HOME/.claude/output-styles"
instalar_dir "$REPO/rules" "$HOME/.claude/rules"
instalar_dir "$REPO/templates" "$HOME/.claude/templates"
instalar_dir "$REPO/claude-commands" "$HOME/.claude/commands"
instalar_dir "$REPO/hooks" "$HOME/.claude/hooks"
instalar_dir "$REPO/scripts" "$HOME/.claude/scripts"
cp -f "$REPO/skill-registry.md" "$HOME/.claude/skill-registry.md"

if [ ! -f "$HOME/.claude/settings.json" ]; then
  cp "$REPO/settings.template.json" "$HOME/.claude/settings.json"
  echo "Creado settings.json desde plantilla: complete sus claves."
else
  echo "settings.json existente intacto (no se sobrescribe)."
fi

echo ""
echo "Listo. Reinicie opencode/Claude Code y pruebe: @depurador hola"
