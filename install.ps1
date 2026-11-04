#Requires -Version 5.1
# Instalador PerfeckCode (Windows 10/11). Respalda lo existente y copia la config.
# Uso V1 (su PC actual): powershell -ExecutionPolicy Bypass -File install.ps1
# Uso V2 (otras personas): powershell -ExecutionPolicy Bypass -File install.ps1 -Version V2
param([string]$Version = "V1")
$ErrorActionPreference = "Stop"
if ($PSScriptRoot) { $Repo = $PSScriptRoot } else { $Repo = Split-Path -Parent $MyInvocation.MyCommand.Path }
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
# Origen exclusivo por version dentro del mismo repo. V1 es su configuracion actual.
$OpenCodeSrc = "$Repo\opencode-v1"
if ($Version -eq "V2") { $OpenCodeSrc = "$Repo\opencode-v2" }
# Compatibilidad: si aun no existe la carpeta versionada, usa opencode/ clasico.
if (-not (Test-Path -LiteralPath $OpenCodeSrc)) { $OpenCodeSrc = "$Repo\opencode" }

function Nuevo-Respaldo($Destino) {
    # Nombre unico: evita colision si dos corridas caen en el mismo segundo.
    $Bk = "$Destino.backup-$Stamp"
    $i = 0
    while (Test-Path -LiteralPath $Bk) { $i++; $Bk = "$Destino.backup-$Stamp-$i" }
    return $Bk
}

function Instalar-Dir($Origen, $Destino) {
    # Valida origen ANTES de mover el destino (evita dejar destino vacio).
    if (-not (Test-Path -LiteralPath $Origen)) { throw "Origen no encontrado: $Origen" }
    if (Test-Path -LiteralPath $Destino) {
        $Bk = Nuevo-Respaldo $Destino
        Move-Item -LiteralPath $Destino -Destination $Bk -Force
        Write-Host "Respaldo: $Bk"
    }
    # Split-Path -LiteralPath no admite -Parent en 5.1; sin -Resolve no hay expansion.
    $Padre = Split-Path -Parent $Destino
    if ($Padre -and (-not (Test-Path -LiteralPath $Padre))) {
        # New-Item no tiene -LiteralPath en 5.1; -Path es la unica opcion.
        New-Item -ItemType Directory -Path $Padre -Force | Out-Null
    }
    Copy-Item -Recurse -Force -LiteralPath $Origen -Destination $Destino
    Write-Host "Instalado: $Destino"
}

function Instalar-Archivo($Origen, $Destino) {
    if (-not (Test-Path -LiteralPath $Origen)) { throw "Origen no encontrado: $Origen" }
    if (Test-Path -LiteralPath $Destino) {
        $Bk = Nuevo-Respaldo $Destino
        Move-Item -LiteralPath $Destino -Destination $Bk -Force
        Write-Host "Respaldo: $Bk"
    }
    $Padre = Split-Path -Parent $Destino
    if ($Padre -and (-not (Test-Path -LiteralPath $Padre))) {
        New-Item -ItemType Directory -Path $Padre -Force | Out-Null
    }
    Copy-Item -Force -LiteralPath $Origen -Destination $Destino
    Write-Host "Instalado: $Destino"
}

try {
    Write-Host "Instalando PerfeckCode $Version desde $OpenCodeSrc"
    Instalar-Dir "$OpenCodeSrc\agents" "$HOME\.config\opencode\agents"
    Instalar-Dir "$OpenCodeSrc\commands" "$HOME\.config\opencode\commands"
    Instalar-Archivo "$OpenCodeSrc\AGENTS.md" "$HOME\.config\opencode\AGENTS.md"
    Instalar-Archivo "$OpenCodeSrc\opencode.jsonc" "$HOME\.config\opencode\opencode.jsonc"
    if ($Version -eq "V2") {
        if (Test-Path -LiteralPath "$OpenCodeSrc\cli.json") { Instalar-Archivo "$OpenCodeSrc\cli.json" "$HOME\.config\opencode\cli.json" }
        if (Test-Path -LiteralPath "$OpenCodeSrc\themes") { Instalar-Dir "$OpenCodeSrc\themes" "$HOME\.config\opencode\themes" }
        if (Test-Path -LiteralPath "$OpenCodeSrc\plugins") { Instalar-Dir "$OpenCodeSrc\plugins" "$HOME\.config\opencode\plugins" }
    }
    Instalar-Dir "$Repo\claude-agents" "$HOME\.claude\agents"
    Instalar-Dir "$Repo\skills" "$HOME\.claude\skills"
    Instalar-Dir "$Repo\output-styles" "$HOME\.claude\output-styles"
    Instalar-Dir "$Repo\rules" "$HOME\.claude\rules"
    Instalar-Dir "$Repo\templates" "$HOME\.claude\templates"
    Instalar-Dir "$Repo\claude-commands" "$HOME\.claude\commands"
    Instalar-Dir "$Repo\hooks" "$HOME\.claude\hooks"
    Instalar-Dir "$Repo\scripts" "$HOME\.claude\scripts"
    Instalar-Archivo "$Repo\skill-registry.md" "$HOME\.claude\skill-registry.md"

    if (-not (Test-Path -LiteralPath "$HOME\.claude\settings.json")) {
        if (-not (Test-Path -LiteralPath "$Repo\settings.template.json")) { throw "Origen no encontrado: $Repo\settings.template.json" }
        Copy-Item -Force -LiteralPath "$Repo\settings.template.json" -Destination "$HOME\.claude\settings.json"
        Write-Host "Creado settings.json desde plantilla: complete sus claves."
    } else {
        Write-Host "settings.json existente intacto (no se sobrescribe)."
    }

    Write-Host ""
    Write-Host "Listo. Reinicie opencode/Claude Code y pruebe: @depurador hola"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    throw
}
