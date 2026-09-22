---
name: soporte-pc-redes
description: "Para PC, WiFi, impresoras y respaldo: diagnóstico y arreglo en Windows. (soporte, wifi, impresora, respaldo)"
---

# Soporte PC y Redes

## Core Rule

**Primero lo físico (cables, papel, encendido), después lo lógico (drivers, red, sistema).**

## When to Use

- PC lento, sin internet, impresora que no imprime.
- WiFi caído, IP cambiada, página "no seguro".
- Respaldo y recuperación de archivos.

## Process

1. **Diagnóstico**
   - `ping`, estado WiFi, papel y cables, cola de impresión bloqueada.
   - `Test-NetConnection` para red, administrador de dispositivos para drivers.
2. **Red**
   - Reinicie router, olvide y reconecte WiFi, revise DNS y fecha del PC (fecha mala rompe SSL).
3. **Impresora**
   - Papel, encendido, cable o red, driver correcto, página de prueba.
4. **Respaldo 3-2-1**
   - 3 copias, 2 lugares distintos, 1 fuera del local. Restaure 1 archivo al mes para probar.
5. **Limpieza Win11Debloat (fuente: https://github.com/Raphire/Win11Debloat)**
   - Comando rápido: `& ([scriptblock]::Create((irm "https://debloat.raphi.re/")))`
   - Automático con seguridad: `& ([scriptblock]::Create((irm "https://debloat.raphi.re/"))) -RunDefaults -Silent -CreateRestorePoint`
   - Checklist: punto de restauración primero, como administrador, anote cada cambio, quite solo apps que reconoce, todo reversible vía Store/wiki.

## Output Contract

Entregue: causa encontrada, arreglo aplicado y prueba (ping OK, página impresa, archivo restaurado).

## Anexo - Referencias oficiales

Usted consulta estas fuentes antes de diagnosticar. Usted no cambia drivers ni red sin evidencia.

| Fuente | URL | Uso |
|---|---|---|
| Microsoft Learn Windows networking | https://learn.microsoft.com/windows-server/networking/ | `Test-NetConnection`, DNS, DHCP y WiFi |
| Microsoft Learn Print management | https://learn.microsoft.com/windows-server/administration/print-management/ | Cola de impresion, drivers y pagina de prueba |
| Microsoft Learn Backup | https://learn.microsoft.com/windows-server/administration/windows-server-backup/ | Respaldo 3-2-1 y restauracion |
| kernel.org (red y drivers) | https://www.kernel.org/doc/html/latest/networking/ | Base de red y drivers cuando el fallo es del router o firmware |

Usted revisa fecha del equipo antes de declarar falla SSL y documenta ping con exit 0.
