---
name: typescript-estricto
description: "Para código TypeScript sin errores de tipos, Next.js y React. Exige strict, tipos explícitos y cero any. (typescript, types, nextjs)"
---

# TypeScript Estricto

## Core Rule

**Cero `any` implicito. Todo parametro y retorno lleva tipo. `strict: true` siempre.**

## When to Use

- Nuevo componente, API o funcion en TypeScript.
- Error `is of type unknown`, `possibly null`, build que falla en `tsc`.
- Proyecto Next.js o React con tipos rotos.

## Process

1. **Active estricto**
   - `tsconfig.json`: `"strict": true`, `"noUncheckedIndexedAccess": true`.
2. **Tipifique bordes**
   - Respuestas de API con `zod` o tipos literales, nunca `as any`.
   - `null` y `undefined` se controlan con `if`, no con `!`.
3. **Verifique**
   - `npx tsc --noEmit` con exit 0 antes de declarar listo.

## Output Contract

Entregue: archivo:linea del error de tipos, tipo agregado, y `tsc` con exit 0.
