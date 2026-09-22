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

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- TypeScript Handbook strict: https://www.typescriptlang.org/docs/handbook/2/basic-types.html
- tsconfig strict y noUncheckedIndexedAccess: https://www.typescriptlang.org/tsconfig/
- React TypeScript Cheatsheet: https://react-typescript-cheatsheet.netlify.app/
- Next.js TypeScript: https://nextjs.org/docs/app/building-your-application/configuring/typescript
- Zod validacion de bordes: https://zod.dev/

Repos famosos:

- https://github.com/microsoft/TypeScript
- https://github.com/vercel/next.js
- https://github.com/colinhacks/zod

Checklist:

- [ ] strict true y noUncheckedIndexedAccess true en tsconfig.
- [ ] Cero any implicito. Todo parametro y retorno con tipo.
- [ ] Bordes de API validados con zod, nunca as any.
- [ ] null y undefined controlados con if, sin operador !.
- [ ] npx tsc --noEmit con exit 0 antes de declarar listo.
- [ ] Props de componentes con interface Readonly y nombres claros.
