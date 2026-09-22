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

## Anexo - Referencias oficiales

Usted endurece por capas y verifica tras cada capa. Usted no aplica benchmarks a ciegas.

| Fuente | URL | Uso |
|---|---|---|
| kernel.org | https://www.kernel.org/doc/html/latest/ | cgroups v2, eBPF, networking y seguridad del kernel |
| systemd hardening | https://www.freedesktop.org/software/systemd/man/systemd.exec.html | `NoNewPrivileges`, `ProtectSystem`, `PrivateTmp` |
| nftables wiki | https://wiki.nftables.org/ | Tablas, cadenas, sets y politica drop por defecto |
| Microsoft Learn SSH | https://learn.microsoft.com/windows-server/administration/openssh/openssh_server_configuration | Referencia cruzada de `sshd_config` cuando administra desde Windows |

Usted valida con `sshd -t`, `nft -c -f` y `systemd-analyze security` antes de recargar.
