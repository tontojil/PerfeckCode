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
5. **Limpieza segura (estilo Win11Debloat)**
   - Punto de restauración primero: si algo falla, se vuelve atrás.
   - Quite solo apps que reconoce, una por vez. Telemetría y avisos se apagan con lista, no a ciegas.
   - Todo cambio anotado para deshacer.

## Output Contract

Entregue: comando corrido, exit code, y que cambio en el PC. Sin tecnicismos innecesarios.
