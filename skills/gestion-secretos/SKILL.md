---
name: gestion-secretos
description: "Para guardar claves y certificados sin fugas: vault, rotación y permisos. Nunca en git ni en el chat. (secretos, vault, claves)"
---

# Gestión de Secretos

## Core Rule

**Ninguna clave en código, git o chat. Producción en servidor, desarrollo en `.env` local no commiteado.**

## When to Use

- Guardar `.pfx`, API keys, tokens o contraseñas.
- Rotar o revocar una clave expuesta.
- Revisar si algo se filtró.

## Process

1. **Guarde**
   - Producción: vault o variables del servidor. Desarrollo: `.env` local jamás commiteado.
   - Permisos 0600, un secreto por uso, nombres sin el valor.
2. **Rote**
   - Cada 90 días o al sospechar fuga: cree nueva, cambie servidor, revoque vieja.
3. **Si se filtró**
   - Revoque de inmediato, genere nueva, revise logs de uso anormal.
4. **Verifique**
   - `git log` sin secretos, hook `secret-detect` del repo o `gitleaks`, exit 0.

## Output Contract

Entregue solo tipo de almacenamiento y fecha, nunca nombre de variable ni ruta exacta en el chat.
