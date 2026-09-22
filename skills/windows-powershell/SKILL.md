---
name: windows-powershell
description: "Para órdenes en Windows, PowerShell, rutas con espacios y permisos. Corrige errores típicos de Terminal en Windows. (powershell, windows, terminal)"
---

# Windows PowerShell

## Core Rule

**En Windows se usa PowerShell, no Bash. Las rutas llevan `\` o `/` con comillas si tienen espacios.**

## When to Use

- Comandos que fallan con `~`, `&&` o rutas sin comillas.
- Errores de `ExecutionPolicy`, permisos denegados, `Test-Path`.
- Scripts `install.ps1`, `squash` y tareas en Windows 10/11.

## Process

1. **Verifique primero**
   - `Get-Location`, `Test-Path -LiteralPath "<ruta>"`, `$PSVersionTable.PSVersion`.
2. **Rutas seguras**
   - Siempre `-LiteralPath` y comillas dobles si hay espacios.
   - `~` no expande en herramientas de lectura: use `C:/Users/<nombre>/...`.
3. **Permisos**
   - `ExecutionPolicy Bypass` solo para esa ejecucion, nunca permanente.
   - `chmod +x` no existe: el permiso lo da NTFS, no el flag.
4. **Equivalencias**
   - `ls` -> `Get-ChildItem`, `cat` -> `Get-Content -Raw`, `grep` -> `Select-String`, `rm -rf` -> `Remove-Item -Recurse -Force`.
5. **Limpieza segura (Win11Debloat: https://github.com/Raphire/Win11Debloat)**
   - Rápido: `& ([scriptblock]::Create((irm "https://debloat.raphi.re/")))`; menú CLI: agregue `-CLI`; defaults auto: agregue `-RunDefaults -Silent -CreateRestorePoint`.
   - Parámetros: `-RunDefaults` (defaults + apps), `-RunDefaultsLite` (defaults sin apps), `-Silent` (sin prompts), `-CreateRestorePoint` (si no hay en 24h), `-RemoveApps -Apps "Microsoft.OneDrive"`.
   - Avanzado: `Set-ExecutionPolicy Bypass -Scope Process -Force` + `.\Win11Debloat.ps1`. Solo en esa ejecución, nunca permanente.
   - Checklist: administrador + UAC, restore point primero, quite solo apps que reconoce, telemetría con lista no a ciegas, todo anotado y reversible vía Store/wiki.

## Output Contract

Entregue: comando corrido, exit code, y que cambio en el PC. Sin tecnicismos innecesarios.

## Anexo - Referencias oficiales

Usted consulta estas fuentes antes de afirmar sintaxis. Usted no improvisa flags.

| Fuente | URL | Uso |
|---|---|---|
| Microsoft Learn PowerShell 7.4 | https://learn.microsoft.com/powershell/ | Cmdlets, `-LiteralPath`, remoting y novedades |
| Microsoft Learn Windows package manager | https://learn.microsoft.com/windows/package-manager/ | Winget install, upgrade, export e import |
| Sysinternals | https://learn.microsoft.com/sysinternals/ | Process Explorer, Monitor, Autoruns y TCPView |
| Microsoft Learn WSL2 | https://learn.microsoft.com/windows/wsl/ | Interoperabilidad PowerShell y Linux |
| kernel.org (interop) | https://www.kernel.org/doc/html/latest/ | Referencia del kernel que corre bajo WSL2 |

Usted prefiere Microsoft Learn sobre blogs y verifica la URL si tiene dudas.
