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

1. **Dominio y SSL**
   - Dominio apuntado por DNS, certificado Let's Encrypt vigente, todo en `https://`.
2. **Pase a producción**
   - Credenciales reales solo en servidor, si cobra haga prueba real de bajo monto reembolsada, monitoreo de errores la primera semana.
   - Camino propio: su servidor con Docker y proxy con candado automático, apps separadas por nombre. Ver skill `nube-propia`.
3. **Apps móviles**
   - Versión y firma correctas, prueba interna primero, subida gradual y plan de arreglo rápido.
4. **Verifique**
   - Página abre con candado, pago de prueba real OK, rollback probado.

## Output Contract

Entregue: URL pública verificada, prueba real exitosa y cómo volver atrás.
