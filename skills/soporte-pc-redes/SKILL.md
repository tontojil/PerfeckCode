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

## Output Contract

Entregue: causa encontrada, arreglo aplicado y prueba (ping OK, página impresa, archivo restaurado).
