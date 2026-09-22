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
