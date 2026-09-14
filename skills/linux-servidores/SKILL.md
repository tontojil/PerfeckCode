---
name: linux-servidores
description: "Para dejar un servidor Linux seguro y operando: SSH, firewall, respaldo y monitoreo. (linux, servidor, ssh, firewall)"
---

# Linux Servidores

## Core Rule

**Respaldo antes de tocar, validación antes de reiniciar, prueba antes de cerrar la sesión.**

## When to Use

- Nuevo servidor: dejarlo seguro desde el día uno.
- Publicar una app con usuario propio y servicio systemd.
- Respaldo, monitoreo y recuperación.

## Process

1. **Acceso**
   - Usuario propio con sudo, SSH solo con llave, sin root ni clave. Valide con `sshd -t` y pruebe en otra ventana antes de cerrar.
2. **Puerta cerrada**
   - Firewall niega todo y abre solo lo necesario: `ufw default deny incoming`, `ufw limit ssh`, `ufw allow 80,443/tcp`.
   - Fail2ban contra fuerza bruta, actualizaciones automáticas de seguridad.
3. **App como servicio**
   - Usuario `deploy` sin root, unidad systemd con `User=`, proxy reverso con HTTPS, secretos en `.env` con `chmod 600`.
4. **Respaldo 3-2-1**
   - Copia diaria con `tar` o `rsync` + suma de verificación. Restaure 1 archivo al mes en carpeta temporal.
5. **Ojos abiertos**
   - `journalctl -p err`, `df -h` (alerta si uso mayor o igual a 80%), `systemctl list-units --failed`. Alerta simple por cada uno.

## Output Contract

Entregue: checklist (acceso, firewall, app, respaldo, monitoreo) con comando y estado de cada punto.
