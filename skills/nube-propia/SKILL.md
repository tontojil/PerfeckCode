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

1. **Servidor**
   - PC dedicado o VPS con Docker, disco con espacio y energía respaldada.
2. **Apps (fuente: https://github.com/cloud-in-a-bottle/cloud-in-a-bottle/)**
   - Cada app en su contenedor con su carpeta de datos separada. Declárela con `cloudinabottle.toml` en la raíz del repo.
   - Mínimo: `[app] name + version`, `[runtime.container] image="Dockerfile" port=8080`, `[resources] memory_mb=128 cpu_cores=0.1`, `[data]` según tiers.
   - Puertos solo hacia adentro, proxy inverso (Caddy o Traefik) reparte por nombre. `[[ports]]` solo para no-HTTP; `host_port=0` auto-asigna en 9000-9999. `80` y `443` reservados.
   - CLI `bottle`: instale, actualice, vea logs y ciclo de vida. Guía: https://cloudinabottle.org/docs/operation/cli.html y spec https://cloudinabottle.org/docs/creating_an_app/manifest_spec.html
3. **HTTPS**
   - Certificado automático por app, renovación sola, redirección total a HTTPS.
4. **Respaldo (3 tiers)**
   - `app_data` (`BOTTLE_APP_DATA_DIR`): permanente. `app_temp_data` (`BOTTLE_APP_TEMP_DIR`): efímero. `app_archive` (`BOTTLE_APP_ARCHIVE_DIR`): voluminoso, local o S3. `sqlite=["main"]` crea `app_data/sqlite/main.db` (`BOTTLE_SQLITE_MAIN`).
   - Backup incluye permanente + temporal, excluye archive y su propio directorio. Copia diaria y prueba mensual de restauración.

## Output Contract

Entregue: app publicada con HTTPS, dónde viven sus datos y fecha del último respaldo probado.

## Anexo - Referencias oficiales

Usted publica de a una app por vez y verifica con `docker ps` y `curl -k -I`.

| Fuente | URL | Uso |
|---|---|---|
| Docker docs | https://docs.docker.com/ | Compose, volumes, networks y healthcheck |
| Caddy docs | https://caddyserver.com/docs/ | `reverse_proxy`, TLS automatico y Caddyfile |
| awesome-selfhosted | https://github.com/awesome-selfhosted/awesome-selfhosted | Catalogo de 20 apps con Compose oficial |
| kernel.org (cgroups y namespaces) | https://www.kernel.org/doc/html/latest/ | Base de aislamiento que usa Docker |
| Microsoft Learn DNS | https://learn.microsoft.com/windows-server/networking/dns/dns-top | Wildcard DNS y verificacion con `nslookup` |

Usted cifra respaldos con restic o borg y prueba restore de 1 archivo al mes.
