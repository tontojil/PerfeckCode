#Requires -Version 5.1
# Diagnostico PerfeckCode (solo lectura, PowerShell 5.1 compatible).
# Verifica la estructura dual V1/V2, conteos, archivos clave, encoding del lock y opencode.
# Uso: powershell -ExecutionPolicy Bypass -File scripts/doctor.ps1
# Solo lee el repositorio. No modifica ni crea archivos.
$ErrorActionPreference = "Continue"
$script:Fallos = 0

if ($PSScriptRoot) {
    $Repo = Split-Path -Parent $PSScriptRoot
} else {
    $Repo = Split-Path -Parent $MyInvocation.MyCommand.Path
}

function Anotar-Fallo($Mensaje) {
    Write-Host "FALLO: $Mensaje"
    $script:Fallos++
}

function Contar-Elementos($Ruta) {
    # Cuenta archivos y carpetas hijas (no recursivo).
    $Items = @(Get-ChildItem -Force -LiteralPath $Ruta -ErrorAction SilentlyContinue)
    return $Items.Count
}

function Verificar-Conteo($Nombre, $Ruta, $Esperado) {
    if (-not (Test-Path -LiteralPath $Ruta)) {
        Anotar-Fallo "$Nombre no existe: $Ruta (se esperaban $Esperado elementos)."
        return
    }
    $Total = Contar-Elementos $Ruta
    if ($Total -eq $Esperado) {
        Write-Host "OK: $Nombre tiene $Total elementos (esperado $Esperado)."
    } else {
        Anotar-Fallo "$Nombre tiene $Total elementos, se esperaban $Esperado."
    }
}

function Verificar-Skills($Esperado) {
    # Cuenta solo directorios de skill con SKILL.md; skills/contrib es un contenedor.
    $Ruta = Join-Path $Repo "skills"
    if (-not (Test-Path -LiteralPath $Ruta)) {
        Anotar-Fallo "skills/ no existe."
        return
    }
    $Total = @(Get-ChildItem -Directory -LiteralPath $Ruta |
        Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName "SKILL.md") }).Count
    if ($Total -eq $Esperado) {
        Write-Host "OK: skills/ tiene $Total skills con SKILL.md (esperado $Esperado)."
    } else {
        Anotar-Fallo "skills/ tiene $Total skills con SKILL.md, se esperaban $Esperado."
    }
}

function Verificar-Existe($Nombre, $Ruta) {
    if (Test-Path -LiteralPath $Ruta) {
        Write-Host "OK: existe $Nombre."
    } else {
        Anotar-Fallo "falta $Nombre en $Ruta."
    }
}

function Verificar-Utf8Json($Nombre, $Ruta) {
    if (-not (Test-Path -LiteralPath $Ruta)) {
        Anotar-Fallo "falta $Nombre en $Ruta."
        return
    }
    $Bytes = [System.IO.File]::ReadAllBytes($Ruta)
    if ($Bytes.Length -ge 2 -and (($Bytes[0] -eq 0xFF -and $Bytes[1] -eq 0xFE) -or ($Bytes[0] -eq 0xFE -and $Bytes[1] -eq 0xFF))) {
        Anotar-Fallo "$Nombre esta en UTF-16; debe ser UTF-8 sin BOM."
        return
    }
    if ($Bytes.Length -ge 3 -and $Bytes[0] -eq 0xEF -and $Bytes[1] -eq 0xBB -and $Bytes[2] -eq 0xBF) {
        Anotar-Fallo "$Nombre tiene BOM UTF-8; debe ser UTF-8 sin BOM."
        return
    }
    if ($Bytes.Length -eq 0 -or $Bytes[0] -ne 0x7B) {
        Anotar-Fallo "$Nombre no empieza con '{'; no parece un lock JSON valido."
        return
    }
    Write-Host "OK: $Nombre es UTF-8 sin BOM."
}

Write-Host "Diagnostico PerfeckCode (solo lectura)."
Write-Host "Repositorio: $Repo"
Write-Host ""

# 1. Conteos esperados de la estructura dual.
Verificar-Skills 80
Verificar-Conteo "opencode-v1/agents" "$Repo\opencode-v1\agents" 33
Verificar-Conteo "opencode-v2/agents" "$Repo\opencode-v2\agents" 33
Verificar-Conteo "claude-agents" "$Repo\claude-agents" 33
Verificar-Conteo "opencode-v1/commands" "$Repo\opencode-v1\commands" 6
Verificar-Conteo "opencode-v2/commands" "$Repo\opencode-v2\commands" 6
Verificar-Conteo "claude-commands" "$Repo\claude-commands" 4
Write-Host ""

# 2. Cero rutas C:/Users/ con nombre de usuario real.
# El patron exige letra, digito, guion o subrayado tras Users/, por lo que
# el ejemplo documentado C:/Users/... (con puntos) no se cuenta como fuga.
$PatronUsuario = 'C:[\\/]Users[\\/]+[A-Za-z0-9_-]+'
$RutasTexto = @("$Repo\opencode-v1", "$Repo\opencode-v2", "$Repo\docs",
    "$Repo\README.md", "$Repo\FLUJO-TRABAJO.md")
$Fugas = @()
foreach ($Ruta in $RutasTexto) {
    if (-not (Test-Path -LiteralPath $Ruta)) {
        Anotar-Fallo "ruta a revisar no existe: $Ruta."
        continue
    }
    $Hallados = @(Get-ChildItem -Recurse -Force -LiteralPath $Ruta -ErrorAction SilentlyContinue |
        Where-Object { -not $_.PSIsContainer } |
        Select-String -Pattern $PatronUsuario -ErrorAction SilentlyContinue)
    $Reales = @($Hallados | Where-Object { $_.Line -notmatch 'C:[\\/]Users[\\/]+\.\.\.' })
    $Fugas += @($Reales)
}
if ($Fugas.Count -eq 0) {
    Write-Host "OK: sin rutas C:/Users/ con nombre de usuario en la estructura V1/V2, docs y README."
} else {
    Anotar-Fallo "se encontraron $($Fugas.Count) lineas con rutas de usuario."
    foreach ($F in $Fugas) {
        Write-Host "  $($F.Path):$($F.LineNumber): $($F.Line.Trim())"
    }
}
Write-Host ""

# 3. Archivos clave de V2 y del instalador.
Verificar-Existe "opencode-v1/AGENTS.md" "$Repo\opencode-v1\AGENTS.md"
Verificar-Existe "opencode-v1/opencode.jsonc" "$Repo\opencode-v1\opencode.jsonc"
Verificar-Existe "opencode-v2/AGENTS.md" "$Repo\opencode-v2\AGENTS.md"
Verificar-Existe "opencode-v2/opencode.jsonc" "$Repo\opencode-v2\opencode.jsonc"
Verificar-Existe "opencode-v2/cli.json" "$Repo\opencode-v2\cli.json"
Verificar-Existe "opencode-v2/package.json" "$Repo\opencode-v2\package.json"
Verificar-Existe "opencode-v2/themes/perfeckcode.json" "$Repo\opencode-v2\themes\perfeckcode.json"
Verificar-Existe "opencode-v2/plugins/perfeckcode/tui.tsx" "$Repo\opencode-v2\plugins\perfeckcode\tui.tsx"
Verificar-Existe "opencode-v2/plugins/guard.js" "$Repo\opencode-v2\plugins\guard.js"
Verificar-Existe "opencode-v2/plugins/perfeck-banner.js" "$Repo\opencode-v2\plugins\perfeck-banner.js"
Verificar-Existe "opencode-v2/tests/native-config.test.ts" "$Repo\opencode-v2\tests\native-config.test.ts"
Verificar-Existe "scripts/install-opencode.mjs" "$Repo\scripts\install-opencode.mjs"
Verificar-Existe "docs/opencode-agents.md" "$Repo\docs\opencode-agents.md"
Verificar-Existe "docs/opencode-safety.md" "$Repo\docs\opencode-safety.md"
Verificar-Existe "settings.template.json" "$Repo\settings.template.json"
Verificar-Utf8Json "opencode-v2/bun.lock" "$Repo\opencode-v2\bun.lock"
Write-Host ""

# 4. Lista de agentes si opencode esta en PATH (aviso si no esta).
$Opencode = Get-Command opencode -ErrorAction SilentlyContinue
if ($null -eq $Opencode) {
    Write-Host "AVISO: opencode no esta en PATH, se omite la comprobacion de agentes."
} else {
    try {
        # cmd fusiona stderr en stdout, asi se captura todo sin ruido rojo.
        $Salida = cmd /c "opencode agent list 2>&1" | Out-String
        $Codigo = $LASTEXITCODE
        Write-Host $Salida
        if ($Codigo -eq 0) {
            Write-Host "OK: el comando opencode agent list se ejecuto correctamente."
        } elseif ($Salida -match 'Unexpected positional argument|unknown (sub)?command|Usage:') {
            Write-Host "AVISO: esta version de opencode no admite el subcomando agent list, se omite."
        } else {
            Anotar-Fallo "opencode agent list termino con codigo $Codigo."
        }
    } catch {
        Anotar-Fallo "no se pudo ejecutar opencode agent list: $($_.Exception.Message)"
    }
}
Write-Host ""

if ($script:Fallos -eq 0) {
    Write-Host "Diagnostico verde: todas las comprobaciones pasaron."
    exit 0
} else {
    Write-Host "Diagnostico rojo: $($script:Fallos) comprobaciones fallaron."
    exit 1
}
