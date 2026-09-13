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
2. **Apps**
   - Cada app en su contenedor con su carpeta de datos separada.
   - Puertos solo hacia adentro, proxy inverso (Caddy o Traefik) reparte por nombre.
3. **HTTPS**
   - Certificado automático por app, renovación sola, redirección total a HTTPS.
4. **Respaldo**
   - Datos permanentes aparte de temporales, copia diaria y prueba mensual de restauración.

## Output Contract

Entregue: app publicada con HTTPS, dónde viven sus datos y fecha del último respaldo probado.
