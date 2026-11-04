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

   Use este `tsconfig.json` como base minima. No quite ninguna opcion sin justificar en el informe.

   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "lib": ["ES2022", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "moduleResolution": "bundler",
       "jsx": "preserve",
       "strict": true,
       "noUncheckedIndexedAccess": true,
       "exactOptionalPropertyTypes": true,
       "noFallthroughCasesInSwitch": true,
       "noImplicitOverride": true,
       "noPropertyAccessFromIndexSignature": true,
       "forceConsistentCasingInFileNames": true,
       "skipLibCheck": true,
       "isolatedModules": true,
       "esModuleInterop": true,
       "resolveJsonModule": true,
       "incremental": true
     },
     "include": ["src", "app", "components", "lib"],
     "exclude": ["node_modules", ".next", "dist"]
   }
   ```

   Reglas de cada opcion clave:

   - `strict`: activa `strictNullChecks`, `noImplicitAny` y demas controles estrictos.
   - `noUncheckedIndexedAccess`: el acceso por indice retorna `T | undefined` y obliga a controlar el caso ausente.
   - `exactOptionalPropertyTypes`: una propiedad opcional `edad?: number` no acepta `undefined` explicito salvo que se declare `edad?: number | undefined`.

2. **Tipifique bordes con zod y narrowing sin `any`**

   Valide toda respuesta externa con un esquema. Derive el tipo con `z.infer` y aplique narrowing con `if`, nunca con `as any`.

   ```typescript
   import { z } from "zod";

   // Esquema de borde para respuesta de API
   const UsuarioSchema = z.object({
     id: z.string().uuid(),
     nombre: z.string().min(1),
     edad: z.number().int().min(0).optional(),
     rol: z.enum(["admin", "editor", "lector"]),
   });

   // Tipo derivado del esquema, sin duplicar definiciones
   type Usuario = z.infer<typeof UsuarioSchema>;

   function obtenerSaludo(dato: unknown): string {
     // Narrowing con safeParse, sin any
     const resultado = UsuarioSchema.safeParse(dato);
     if (!resultado.success) {
       return "Dato invalido";
     }
     const usuario: Usuario = resultado.data;
     if (usuario.rol === "admin") {
       return `Hola ${usuario.nombre}, tiene acceso total.`;
     }
     return `Hola ${usuario.nombre}, rol: ${usuario.rol}.`;
   }
   ```

3. **Maneje `unknown` y `null` sin `!`**

   Prohibido el operador de afirmacion no nula `!`. Use guardas de tipo y control temprano.

   ```typescript
   function procesarEntrada(entrada: unknown): string {
     // Guarda para null y undefined
     if (entrada === null || entrada === undefined) {
       return "Sin valor";
     }
     // Guarda para objeto
     if (typeof entrada !== "object") {
       return "Tipo no soportado";
     }
     // Guarda para propiedad con narrowing seguro
     if (!("nombre" in entrada)) {
       return "Falta el nombre";
     }
     const nombre: unknown = entrada.nombre;
     if (typeof nombre !== "string" || nombre.length === 0) {
       return "Nombre invalido";
     }
     return `Hola ${nombre}`;
   }

   function primerElemento(lista: string[]): string {
     // Con noUncheckedIndexedAccess, lista[0] es string | undefined
     const primero: string | undefined = lista[0];
     if (primero === undefined) {
       return "Lista vacia";
     }
     return primero;
   }
   ```

4. **Verifique**

   Ejecute la verificacion antes de declarar la tarea como lista:

   ```powershell
   npx tsc --noEmit
   ```

   Salida esperada cuando el codigo esta correcto (sin errores, exit 0):

   ```text
   > npx tsc --noEmit

   (sin salida)
   Exit code: 0
   ```

   Salida esperada cuando hay un error de tipos (ejemplo):

   ```text
   src/usuario.ts(12,7): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
   ```

   En ese caso, corrija el tipo en `src/usuario.ts:12`, no agregue `any` ni `!`, y repita el comando hasta obtener exit 0.

## Output Contract

Entregue: archivo:linea del error de tipos, tipo agregado, y `tsc` con exit 0.

---

## Anexo 2026 - Referencias oficiales y checklist

Fuentes oficiales:

- Documentacion de TypeScript: https://www.typescriptlang.org/docs/
- Repositorio de TypeScript: https://github.com/microsoft/TypeScript
- Validacion de bordes con Zod: https://zod.dev/
- Opciones de tsconfig: https://www.typescriptlang.org/tsconfig/
- TypeScript en Next.js: https://nextjs.org/docs/app/building-your-application/configuring/typescript

Checklist:

- [ ] strict true, noUncheckedIndexedAccess true y exactOptionalPropertyTypes true en tsconfig.
- [ ] Cero any implicito. Todo parametro y retorno con tipo.
- [ ] Bordes de API validados con zod, nunca as any.
- [ ] null y undefined controlados con if, sin operador !.
- [ ] npx tsc --noEmit con exit 0 antes de declarar listo.
- [ ] Props de componentes con interface Readonly y nombres claros.
