---
name: migraciones-base-datos
description: Migraciones de base de datos seguras, sin caidas, compatibles hacia atras y con rollback listo. Utilizar al escribir migraciones, revisar el esquema o planificar un backfill. (database migration, zero-downtime, rollback-ready)
---

# Database Migrations

Migraciones seguras con enfasis en zero-downtime y rollback verificado.

## Cuando usar

- Escribir o revisar migraciones.
- Agregar columnas, tablas o indices.
- Modificar restricciones en produccion.
- Planificar backfills de datos.
- Evaluar riesgos de bloqueo o rollback.

## Reglas de oro

1. **Toda migracion debe ser reversible**. Si existe `up`, existe `down` probado.
2. **Nunca bloquear la tabla mas de 2 segundos**. Usar estrategias sin bloqueo.
3. **Expandir y contraer**: primero agregar, despues migrar datos, al final retirar lo antiguo.
4. **Backfill por lotes**. Nunca un solo UPDATE sobre millones de filas.

## Migracion zero-downtime con expand-contract

Patron en 3 despliegues. Cada despliegue es compatible hacia atras y hacia adelante.

Fase 1 - Expandir (despliegue 1):
- Agregar la estructura nueva sin romper la actual. Columna anulable, tabla nueva o columna paralela.
- La aplicacion escribe en ambas estructuras (doble escritura) y sigue leyendo la antigua.

Fase 2 - Migrar (despliegue 2):
- Backfill historico por lotes de 1000 a 10000 filas, con pausas.
- Cambiar las lecturas a la estructura nueva. Mantener doble escritura por seguridad.

Fase 3 - Contraer (despliegue 3):
- Detener la escritura en la estructura antigua.
- Eliminar columna o tabla antigua cuando ya no recibe trafico.
- Agregar restricciones finales (`NOT NULL`, `CHECK`, `FOREIGN KEY`) solo cuando todos los datos son validos.

Ejemplo de secuencia para renombrar `users.name` a `users.full_name`:

1. Despliegue 1: `ADD COLUMN full_name`, doble escritura `name` + `full_name`.
2. Despliegue 2: backfill por lotes, lecturas desde `full_name`.
3. Despliegue 3: dejar de escribir `name`, luego `DROP COLUMN name`.

## Ejemplo SQL versionado

Estructura compatible con golang-migrate. Un archivo `up` y uno `down` por version, numeracion secuencial.

Archivos:
```
migrations/000001_add_status_to_users.up.sql
migrations/000001_add_status_to_users.down.sql
migrations/000002_backfill_status.up.sql
migrations/000002_backfill_status.down.sql
migrations/000003_set_status_not_null.up.sql
migrations/000003_set_status_not_null.down.sql
```

`000001_add_status_to_users.up.sql` (expandir, sin bloqueo):
```sql
-- Expandir: columna anulable con valor por defecto.
ALTER TABLE users ADD COLUMN status VARCHAR DEFAULT 'active';
```

`000001_add_status_to_users.down.sql` (rollback):
```sql
-- Rollback: retirar la columna si aun no hay dependencia.
ALTER TABLE users DROP COLUMN IF EXISTS status;
```

`000002_backfill_status.up.sql` (migrar por lotes):
```sql
-- Backfill por lotes. Ejecutar en lotes de 10000 desde el codigo o con pg_cron.
-- UPDATE users SET status = 'active' WHERE status IS NULL AND id > $1 ORDER BY id LIMIT 10000;
-- Repetir hasta que SELECT COUNT(*) FROM users WHERE status IS NULL = 0.
SELECT 1;
```

`000002_backfill_status.down.sql`:
```sql
-- El backfill es idempotente. No requiere revertir datos.
SELECT 1;
```

`000003_set_status_not_null.up.sql` (contraer):
```sql
-- Contraer: solo despues de verificar que no quedan NULL.
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
```

`000003_set_status_not_null.down.sql`:
```sql
ALTER TABLE users ALTER COLUMN status DROP NOT NULL;
```

Ejemplo de indice sin bloqueo y su rollback:

```sql
-- up: indice concurrente, no bloquea escrituras (PostgreSQL).
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);
```

```sql
-- down: eliminar indice de forma segura.
DROP INDEX CONCURRENTLY IF EXISTS idx_users_email;
```

En MySQL InnoDB usar `ALGORITHM=INPLACE, LOCK=NONE` para operaciones equivalentes.

## Patrones

### Agregar columna NOT NULL

Incorrecto:
```sql
ALTER TABLE users ADD COLUMN status VARCHAR NOT NULL;  -- bloquea toda la tabla
```

Correcto en 3 pasos:
```sql
-- Paso 1: anulable con defecto.
ALTER TABLE users ADD COLUMN status VARCHAR DEFAULT 'active';

-- Paso 2: backfill por lotes desde el codigo, no en una sola transaccion.
-- UPDATE users SET status = 'active' WHERE status IS NULL LIMIT 10000;

-- Paso 3: agregar NOT NULL en un despliegue posterior.
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
```

### Renombrar columna

```sql
-- Paso 1: agregar columna nueva.
ALTER TABLE users ADD COLUMN full_name VARCHAR;

-- Paso 2: escribir en ambas columnas desde la aplicacion.
-- Paso 3: backfill de datos historicos por lotes.
-- Paso 4: mover lecturas a la columna nueva.
-- Paso 5: eliminar columna antigua en un despliegue posterior.
ALTER TABLE users DROP COLUMN name;
```

### Agregar indice

```sql
-- CONCURRENTLY evita bloquear escrituras (PostgreSQL).
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);
```

### Eliminar columna o tabla

Incorrecto:
```sql
ALTER TABLE users DROP COLUMN old_field;  -- verificar que nadie la lee
```

Correcto:
1. Despliegue 1: dejar de escribir en la columna. La aplicacion ignora las lecturas.
2. Despliegue 2: eliminar la columna cuando ya no recibe trafico.

## Rollback

- Probar `down` en staging con copia anonimizada antes de cada despliegue.
- Medir el tiempo de `up` y `down`. El rollback debe completar en menos de 5 minutos.
- Definir responsable y criterio de rollback: tasa de error, bloqueo mayor a 2 segundos o validacion fallida.
- Nunca editar una migracion ya aplicada en produccion. Crear una migracion nueva que corrija.
- Para `CREATE INDEX CONCURRENTLY`, el rollback es `DROP INDEX CONCURRENTLY IF EXISTS`. Si el indice fallo a la mitad, queda como `INVALID` y se debe eliminar antes de reintentar.

Comandos de referencia con golang-migrate:
```bash
migrate -path migrations -database "$DATABASE_URL" up 1
migrate -path migrations -database "$DATABASE_URL" down 1
migrate -path migrations -database "$DATABASE_URL" version
```

## Validacion previa al despliegue

- Migracion `up` y `down` probadas en staging.
- `EXPLAIN` en consultas nuevas. Sin escaneos completos en tablas grandes.
- Restricciones validadas contra copia anonimizada de datos de produccion.
- Tiempo estimado basado en `ANALYZE` real de la tabla.

## Frameworks

| Framework | Anulable | Defecto | Indice concurrente | Rollback |
|---|---|---|---|---|
| **Prisma** | `?` en el tipo | `@default()` | No nativo | `prisma migrate diff` |
| **Django** | `null=True` | `default=` | `AddIndexConcurrently` | `migrate <app> <prev>` |
| **Laravel** | `->nullable()` | `->default()` | Manual (SQL directo) | `migrate:rollback` |
| **golang-migrate** | Tipo puntero `*string` | Defecto en SQL | SQL directo en `.up.sql` | Archivo `.down.sql` explicito |
| **Alembic** | `nullable=True` | `server_default=` | `postgresql_concurrently=True` | `alembic downgrade -1` |

## Referencias oficiales

1. Documentacion PostgreSQL (DDL, locks, CONCURRENTLY): https://www.postgresql.org/docs/current/
2. Repositorio golang-migrate (SQL versionado up/down): https://github.com/golang-migrate/migrate

La documentacion oficial prevalece. Nunca bloquear una tabla productiva mas de 2 segundos.

### Checklist aplicable antes de desplegar una migracion

- [ ] Migracion `up` y `down` probadas en staging con copia anonimizada y `EXPLAIN` en consultas nuevas.
- [ ] Estrategia expandir y contraer: agregar compatible, doble escritura, backfill por lotes de 10k, contraer en despliegue posterior.
- [ ] Indices con `CONCURRENTLY` en Postgres o `ALGORITHM=INPLACE, LOCK=NONE` en MySQL InnoDB.
- [ ] Tiempo estimado con `ANALYZE` real, rollback cronometrado menor a 5 minutos y responsable asignado.
- [ ] Sin `SELECT *`, sin `UPDATE` masivo sin `LIMIT`, restricciones FK y CHECK validadas contra datos reales.
