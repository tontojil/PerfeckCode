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

## Referencias oficiales y repositorios famosos

1. Node.js API docs (event loop, async, workers, timers): https://nodejs.org/docs/latest/api/
2. Express 5 docs (routing, middleware, manejo de errores): https://expressjs.com/
3. NestJS docs (modulos, providers, pipes, interceptors): https://docs.nestjs.com/
4. Vitest guide (test, mocks, coverage): https://vitest.dev/guide/
5. Awesome Node.js curaduria sindresorhus (patrones, seguridad, rendimiento): https://github.com/sindresorhus/awesome-nodejs

La documentacion oficial prevalece. Todo I/O con `await`, errores siempre capturados, validacion con `zod` en el borde.

### Checklist aplicable por endpoint

- [ ] Rutas delgadas y servicios con logica, `zod` valida body, query y params con 422 uniforme.
- [ ] `try/catch` en controladores, timeouts en llamadas externas, reintentos con backoff solo en transitorios.
- [ ] Vitest por servicio con mocks solo en bordes (red, BD), cobertura en logica de negocio.
- [ ] `npm test` y `npx tsc --noEmit` con exit 0, sin bloquear event loop, pool DB dimensionado.
- [ ] Sin secretos en codigo, logs con `request_id`, P95 medido en lectura y escritura.
