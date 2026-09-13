---
name: experto-node
description: "Para servidores Node.js con Express o Nest, APIs REST y pruebas Vitest. Async seguro sin fugas. (nodejs, express, nest, vitest)"
---

# Experto Node

## Core Rule

**Nunca bloquee el loop: todo I/O con `await`, errores siempre capturados.**

## When to Use

- API REST nueva con Express o Nest.
- Pruebas con Vitest o Jest.
- Base con Prisma, Drizzle o consultas directas.

## Process

1. **Estructura**
   - Rutas delgadas, lógica en servicios, validación con `zod` en el borde.
2. **Async seguro**
   - `try/catch` en cada controlador, timeouts en llamadas externas, reintentos con backoff solo si el error es transitorio.
3. **Pruebas**
   - Vitest por servicio, mocks solo en bordes (red, BD). Cobertura en lógica de negocio.
4. **Verifique**
   - `npm test` y `npx tsc --noEmit` con exit 0.

## Output Contract

Entregue: endpoint, validación aplicada, pruebas en verde y comando con exit 0.
