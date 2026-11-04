---
name: soporte-pc-redes
description: "Para PC, WiFi, impresoras y respaldo: diagnóstico y arreglo en Windows. (soporte, wifi, impresora, respaldo)"
---

# Soporte PC y Redes

## Regla central

**Primero lo físico (cables, papel, energía), después lo lógico (controladores, red, sistema). Ningún cambio sin evidencia de diagnóstico.**

## Cuándo utilizar

- Computador lento, sin internet o impresora que no imprime.
- WiFi inestable, dirección IP modificada o advertencia de sitio no seguro.
- Respaldo y recuperación de archivos.

## Proceso

1. **Diagnóstico inicial**
   - Revisar energía, cables, papel y estado de WiFi antes de cambiar configuración.
   - Ejecutar `ping 8.8.8.8`, `ipconfig /all` y `Test-NetConnection -ComputerName ejemplo.com -Port 443`.
   - Revisar cola de impresión y Administrador de dispositivos para detectar controladores con error.
   - Verificar fecha y hora del equipo. Una fecha incorrecta interrumpe certificados SSL.

2. **Red y WiFi**
   - Reiniciar el router y reconectar la red WiFi.
   - Verificar DHCP, DNS y puerta de enlace con `ipconfig` y `nslookup`.
   - Probar DNS alternativo solo como diagnóstico temporal y documentar el cambio.

3. **Impresora**
   - Confirmar papel, energía y conexión por cable o red.
   - Verificar controlador correcto, cola de impresión y página de prueba.
   - Utilizar `Get-Printer` y `Get-PrintJob` en PowerShell para el diagnóstico.

4. **Respaldo 3-2-1**
   - Mantener 3 copias, en 2 soportes distintos, con 1 copia fuera del lugar.
   - Probar la restauración de un archivo cada mes y registrar el resultado.

5. **Limpieza Win11Debloat (fuente: https://github.com/Raphire/Win11Debloat)**
   - Crear punto de restauración antes de iniciar y ejecutar como administrador.
   - Comando rápido: `& ([scriptblock]::Create((irm "https://debloat.raphi.re/")))`
   - Modo automático con seguridad: `& ([scriptblock]::Create((irm "https://debloat.raphi.re/"))) -RunDefaults -Silent -CreateRestorePoint`
   - Quitar solo aplicaciones reconocidas, anotar cada cambio y mantener reversibilidad mediante Microsoft Store o wiki del proyecto.

## Contrato de salida

Entregar causa identificada, solución aplicada y prueba verificable (ping correcto, página impresa, archivo restaurado).

## Lista de verificación

- [ ] Diagnóstico físico completo antes de cambiar configuración.
- [ ] Fecha y hora verificadas antes de declarar falla SSL.
- [ ] Comando de red ejecutado con resultado registrado.
- [ ] Cola de impresión revisada y página de prueba generada.
- [ ] Punto de restauración creado antes de limpieza o cambio de controlador.
- [ ] Respaldo 3-2-1 verificado con prueba de restauración.
- [ ] Mensajes de error redactados en lenguaje claro y accesible.

## Anexo - Referencias oficiales

Consultar estas fuentes antes de diagnosticar. No modificar controladores ni red sin evidencia.

| Fuente | URL | Uso |
|---|---|---|
| Microsoft Learn Windows networking | https://learn.microsoft.com/windows-server/networking/ | `Test-NetConnection`, DNS, DHCP y WiFi |
| Microsoft Support Windows | https://support.microsoft.com/windows | Solución de problemas de WiFi, red e impresión en Windows |
| Microsoft Learn Print management | https://learn.microsoft.com/windows-server/administration/print-management/ | Cola de impresión, controladores y página de prueba |
| Microsoft Learn Backup | https://learn.microsoft.com/windows-server/administration/windows-server-backup/ | Respaldo 3-2-1 y restauración |
| Microsoft Troubleshoot Windows client | https://learn.microsoft.com/troubleshoot/windows-client/ | Guías oficiales de diagnóstico en Windows |
| W3C Secure Contexts | https://www.w3.org/TR/secure-contexts/ | Base normativa de contexto seguro y HTTPS |
| W3C WAI Accessibility | https://www.w3.org/WAI/ | Redacción accesible de errores y estados de red |
| W3C WCAG 2.2 | https://www.w3.org/TR/WCAG22/ | Criterios para mensajes comprensibles y visibles |

Revisar fecha del equipo antes de declarar falla SSL y documentar ping con código de salida 0.
