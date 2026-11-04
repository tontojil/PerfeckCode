#!/usr/bin/env bash
# Diagnostico PerfeckCode (solo lectura, macOS/Linux).
# Verifica la estructura dual V1/V2, conteos, archivos clave, encoding del lock y opencode.
# Uso: bash scripts/doctor.sh
# Solo lee el repositorio. No modifica ni crea archivos.
set -u
FALLOS=0
SRC="${BASH_SOURCE[0]:-$0}"
REPO="$(cd "$(dirname "$SRC")/.." && pwd)"

echo "Diagnostico PerfeckCode (solo lectura)."
echo "Repositorio: $REPO"
echo ""

anotar_fallo() {
	echo "FALLO: $1"
	FALLOS=$((FALLOS + 1))
}

verificar_conteo() {
	# Argumentos: nombre, ruta, esperado.
	local nombre="$1" ruta="$2" esperado="$3" total=0
	if [ ! -e "$ruta" ]; then
		anotar_fallo "$nombre no existe: $ruta (se esperaban $esperado elementos)."
		return
	fi
	total="$(ls -1A "$ruta" | wc -l | tr -d ' ')"
	if [ "$total" -eq "$esperado" ]; then
		echo "OK: $nombre tiene $total elementos (esperado $esperado)."
	else
		anotar_fallo "$nombre tiene $total elementos, se esperaban $esperado."
	fi
}

verificar_skills() {
	# Cuenta solo directorios de skill con SKILL.md; skills/contrib es un contenedor.
	local esperado="$1" ruta="$REPO/skills" total=0 d
	if [ ! -d "$ruta" ]; then
		anotar_fallo "skills/ no existe."
		return
	fi
	for d in "$ruta"/*/; do
		[ -d "$d" ] || continue
		[ -f "$d/SKILL.md" ] && total=$((total + 1))
	done
	if [ "$total" -eq "$esperado" ]; then
		echo "OK: skills/ tiene $total skills con SKILL.md (esperado $esperado)."
	else
		anotar_fallo "skills/ tiene $total skills con SKILL.md, se esperaban $esperado."
	fi
}

verificar_existe() {
	# Argumentos: ruta, nombre.
	if [ -e "$1" ]; then
		echo "OK: existe $2."
	else
		anotar_fallo "falta $2 en $1."
	fi
}

verificar_utf8_json() {
	# Argumentos: nombre, ruta. Rechaza UTF-16, BOM y contenido que no empiece con '{'.
	local nombre="$1" ruta="$2" primeros
	if [ ! -f "$ruta" ]; then
		anotar_fallo "falta $nombre en $ruta."
		return
	fi
	primeros="$(od -An -tx1 -N3 "$ruta" 2>/dev/null | tr -d ' \n')"
	case "$primeros" in
	fffe* | feff*) anotar_fallo "$nombre esta en UTF-16; debe ser UTF-8 sin BOM." ;;
	efbbbf*) anotar_fallo "$nombre tiene BOM UTF-8; debe ser UTF-8 sin BOM." ;;
	7b*) echo "OK: $nombre es UTF-8 sin BOM." ;;
	*) anotar_fallo "$nombre no empieza con '{'; no parece un lock JSON valido." ;;
	esac
}

# 1. Conteos esperados de la estructura dual.
verificar_skills 80
verificar_conteo "opencode-v1/agents" "$REPO/opencode-v1/agents" 33
verificar_conteo "opencode-v2/agents" "$REPO/opencode-v2/agents" 33
verificar_conteo "claude-agents" "$REPO/claude-agents" 33
verificar_conteo "opencode-v1/commands" "$REPO/opencode-v1/commands" 6
verificar_conteo "opencode-v2/commands" "$REPO/opencode-v2/commands" 6
verificar_conteo "claude-commands" "$REPO/claude-commands" 4
echo ""

# 2. Cero rutas C:/Users/ con nombre de usuario real.
# El patron exige letra, digito, guion o subrayado tras Users/, por lo que
# el ejemplo documentado C:/Users/... (con puntos) no se cuenta como fuga.
PATRON='C:[\\/]Users[\\/]+[A-Za-z0-9_-]+'
FUGAS=""
for ruta in "$REPO/opencode-v1" "$REPO/opencode-v2" "$REPO/docs" "$REPO/README.md" "$REPO/FLUJO-TRABAJO.md"; do
	if [ ! -e "$ruta" ]; then
		anotar_fallo "ruta a revisar no existe: $ruta."
		continue
	fi
	if [ -d "$ruta" ]; then
		HALLADO="$(grep -rE -n "$PATRON" "$ruta" 2>/dev/null | grep -v -E 'C:[\\/]Users[\\/]+\.\.\.' || true)"
	else
		HALLADO="$(grep -E -n "$PATRON" "$ruta" 2>/dev/null | grep -v -E 'C:[\\/]Users[\\/]+\.\.\.' || true)"
	fi
	if [ -n "$HALLADO" ]; then
		FUGAS="$FUGAS$HALLADO
"
	fi
done
if [ -z "$FUGAS" ]; then
	echo "OK: sin rutas C:/Users/ con nombre de usuario en la estructura V1/V2, docs y README."
else
	anotar_fallo "se encontraron rutas de usuario:"
	echo "$FUGAS"
fi
echo ""

# 3. Archivos clave de V2 y del instalador.
verificar_existe "$REPO/opencode-v1/AGENTS.md" "opencode-v1/AGENTS.md"
verificar_existe "$REPO/opencode-v1/opencode.jsonc" "opencode-v1/opencode.jsonc"
verificar_existe "$REPO/opencode-v2/AGENTS.md" "opencode-v2/AGENTS.md"
verificar_existe "$REPO/opencode-v2/opencode.jsonc" "opencode-v2/opencode.jsonc"
verificar_existe "$REPO/opencode-v2/cli.json" "opencode-v2/cli.json"
verificar_existe "$REPO/opencode-v2/package.json" "opencode-v2/package.json"
verificar_existe "$REPO/opencode-v2/themes/perfeckcode.json" "opencode-v2/themes/perfeckcode.json"
verificar_existe "$REPO/opencode-v2/plugins/perfeckcode/tui.tsx" "opencode-v2/plugins/perfeckcode/tui.tsx"
verificar_existe "$REPO/opencode-v2/plugins/guard.js" "opencode-v2/plugins/guard.js"
verificar_existe "$REPO/opencode-v2/plugins/perfeck-banner.js" "opencode-v2/plugins/perfeck-banner.js"
verificar_existe "$REPO/opencode-v2/tests/native-config.test.ts" "opencode-v2/tests/native-config.test.ts"
verificar_existe "$REPO/scripts/install-opencode.mjs" "scripts/install-opencode.mjs"
verificar_existe "$REPO/docs/opencode-agents.md" "docs/opencode-agents.md"
verificar_existe "$REPO/docs/opencode-safety.md" "docs/opencode-safety.md"
verificar_existe "$REPO/settings.template.json" "settings.template.json"
verificar_utf8_json "opencode-v2/bun.lock" "$REPO/opencode-v2/bun.lock"
echo ""

# 4. Lista de agentes si opencode esta en PATH (aviso si no esta).
if ! command -v opencode >/dev/null 2>&1; then
	echo "AVISO: opencode no esta en PATH, se omite la comprobacion de agentes."
else
	if SALIDA="$(opencode agent list 2>&1)"; then
		echo "$SALIDA"
		echo "OK: el comando opencode agent list se ejecuto correctamente."
	elif echo "$SALIDA" | grep -qE 'Unexpected positional argument|unknown (sub)?command|Usage:'; then
		echo "$SALIDA"
		echo "AVISO: esta version de opencode no admite el subcomando agent list, se omite."
	else
		echo "$SALIDA"
		anotar_fallo "opencode agent list termino con error."
	fi
fi
echo ""

if [ "$FALLOS" -eq 0 ]; then
	echo "Diagnostico verde: todas las comprobaciones pasaron."
	exit 0
else
	echo "Diagnostico rojo: $FALLOS comprobaciones fallaron."
	exit 1
fi
