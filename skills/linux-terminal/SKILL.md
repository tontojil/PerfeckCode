---
name: linux-terminal
description: "Para usar la terminal Linux sin miedo: archivos, permisos, bash, systemd y SSH. (linux, terminal, bash, ssh)"
---

# Linux Terminal

## Core Rule

**Primero mire, después toque: `pwd`, `ls` y `whoami` no rompen nada.**

## When to Use

- Moverse en archivos, ver procesos y espacio en disco.
- Escribir o arreglar scripts bash.
- Conectarse a otro equipo por SSH.
- Levantar servicios con systemd y leer sus registros.

## Process

1. **Ubíquese**
   - `pwd` dónde estoy, `ls -la` qué hay, `cd` moverse, `man <comando>` ayuda.
2. **Archivos y permisos**
   - `chmod 644` archivos, `chmod 755` carpetas y scripts, `chown usuario:grupo`.
   - Claves SSH siempre `chmod 600`, carpeta `.ssh` en `700`.
3. **Bash seguro**
   - Empiece con `#!/usr/bin/env bash` y `set -euo pipefail`.
   - Verifique con `bash -n` y `shellcheck` antes de correr. Pruebe en copia, no en real.
4. **Servicios**
   - `systemctl status <servicio>`, `systemctl enable --now <servicio>`, `journalctl -u <servicio> -f` para ver qué pasa.
5. **SSH**
   - Llave `ed25519` con `ssh-keygen -t ed25519`, cópiela con `ssh-copy-id`, entre con `ssh usuario@equipo`.
   - Desde Windows use WSL (`wsl ~`) o OpenSSH de PowerShell.

## Output Contract

Entregue: comando corrido, salida y qué cambió. Si algo falla, el registro exacto.

## Anexo - Referencias oficiales

Usted consulta estas fuentes antes de afirmar sintaxis. Usted prueba en copia, no en real.

| Fuente | URL | Uso |
|---|---|---|
| kernel.org | https://www.kernel.org/doc/html/latest/ | Syscalls, permisos, filesystems y cgroups |
| systemd docs | https://systemd.io/ y https://www.freedesktop.org/wiki/Software/systemd/ | `systemctl`, `journalctl` y unidades |
| Microsoft Learn WSL y OpenSSH | https://learn.microsoft.com/windows/wsl/ y https://learn.microsoft.com/windows-server/administration/openssh/openssh_overview | SSH desde Windows y llaves ed25519 |
| awesome-linux | https://github.com/inputsh/awesome-linux | Herramientas curadas y hardening base |

Usted verifica con `man <comando>` en el equipo antes de aplicar cambios.
