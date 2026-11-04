---
name: diseno-api
description: Disena APIs REST con codigos de estado correctos, paginacion por cursor, errores con envelope, versionado y ejemplo OpenAPI 3.1. Utilizar al crear endpoints, revisar una API o refactorizar rutas. (RESTful APIs, pagination, versioning, HATEOAS)
---

# API Design

Diseno de APIs REST con enfasis en consistencia, escalabilidad y experiencia de desarrollo. Contrato primero con OpenAPI 3.1.

## Cuando usar

- Crear endpoints o recursos nuevos.
- Revisar el diseno de una API existente.
- Definir contratos de API para microservicios.
- Definir versionado, paginacion o estructura de respuesta y errores.

## Principios

### URLs

- Sustantivos en plural: `/users`, `/users/:id/orders`.
- Sin verbos en la URL. La accion la define el metodo HTTP.
- Maximo 3 niveles de anidamiento. Si se supera, evaluar un recurso raiz.
- Nombres en minusculas, con guiones: `/order-items`, no `/orderItems`.

### Metodos HTTP

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/users` | Listar con filtros y paginacion |
| `GET` | `/users/:id` | Obtener uno |
| `POST` | `/users` | Crear |
| `PUT` | `/users/:id` | Reemplazo completo |
| `PATCH` | `/users/:id` | Actualizacion parcial |
| `DELETE` | `/users/:id` | Eliminar (borrado logico) |

`PUT` exige el recurso completo. `PATCH` acepta campos parciales. `POST` criticos deben soportar `Idempotency-Key`.

### Codigos de estado

| Codigo | Uso |
|---|---|
| `200` | GET, PUT, PATCH exitoso |
| `201` | POST exitoso (con header `Location`) |
| `202` | Aceptado para proceso asincrono |
| `204` | DELETE exitoso (sin cuerpo) |
| `304` | No modificado (con `ETag` / `If-None-Match`) |
| `400` | Error de validacion del cliente |
| `401` | No autenticado |
| `403` | Autenticado sin permisos |
| `404` | Recurso no encontrado |
| `409` | Conflicto (duplicado, estado invalido) |
| `422` | Entidad no procesable (errores de validacion por campo) |
| `429` | Limite de peticiones excedido (con `Retry-After`) |
| `500` | Error interno (nunca exponer detalles) |

Reglas: un solo codigo por situacion, documentar cada codigo en OpenAPI, no usar `200` con error dentro del cuerpo.

### Envelope de respuesta y errores

Toda respuesta exitosa usa `data` + `meta`. Todo error usa `error` con codigo legible por maquina y `request_id` para trazabilidad.

Exito con lista:
```json
{
  "data": [{ "id": "usr_123", "email": "ana@example.com" }],
  "error": null,
  "meta": {
    "next_cursor": "eyJpZCI6InVzcl8xMjMifQ==",
    "prev_cursor": null,
    "limit": 20,
    "request_id": "req_abc123"
  }
}
```

Error:
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo email es obligatorio",
    "details": [{ "field": "email", "reason": "required" }],
    "request_id": "req_abc123"
  },
  "meta": null
}
```

Campos obligatorios del error: `code` (ENUM en MAYUSCULAS), `message` (humano, sin datos sensibles), `details` (arreglo por campo), `request_id`.

### Paginacion por cursor

- Paginar siempre las colecciones. Sin excepciones.
- Cursor para colecciones grandes o en tiempo real. Offset solo si el producto exige ir a la pagina N.
- Parametros: `?cursor=<opaco>&limit=20`. `limit` por defecto 20, maximo 100.
- El cursor es opaco (base64), nunca expone `OFFSET` ni IDs internos.
- Respuesta incluye `meta.next_cursor` y `meta.prev_cursor`. Si `next_cursor` es `null`, fin de la lista.
- Orden estable obligatorio: `ORDER BY created_at, id`.

Ejemplo:
```http
GET /v1/users?limit=20 HTTP/1.1
GET /v1/users?cursor=eyJpZCI6InVzcl8xMjMifQ==&limit=20 HTTP/1.1
```

Respuesta:
```json
{
  "data": [{ "id": "usr_124", "email": "luis@example.com" }],
  "error": null,
  "meta": { "next_cursor": "eyJpZCI6InVzcl8xMjQifQ==", "prev_cursor": "eyJpZCI6InVzcl8xMjMifQ==", "limit": 20, "request_id": "req_xyz789" }
}
```

### Versionado

- En la URL: `/v1/users`. Simple y visible para la mayoria de APIs.
- Alternativa en header si el cliente lo exige: `Accept: application/vnd.api.v2+json`.
- Politica N y N-1 durante 6 meses. Anunciar deprecacion con header `Sunset` y documentar ruta de migracion.
- Cambio rompiente (breaking change) siempre implica version nueva. Cambio compatible se mantiene en la misma version.

```http
Sunset: Sat, 01 Aug 2026 00:00:00 GMT
Deprecation: true
Link: <https://docs.example.com/migracion-v1-v2>; rel="successor-version"
```

### Filtrado, orden y busqueda

```http
GET /v1/users?status=active&role=admin     → filtros exactos
GET /v1/users?q=ana                       → busqueda de texto
GET /v1/users?sort=-created_at,name       → orden (- para descendente)
GET /v1/users?include=orders,profile      → recursos relacionados
GET /v1/users?fields=id,email,created_at  → proyeccion parcial
```

Validar con lista blanca los campos de `sort`, `fields` e `include`. Rechazar valores desconocidos con `400`.

### Rate limiting

Headers obligatorios en cada respuesta:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1623456789
Retry-After: 60
```

Documentar el limite por plan, el comportamiento ante `429` y la estrategia de reintento con backoff.

### Ejemplo OpenAPI 3.1 completo

Contrato minimo valido para una coleccion con paginacion por cursor y envelope de error:

```yaml
openapi: 3.1.0
info:
  title: Users API
  version: 1.0.0
  description: API de usuarios con paginacion por cursor y envelope uniforme.
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: Listar usuarios
      operationId: listUsers
      parameters:
        - $ref: '#/components/parameters/Cursor'
        - $ref: '#/components/parameters/Limit'
        - name: status
          in: query
          schema: { type: string, enum: [active, inactive] }
      responses:
        '200':
          description: Lista paginada
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
              example:
                data:
                  - { id: usr_123, email: ana@example.com, created_at: '2026-01-10T12:00:00Z' }
                error: null
                meta: { next_cursor: eyJpZCI6InVzcl8xMjMifQ==, prev_cursor: null, limit: 20, request_id: req_abc123 }
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimited'
    post:
      summary: Crear usuario
      operationId: createUser
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
      responses:
        '201':
          description: Usuario creado
          headers:
            Location:
              schema: { type: string }
              description: URL del recurso creado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '422':
          $ref: '#/components/responses/UnprocessableEntity'
components:
  parameters:
    Cursor:
      name: cursor
      in: query
      schema: { type: string }
      description: Cursor opaco devuelto en meta.next_cursor.
    Limit:
      name: limit
      in: query
      schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
    IdempotencyKey:
      name: Idempotency-Key
      in: header
      required: false
      schema: { type: string, format: uuid }
  schemas:
    User:
      type: object
      required: [id, email, created_at]
      properties:
        id: { type: string, example: usr_123 }
        email: { type: string, format: email }
        created_at: { type: string, format: date-time }
    UserListResponse:
      type: object
      required: [data, meta]
      properties:
        data: { type: array, items: { $ref: '#/components/schemas/User' } }
        error: { type: 'null' }
        meta:
          type: object
          required: [limit, request_id]
          properties:
            next_cursor: { type: [string, 'null'] }
            prev_cursor: { type: [string, 'null'] }
            limit: { type: integer }
            request_id: { type: string }
    UserResponse:
      type: object
      required: [data]
      properties:
        data: { $ref: '#/components/schemas/User' }
        error: { type: 'null' }
        meta: { type: object, additionalProperties: true }
    ErrorEnvelope:
      type: object
      required: [data, error]
      properties:
        data: { type: 'null' }
        error:
          type: object
          required: [code, message, request_id]
          properties:
            code: { type: string, example: VALIDATION_ERROR }
            message: { type: string }
            request_id: { type: string }
            details:
              type: array
              items:
                type: object
                properties:
                  field: { type: string }
                  reason: { type: string }
        meta: { type: 'null' }
    UserCreate:
      type: object
      required: [email]
      properties:
        email: { type: string, format: email }
  responses:
    BadRequest:
      description: Solicitud invalida
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorEnvelope' }
    Unauthorized:
      description: No autenticado
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorEnvelope' }
    UnprocessableEntity:
      description: Error de validacion por campo
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorEnvelope' }
    RateLimited:
      description: Limite excedido
      headers:
        Retry-After: { schema: { type: integer } }
      content:
        application/json:
          schema: { $ref: '#/components/schemas/ErrorEnvelope' }
```

## Referencias oficiales

1. Especificacion OpenAPI (contratos, schemas, versionado): https://spec.openapis.org/
2. Guia oficial Learn OpenAPI (tutoriales y ejemplos): https://learn.openapis.org/
3. Repositorio OpenAPI Specification (fuente, propuestas y changelog): https://github.com/OAI/OpenAPI-Specification

La documentacion oficial prevalece sobre esta skill si existe diferencia.

### Checklist aplicable antes de publicar un endpoint

- [ ] OpenAPI 3.1 valido con ejemplo real de request y response por codigo (200, 400, 401, 404, 429).
- [ ] Envelope uniforme `data/error/meta` con `code` legible por maquina y `request_id`.
- [ ] Paginacion por cursor definida (`cursor` + `limit<=100`, `next_cursor`/`prev_cursor`); offset solo si el producto exige pagina N.
- [ ] Versionado `/v1/` o header `Accept`, politica N y N-1 por 6 meses con header `Sunset` en deprecacion.
- [ ] `Idempotency-Key` en POST criticos, `ETag` en GET pesados, validacion con lista blanca en el borde.
- [ ] Rate limit documentado con `429` y `Retry-After`.
