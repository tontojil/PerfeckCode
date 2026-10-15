---
name: publicacion-web
description: "Para publicar páginas y apps: dominio, SSL, hosting y tiendas de apps. De pruebas a real. (deploy, dominio, ssl, play-store)"
---

# Publicación Web

## Core Rule

**Producción = dominio real + candado SSL + credenciales reales. Sin excepciones.**

## When to Use

- Publicar página con dominio propio.
- Pasar app o tienda de pruebas a producción.
- Subir app a Play Store o App Store.

## Process

1. **Dominio y SSL con Let's Encrypt**
   - Dominio apuntado por DNS (registros A/AAAA o CNAME), propagación verificada con `dig` o `nslookup`.
   - Certificado Let's Encrypt vigente, todo en `https://` con redirección desde HTTP. Renovación automática.
   - Verifique con `curl -vI https://<dominio>` y `openssl s_client -connect <dominio>:443 -servername <dominio> | openssl x509 -noout -dates`.
2. **Servidor base: hardening SSH y firewall**
   - SSH solo con llave: `PermitRootLogin no`, `PasswordAuthentication no`, `AllowUsers deploy`. Valide con `sudo sshd -t` antes de recargar.
   - Firewall mínimo:
     ```
     sudo ufw default deny incoming
     sudo ufw default allow outgoing
     sudo ufw limit ssh
     sudo ufw allow 80,443/tcp
     sudo ufw enable
     ```
   - `fail2ban` para `sshd` y parches de seguridad automáticos. No publique sin esta capa.
3. **Pase a producción con Docker y HTTPS**
   - Camino propio: su servidor con Docker y proxy (Caddy o Traefik) con candado automático, apps separadas por nombre. Ver skill `nube-propia`.
   - Contenedor con tag fijo, red propia, `restart: unless-stopped`, `healthcheck`. Solo el proxy expone `80` y `443`. Secretos en variables de entorno con `chmod 600`, nunca en el repositorio.
   - Credenciales reales solo en servidor, si cobra haga prueba real de bajo monto reembolsada, monitoreo de errores la primera semana.
4. **Apps móviles**
   - Versión y firma correctas, prueba interna primero, subida gradual y plan de arreglo rápido.
5. **Verifique y deje rollback listo**
   - Página abre con candado, pago de prueba real OK, imagen Docker anterior etiquetada para rollback inmediato.

## Output Contract

Entregue: URL pública verificada, estado de firewall y certificado, prueba real exitosa y cómo volver atrás.

## Ejemplo mínimo con Caddy

`compose.yaml` mínimo con Caddy como proxy y certificado automático:

```yaml
services:
  proxy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
  app:
    image: mi-app:1.0.0
    restart: unless-stopped
    expose:
      - "3000"

volumes:
  caddy_data:
```

`Caddyfile`:

```text
mi-dominio.cl {
  reverse_proxy app:3000
}
```

Verifique con `curl -vI https://mi-dominio.cl` y `docker ps`.

## Anexo - Referencias oficiales

Usted no declara producción sin dominio real, candado SSL y rollback probado.

| Fuente | URL | Uso |
|---|---|---|
| Let's Encrypt docs | https://letsencrypt.org/docs/ | Emisión ACME, renovación y límites |
| Docker docs deploy | https://docs.docker.com/ | Publicación en su servidor con proxy y HTTPS |
| Docker Compose GitHub | https://github.com/docker/compose | Ejemplo `compose.yaml` con proxy Caddy, redes y reinicio |
| Caddy docs TLS | https://caddyserver.com/docs/caddyfile/directives/tls | Certificado automático y renovación |
| UFW manual | https://help.ubuntu.com/community/UFW | Firewall `deny incoming`, `limit ssh` |
| Microsoft Learn TLS y DNS | https://learn.microsoft.com/windows-server/networking/dns/dns-top | Dominio, DNS y certificado vigente |
| kernel.org networking | https://www.kernel.org/doc/html/latest/networking/ | Base TCP/TLS cuando depura handshake |

Usted verifica con `curl -vI https://<dominio>`, `ufw status verbose` y `docker ps`, y guarda evidencia de 200 con candado.
