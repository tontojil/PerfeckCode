# Desinstalador PerfeckCode (Windows). Restaura el respaldo mas reciente de cada ruta.
# Uso: powershell -ExecutionPolicy Bypass -File uninstall.ps1
$ErrorActionPreference = "Stop"

function Restaurar-Ultimo($Destino) {
    try {
        $Base = Split-Path -Leaf $Destino
        $Padre = Split-Path -Parent $Destino
        if ((Get-Item -LiteralPath $Destino -Force -ErrorAction SilentlyContinue).LinkType) {
            Write-Host "Symlink, omito: $Destino"; return
        }
        $Candidatos = @(Get-ChildItem -LiteralPath $Padre -Filter "$Base.backup-*" -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending)
        if (-not $Candidatos.Count) {
            if (Test-Path -LiteralPath $Destino) {
                Remove-Item -Recurse -Force -LiteralPath $Destino
                Write-Host "Eliminado (sin respaldo): $Destino"
            } else {
                Write-Host "Sin respaldo: $Destino"
            }
            return
        }
        $Bk = $Candidatos[0].FullName
        if (-not (Test-Path -LiteralPath $Padre)) {
            New-Item -ItemType Directory -Path $Padre -Force | Out-Null
        }
        $Tmp = "$Destino.tmp-del"
        if (Test-Path -LiteralPath $Destino) { Move-Item -LiteralPath $Destino -Destination $Tmp -Force }
        try {
            Move-Item -LiteralPath $Bk -Destination $Destino -Force
        } catch {
            if (Test-Path -LiteralPath $Tmp) { Move-Item -LiteralPath $Tmp -Destination $Destino -Force }
            throw
        }
        if (Test-Path -LiteralPath $Tmp) { Remove-Item -Recurse -Force -LiteralPath $Tmp }
        Write-Host "Restaurado: $Destino desde $Bk"
    } catch {
        Write-Host "ERROR en $Destino : $($_.Exception.Message)"
    }
}

$Rutas = @(
    "$HOME\.config\opencode\agents",
    "$HOME\.config\opencode\commands",
    "$HOME\.config\opencode\AGENTS.md",
    "$HOME\.config\opencode\opencode.jsonc",
    "$HOME\.claude\agents",
    "$HOME\.claude\skills",
    "$HOME\.claude\output-styles",
    "$HOME\.claude\rules",
    "$HOME\.claude\templates",
    "$HOME\.claude\commands",
    "$HOME\.claude\hooks",
    "$HOME\.claude\scripts",
    "$HOME\.claude\skill-registry.md"
)

foreach ($Ruta in $Rutas) { Restaurar-Ultimo $Ruta }
Write-Host "settings.json intacto por diseno (revise sus claves)."
Write-Host "Respaldos restantes: revise con Get-ChildItem `$HOME\.claude -Filter *.backup-*"
Write-Host ""
Write-Host "Listo. Su configuracion anterior volvio a su lugar. Reinicie opencode/Claude Code."
