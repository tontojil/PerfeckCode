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

## Version de Node.js

Requisito: Node.js 20 LTS. Verifique con:

```bash
node --version
# v20.11.0 (o superior dentro de la linea 20.x)
npm --version
# 10.x
```

Si el proyecto usa nvm, fije la version en `.nvmrc` con `20`.

## Estructura de proyecto

### Express (TypeScript)

```text
src/
  app.ts            # crea la app Express, middlewares globales
  server.ts         # solo listen(), para testear app sin levantar puerto
  routes/
    users.routes.ts # solo routing, sin logica
  controllers/
    users.controller.ts # try/catch, status codes, sin acceso directo a BD
  services/
    users.service.ts    # logica de negocio
  schemas/
    users.schema.ts     # validacion zod en el borde
  middlewares/
    validate.ts         # middleware generico zod
    error-handler.ts    # manejo centralizado de errores
    request-id.ts       # asigna request_id para logs
tests/
  users.test.ts
```

### NestJS

```text
src/
  main.ts
  app.module.ts
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    dto/
      create-user.dto.ts  # validacion con class-validator o zod
test/
  users.e2e-spec.ts
```

Regla: rutas delgadas, logica en servicios, validacion en el borde.

## Ejemplo completo Express con validacion zod

`src/schemas/users.schema.ts`:

```ts
import { z } from "zod";

// Validacion en el borde: body, query y params.
export const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150).optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

`src/middlewares/validate.ts`:

```ts
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(422).json({
        error: "validation_error",
        details: result.error.flatten(),
      });
    }
    req.body = result.data;
    next();
  };
}
```

`src/services/users.service.ts`:

```ts
import type { CreateUserInput } from "../schemas/users.schema.js";

export type User = { id: string } & CreateUserInput;

export class UsersService {
  private users: User[] = [];

  async create(input: CreateUserInput): Promise<User> {
    // Todo I/O con await. Aqui simulado en memoria.
    const user: User = { id: crypto.randomUUID(), ...input };
    this.users.push(user);
    return user;
  }

  async list(): Promise<User[]> {
    return this.users;
  }
}
```

`src/controllers/users.controller.ts`:

```ts
import type { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users.service.js";

const service = new UsersService();

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await service.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function listUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await service.list();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}
```

`src/app.ts`:

```ts
import express from "express";
import { CreateUserSchema } from "./schemas/users.schema.js";
import { validateBody } from "./middlewares/validate.js";
import { createUser, listUsers } from "./controllers/users.controller.js";
import { errorHandler } from "./middlewares/error-handler.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
  app.get("/users", listUsers);
  app.post("/users", validateBody(CreateUserSchema), createUser);

  app.use(errorHandler);
  return app;
}
```

`src/server.ts`:

```ts
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`Servidor en puerto ${port}`);
});
```

## Ejemplo Nest con controller/service

`src/users/dto/create-user.dto.ts`:

```ts
import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}
```

`src/users/users.service.ts`:

```ts
import { Injectable } from "@nestjs/common";
import type { CreateUserDto } from "./dto/create-user.dto.js";

type User = { id: string } & CreateUserDto;

@Injectable()
export class UsersService {
  private users: User[] = [];

  async create(input: CreateUserDto): Promise<User> {
    const user: User = { id: crypto.randomUUID(), ...input };
    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}
```

`src/users/users.controller.ts`:

```ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { CreateUserDto } from "./dto/create-user.dto.js";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
```

Nota: active `ValidationPipe` global en `main.ts` para validar el DTO y responder 400/422 uniforme.

## Ejemplo Vitest con supertest

`tests/users.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

describe("POST /users", () => {
  it("crea un usuario valido (201)", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Ana Lopez", email: "ana@example.com" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Ana Lopez" });
    expect(res.body.id).toBeDefined();
  });

  it("rechaza email invalido (422)", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Ana", email: "no-es-email" });

    expect(res.status).toBe(422);
    expect(res.body.error).toBe("validation_error");
  });
});
```

Dependencias para este ejemplo: `vitest`, `supertest`, `@types/supertest` (solo dev).

## Comandos

Instalacion reproducible en CI (requiere `package-lock.json`):

```bash
npm ci
```

Verificacion minima antes de declarar listo:

```bash
npm test
npx tsc --noEmit
```

Salida esperada de `npm test` (ejemplo Vitest):

```text
 RUN  v2.1.0 /mi-proyecto

 ✓ tests/users.test.ts (2 tests) 45ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  10:00:00
   Duration  1.02s
```

Criterio: exit 0 en ambos comandos. Si `npm test` falla, no declare listo.

## Referencias

Documentacion oficial (prevalece sobre cualquier ejemplo):

1. Node.js docs (event loop, async, workers, timers): https://nodejs.org/docs/
2. Express (routing, middleware, manejo de errores): https://expressjs.com/
3. NestJS docs (modulos, providers, pipes, interceptors): https://docs.nestjs.com/
4. Vitest guide (test, mocks, coverage): https://vitest.dev/

Repositorios de referencia:

1. Curaduria Awesome Node.js: https://github.com/sindresorhus/awesome-nodejs
2. Framework Express: https://github.com/expressjs/express
3. Framework Nest: https://github.com/nestjs/nest
