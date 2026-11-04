---
name: postgres-produccion
description: "Para PostgreSQL en producción: modelo, índices, consultas rápidas y respaldo. Sin N+1. (postgres, sql, base-de-datos)"
---

# Postgres Producción

## Core Rule

**Toda consulta lenta se explica con `EXPLAIN` antes de tocarla.**

## When to Use

- Tablas nuevas, llaves y relaciones.
- Consulta lenta o N+1 en cualquier lenguaje.
- Respaldo y recuperación.

## Process

1. **Modele**
   - Clave primaria siempre, foráneas con índice, únicos donde el negocio lo exige.
2. **Acelere**
   - `EXPLAIN ANALYZE`, índice en columnas de filtro y join, jamás `SELECT *` en producción.
   - N+1 se elimina con join o carga agrupada, nunca con más consultas en loop.
3. **Transacciones**
   - Folios y stock con `SELECT ... FOR UPDATE`. Corta y con commit rápido.
4. **Respalde**
   - Respaldo diario probado: restaurar en copia y verificar con exit 0.

## Output Contract

Entregue: `EXPLAIN` antes y después, índice creado y tiempo medido.

## Referencias oficiales y repositorios famosos

1. PostgreSQL Documentation current (modelado, MVCC, mantenimiento): https://www.postgresql.org/docs/current/
2. Using EXPLAIN (planes, BUFFERS, Index Scan vs Seq Scan): https://www.postgresql.org/docs/current/using-explain.html
3. pg_stat_statements (top queries, tiempos, llamadas): https://www.postgresql.org/docs/current/pgstatstatements.html
4. Awesome Postgres curaduria (herramientas, extensiones, monitoreo): https://github.com/dhamaniasad/awesome-postgres

La documentacion oficial prevalece. Toda consulta lenta se explica antes de tocarla.

### Checklist aplicable en produccion

- [ ] `EXPLAIN (ANALYZE, BUFFERS)` en replica antes de crear indice, verifico `Index Scan` y tiempo P95.
- [ ] Clave primaria siempre, foraneas con indice, unicos donde el negocio exige, sin `SELECT *`.
- [ ] N+1 eliminado con join o carga agrupada, conteo de queries por request medido antes y despues.
- [ ] Transacciones cortas con `SELECT ... FOR UPDATE` solo para folios y stock, commit rapido.
- [ ] Respaldo diario con restauracion probada en copia y exit 0, `VACUUM` y bloat revisados, pool dimensionado.

## Modelo base con SQL real

Ejemplo mínimo para producción con clave primaria, foránea e índices:

```sql
-- Tabla base: siempre con PK UUID o bigint generado.
CREATE TABLE clientes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rut TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla dependiente: FK con índice explícito para joins y deletes rápidos.
CREATE TABLE pedidos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES clientes (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  folio TEXT UNIQUE NOT NULL,
  total_clp INTEGER NOT NULL CHECK (total_clp >= 0),
  estado TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'pagado', 'anulado')),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para filtro y join. La FK no crea índice sola, se crea manual.
CREATE INDEX idx_pedidos_cliente_id ON pedidos (cliente_id);
CREATE INDEX idx_pedidos_estado_creado ON pedidos (estado, creado_en DESC);
CREATE INDEX idx_clientes_email ON clientes (email);
```

Verificación esperada:

```bash
psql "$DATABASE_URL" -c "\d clientes" && psql "$DATABASE_URL" -c "\d pedidos"
```

Salida esperada:

```text
Indexes:
    "clientes_pkey" PRIMARY KEY, btree (id)
    "clientes_email_key" UNIQUE CONSTRAINT, btree (email)
"pedidos_pkey" PRIMARY KEY, btree (id)
"idx_pedidos_cliente_id" btree (cliente_id)
```

## EXPLAIN ANALYZE antes y después de índice

1. Consulta objetivo sin `SELECT *`:

```sql
EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT id, folio, total_clp
FROM pedidos
WHERE estado = 'pagado'
ORDER BY creado_en DESC
LIMIT 50;
```

Salida esperada antes del índice (caso lento):

```text
Limit  ->  Sort  ->  Seq Scan on pedidos
  Filter: (estado = 'pagado'::text)
  Rows Removed by Filter: 95000
  Buffers shared hit=1200
  Execution Time: 85.412 ms
```

2. Crear índice y volver a medir:

```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_estado_creado
  ON pedidos (estado, creado_en DESC);

EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT id, folio, total_clp
FROM pedidos
WHERE estado = 'pagado'
ORDER BY creado_en DESC
LIMIT 50;
```

Salida esperada después:

```text
Limit  ->  Index Scan using idx_pedidos_estado_creado on pedidos
  Index Cond: (estado = 'pagado'::text)
  Buffers shared hit=45
  Execution Time: 1.873 ms
```

Regla: use `CREATE INDEX CONCURRENTLY` en producción para no bloquear escrituras. Mida en réplica primero cuando sea posible.

## Migración versionada

Estructura recomendada, una migración = un cambio, reversible:

```text
migrations/
  001_crea_clientes_pedidos.sql
  002_agrega_idx_pedidos_estado.sql
```

Ejemplo `002_agrega_idx_pedidos_estado.sql`:

```sql
-- migrate:up
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pedidos_estado_creado
  ON pedidos (estado, creado_en DESC);

-- migrate:down
DROP INDEX CONCURRENTLY IF EXISTS idx_pedidos_estado_creado;
```

Comando con salida esperada:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/002_agrega_idx_pedidos_estado.sql && echo "OK migrate up exit=$?"
```

Salida esperada:

```text
CREATE INDEX
OK migrate up exit=0
```

Registre cada migración aplicada en tabla `schema_migrations(version TEXT PRIMARY KEY, aplicado_en TIMESTAMPTZ DEFAULT now())`.

## Respaldo con pg_dump y restore verificado

Respaldo diario en formato custom, con compresión:

```bash
pg_dump --format=custom --compress=9 --file="/respaldos/app_$(date +%F).dump" --dbname="$DATABASE_URL" && ls -lh "/respaldos/app_$(date +%F).dump"
```

Salida esperada:

```text
pg_dump: saving database definition
-rw-r--r-- 1 postgres postgres 184M ... /respaldos/app_2026-10-15.dump
```

Restauración probada en base copia, nunca directo sobre producción:

```bash
createdb app_restore_test && pg_restore --dbname="postgresql://localhost/app_restore_test" --jobs=4 "/respaldos/app_2026-10-15.dump" && psql "postgresql://localhost/app_restore_test" -c "SELECT count(*) FROM pedidos;" && echo "restore exit=$?"
```

Salida esperada:

```text
pg_restore: implied data-only restore
SELECT 125340
restore exit=0
```

Conserve 7 respaldos diarios + 4 semanales. Verifique restore con `exit 0` y conteo de tablas críticas.

## VACUUM y mantenimiento

```sql
-- Limpieza manual para tabla con muchas actualizaciones.
VACUUM (ANALYZE, VERBOSE) pedidos;

-- Revisar bloat y última ejecución de autovacuum.
SELECT relname, last_vacuum, last_autovacuum, last_analyze, n_dead_tup
FROM pg_stat_all_tables
WHERE relname IN ('clientes', 'pedidos');
```

Salida esperada:

```text
VACUUM
 relname  | last_autovacuum | n_dead_tup
 pedidos  | 2026-10-15 06:00:12+00 | 120
(1 row)
```

No desactive autovacuum en producción. Programe `VACUUM ANALYZE` después de cargas masivas y revise `n_dead_tup` si una consulta se degrada sin cambio de plan.

## Conexiones con pool

Dimensionamiento base: `pool = (núcleos CPU x 2) + discos`. Para API con 4 vCPU, pool de aplicación 10-20 por instancia, más PgBouncer en modo transaction para escalar.

```bash
psql "$DATABASE_URL" -c "SHOW max_connections; SELECT count(*) AS activas FROM pg_stat_activity;"
```

Salida esperada:

```text
 max_connections
 100
 activas
 18
```

Buenas prácticas:

```text
DATABASE_URL="postgresql://app:***@localhost:6432/app?pool_size=20&statement_timeout=5000"
```

- `statement_timeout = 5s` en app, `idle_in_transaction_session_timeout = 30s`.
- Un pool por servicio, cierre explícito en serverless.
- Monitoree `pg_stat_activity` y descarte `idle in transaction` permanente.

## Referencias adicionales

5. Wiki de PostgreSQL (afinamiento, mantenimiento, recetas): https://wiki.postgresql.org/
6. Código fuente oficial postgres/postgres (comportamiento real, changelog): https://github.com/postgres/postgres
7. Awesome Postgres, lista curada alternativa: https://github.com/dhamaniasad/awesome-postgres

La documentación oficial en https://www.postgresql.org/docs/current/ prevalece sobre blogs y sobre esta skill.

## Checklist de producción

Antes de declarar listo:

- [ ] `CREATE TABLE` revisado: PK siempre, FK con `ON DELETE` explícito e índice propio.
- [ ] `EXPLAIN (ANALYZE, BUFFERS)` antes y después, con `Index Scan` y tiempo P95 menor.
- [ ] Índice creado con `CONCURRENTLY` fuera de horario pico, sin bloqueo de escrituras.
- [ ] Migración versionada en `migrations/` con `up/down`, aplicada con `ON_ERROR_STOP=1` y `exit 0`.
- [ ] `pg_dump -Fc` diario + `pg_restore` probado en base copia con conteo verificado.
- [ ] `VACUUM ANALYZE` y `pg_stat_all_tables.n_dead_tup` revisados tras carga masiva.
- [ ] Pool dimensionado, `statement_timeout` configurado, sin `idle in transaction` colgado.
- [ ] Sin `SELECT *`, sin N+1, conteo de queries por request medido antes y después.
