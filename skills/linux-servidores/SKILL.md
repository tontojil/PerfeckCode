---
name: linux-servidores
description: "Para dejar un servidor Linux seguro y operando: SSH, firewall, respaldo y monitoreo. (linux, servidor, ssh, firewall)"
---

# Linux Servidores

## Core Rule

**Respaldo antes de tocar, validación antes de reiniciar, prueba antes de cerrar la sesión.**

## When to Use

- Nuevo servidor: dejarlo seguro desde el día uno.
- Publicar una app con usuario propio y servicio systemd o Docker.
- Respaldo, monitoreo y recuperación.

## Process

1. **Acceso inicial y hardening SSH**
   - Cree usuario propio con sudo y deshabilite `root` remoto. Copie llave con `ssh-copy-id usuario@servidor`.
   - Endurezca `/etc/ssh/sshd_config`:
     ```
     PermitRootLogin no
     PasswordAuthentication no
     PubkeyAuthentication yes
     ChallengeResponseAuthentication no
     X11Forwarding no
     MaxAuthTries 3
     LoginGraceTime 60
     AllowUsers deploy su_usuario
     ```
   - Valide con `sudo sshd -t` y recargue con `sudo systemctl reload sshd`.
   - Pruebe el acceso en una segunda ventana antes de cerrar la sesión activa.
   - Instale `fail2ban` con jail `sshd` y active actualizaciones automáticas de seguridad (`unattended-upgrades` en Debian/Ubuntu).
2. **Firewall: puerta cerrada por defecto**
   - Con UFW:
     ```
     sudo ufw default deny incoming
     sudo ufw default allow outgoing
     sudo ufw limit ssh
     sudo ufw allow 80,443/tcp
     sudo ufw enable
     ```
   - Con nftables verifique con `sudo nft -c -f /etc/nftables.conf` antes de recargar. Política drop por defecto.
   - Abra solo lo necesario. Cada puerto abierto debe tener responsable y justificación.
3. **App como servicio (systemd o Docker)**
   - Usuario `deploy` sin root. En systemd use `User=`, `NoNewPrivileges=true`, `ProtectSystem=strict`, `PrivateTmp=true`.
   - Secretos solo en `.env` con `chmod 600` y fuera del repositorio. Nunca en el código.
   - Con Docker:
     - Red dedicada por app, `restart: unless-stopped`, `healthcheck` definido.
     - No exponer puertos de app al exterior. Solo el proxy expone `80` y `443`.
     - No montar `/var/run/docker.sock` salvo necesidad justificada. Imagen con tag fijo, no `latest` en producción.
4. **HTTPS con proxy reverso**
   - Caddy o Traefik delante de la app. Redirección total de HTTP a HTTPS.
   - Certificado automático con Let's Encrypt, renovación automática. Verifique vigencia con `curl -vI https://<dominio>`.
5. **Respaldo 3-2-1**
   - Copia diaria con `tar` o `rsync` + suma de verificación (`sha256sum`).
   - Tres copias, dos soportes, una fuera del servidor. Cifre con `restic` o `borg`.
   - Restaure 1 archivo al mes en carpeta temporal y registre fecha y resultado.
6. **Ojos abiertos (monitoreo mínimo)**
   - `journalctl -p err -b`, `df -h` (alerta si uso mayor o igual a 80%), `systemctl list-units --failed`.
   - Revise `fail2ban-client status sshd` y estado del certificado TLS.

## Output Contract

Entregue: checklist (acceso, firewall, app, HTTPS, respaldo, monitoreo) con comando y estado de cada punto, más fecha del último respaldo probado.

## Ejemplo mínimo con UFW

Configuración mínima de firewall en un servidor Ubuntu nuevo:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw limit ssh
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ufw status verbose
```

Verifique con `sudo ufw status verbose` antes de cerrar la sesión activa.

## Anexo - Referencias oficiales

Usted endurece por capas y verifica tras cada capa. Usted no aplica benchmarks a ciegas.

| Fuente | URL | Uso |
|---|---|---|
| OpenSSH sshd_config | https://www.openssh.com/legacy.html | Opciones `PermitRootLogin`, `PasswordAuthentication`, `AllowUsers` |
| UFW manual | https://help.ubuntu.com/community/UFW | `default deny`, `limit ssh`, `allow 80,443/tcp` |
| nftables wiki | https://wiki.nftables.org/ | Tablas, cadenas, sets y política drop por defecto |
| systemd hardening | https://www.freedesktop.org/software/systemd/man/systemd.exec.html | `NoNewPrivileges`, `ProtectSystem`, `PrivateTmp` |
| Docker docs | https://docs.docker.com/ | Compose, volumes, networks y healthcheck |
| Docker Compose GitHub | https://github.com/docker/compose | Referencia de `compose.yaml`, redes, reinicio y healthcheck |
| Let's Encrypt docs | https://letsencrypt.org/docs/ | Emisión, renovación y límites de certificados TLS |
| kernel.org | https://www.kernel.org/doc/html/latest/ | cgroups v2, eBPF, networking y seguridad del kernel |
| Microsoft Learn SSH | https://learn.microsoft.com/windows-server/administration/openssh/openssh_server_configuration | Referencia cruzada de `sshd_config` cuando administra desde Windows |

Usted valida con `sshd -t`, `ufw status verbose`, `docker ps` y `curl -vI https://<dominio>` antes de dar por terminado.
