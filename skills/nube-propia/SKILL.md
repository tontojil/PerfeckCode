---
name: nube-propia
description: "Para su propia nube en su servidor: apps con Docker, HTTPS y respaldo. Sus datos, sus reglas. (self-host, servidor, docker)"
---

# Nube Propia

## Core Rule

**Sus aplicaciones y datos permanecen en su servidor, nada se envía a servicios externos.**

## When to Use

- Hospedar su tienda, sistema de ventas o archivos en su servidor.
- Salir de suscripciones mensuales que suben sin avisar.
- Respaldo local con copia fuera del local.
- No usar si su app vive en hosting externo o plataforma de arriendo; en ese caso use `publicacion-web`.

## Process

1. **Base del servidor: SSH y firewall primero**
   - SSH solo con llave: `PermitRootLogin no`, `PasswordAuthentication no`, `AllowUsers deploy`. Valide con `sudo sshd -t` y pruebe en segunda ventana.
   - Firewall restrictivo:
     ```
     sudo ufw default deny incoming
     sudo ufw default allow outgoing
     sudo ufw limit ssh
     sudo ufw allow 80,443/tcp
     sudo ufw enable
     ```
   - Active `fail2ban` para `sshd` y actualizaciones automáticas de seguridad. Sin esta base no publique nada.
2. **Apps con Docker (fuente: https://github.com/cloud-in-a-bottle/cloud-in-a-bottle/)**
   - Cada app en su contenedor con su carpeta de datos separada. Declárela con `cloudinabottle.toml` en la raíz del repo.
   - Mínimo: `[app] name + version`, `[runtime.container] image="Dockerfile" port=8080`, `[resources] memory_mb=128 cpu_cores=0.1`, `[data]` según tiers.
   - Puertos solo hacia adentro, proxy inverso (Caddy o Traefik) reparte por nombre. `[[ports]]` solo para no-HTTP; `host_port=0` auto-asigna en 9000-9999. `80` y `443` reservados para el proxy.
   - Buenas prácticas Docker: imagen con tag fijo, red propia por app, `restart: unless-stopped`, `healthcheck`, sin `privileged`, sin montar `docker.sock` salvo necesidad justificada.
   - CLI `bottle`: instale, actualice, vea logs y ciclo de vida. Guía: https://cloudinabottle.org/docs/operation/cli.html y spec https://cloudinabottle.org/docs/creating_an_app/manifest_spec.html
3. **HTTPS automático con Let's Encrypt**
   - Certificado automático por app mediante el proxy, renovación sola, redirección total de HTTP a HTTPS.
   - Verifique con `curl -vI https://<app.su-dominio>` y revise expiración con `openssl s_client -connect <app.su-dominio>:443 -servername <app.su-dominio> | openssl x509 -noout -dates`.
   - Si usa DNS wildcard, valide propagación con `nslookup` o `dig`.
4. **Respaldo (3 tiers)**
   - `app_data` (`BOTTLE_APP_DATA_DIR`): permanente. `app_temp_data` (`BOTTLE_APP_TEMP_DIR`): efímero. `app_archive` (`BOTTLE_APP_ARCHIVE_DIR`): voluminoso, local o S3. `sqlite=["main"]` crea `app_data/sqlite/main.db` (`BOTTLE_SQLITE_MAIN`).
   - Backup incluye permanente + temporal, excluye archive y su propio directorio. Copia diaria cifrada con `restic` o `borg` y prueba mensual de restauración de 1 archivo.

## Output Contract

Entregue: app publicada con HTTPS verificado, regla de firewall aplicada, dónde viven sus datos y fecha del último respaldo probado.

## Anexo - Referencias oficiales

Usted publica de a una app por vez y verifica con `docker ps` y `curl -vI https://<dominio>`.

| Fuente | URL | Uso |
|---|---|---|
| Docker docs | https://docs.docker.com/ | Compose, volumes, networks y healthcheck |
| Let's Encrypt docs | https://letsencrypt.org/docs/ | Emisión ACME, renovación y límites |
| Caddy docs | https://caddyserver.com/docs/ | `reverse_proxy`, TLS automático y Caddyfile |
| awesome-selfhosted | https://github.com/awesome-selfhosted/awesome-selfhosted | Catálogo de apps con Compose oficial |
| kernel.org (cgroups y namespaces) | https://www.kernel.org/doc/html/latest/ | Base de aislamiento que usa Docker |
| Microsoft Learn DNS | https://learn.microsoft.com/windows-server/networking/dns/dns-top | Wildcard DNS y verificación con `nslookup` |

Usted cifra respaldos con restic o borg y prueba restore de 1 archivo al mes.

## Ejemplo minimo

Aplicación con volumen persistente y verificación de salud:

```yaml
services:
  app:
    image: mi-tienda:1.4.0
    restart: unless-stopped
    volumes:
      - datos-app:/data
    networks: [interna]
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/salud"]
```
