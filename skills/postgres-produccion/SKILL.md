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
