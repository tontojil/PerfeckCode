#Requires -Version 5.1
# Instalador PerfeckCode (Windows). Respalda lo existente y copia la config.
$ErrorActionPreference = "Stop"
$Repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"

function Instalar-Dir($Origen, $Destino) {
    if (Test-Path -LiteralPath $Destino) {
        $Bk = "$Destino.backup-$Stamp"
        Move-Item -LiteralPath $Destino -Destination $Bk -Force
        Write-Host "Respaldo: $Bk"
    }
    New-Item -ItemType Directory -Path (Split-Path -Parent $Destino) -Force | Out-Null
    Copy-Item -Recurse -Force -LiteralPath $Origen -Destination $Destino
    Write-Host "Instalado: $Destino"
}

Instalar-Dir "$Repo\opencode\agents" "$HOME\.config\opencode\agents"
Instalar-Dir "$Repo\opencode\commands" "$HOME\.config\opencode\commands"
Copy-Item -Force "$Repo\opencode\AGENTS.md" "$HOME\.config\opencode\AGENTS.md"
Copy-Item -Force "$Repo\opencode\opencode.jsonc" "$HOME\.config\opencode\opencode.jsonc"
Instalar-Dir "$Repo\claude-agents" "$HOME\.claude\agents"
Instalar-Dir "$Repo\skills" "$HOME\.claude\skills"
Instalar-Dir "$Repo\output-styles" "$HOME\.claude\output-styles"
Instalar-Dir "$Repo\rules" "$HOME\.claude\rules"
Instalar-Dir "$Repo\templates" "$HOME\.claude\templates"
Instalar-Dir "$Repo\claude-commands" "$HOME\.claude\commands"
Instalar-Dir "$Repo\hooks" "$HOME\.claude\hooks"
Instalar-Dir "$Repo\scripts" "$HOME\.claude\scripts"
Copy-Item -Force "$Repo\skill-registry.md" "$HOME\.claude\skill-registry.md"

if (-not (Test-Path -LiteralPath "$HOME\.claude\settings.json")) {
    Copy-Item "$Repo\settings.template.json" "$HOME\.claude\settings.json"
    Write-Host "Creado settings.json desde plantilla: complete sus claves."
} else {
    Write-Host "settings.json existente intacto (no se sobrescribe)."
}

Write-Host ""
Write-Host "Listo. Reinicie opencode/Claude Code y pruebe: @depurador hola"
