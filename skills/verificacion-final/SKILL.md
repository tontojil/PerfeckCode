---
name: verificacion-final
description: "Para usar antes de declarar listo, arreglado o aprobado, o antes de un commit/PR. Exige evidencia fresca de verificación. (verification, done, commit)"
---

# Verification Before Completion

## Core Rule

**Never claim success without fresh verification output.**

## Required Gate

Before any completion claim:

1. Identify which command proves the claim.
2. Run it now (fresh run, not historical output).
3. Check exit code + failures + warnings.
4. Report evidence.
5. Only then state completion.

## Claim → Required Evidence

- "Tests pass" → full test command output
- "Build is OK" → build output with exit 0
- "Bug fixed" → reproduction no longer fails + targeted test passes
- "Ready to PR" → lint/tests/build (as requested by project)

## Comando por stack (no adivines, usa el del proyecto)

| Stack | Comando típico | Alternativa |
|---|---|---|
| Node/npm | `npm test -- --run` / `npm run build` | `pnpm test`, `bun test`, `npx tsc --noEmit` |
| Python | `pytest -q` | `uv run pytest -q` |
| Django | `python manage.py test` | `pytest -q` si hay pytest-django |
| Go | `go test ./...` | `go vet ./...` |
| Rust | `cargo test` | `cargo clippy` |
| .NET | `dotnet test` | `dotnet build` |
| Java/Gradle | `./gradlew test` | `./gradlew build` |

Si el proyecto tiene otro comando en `package.json` / `README` / `CLAUDE.md`, ese manda.
Warnings cuentan como fail si el proyecto usa `--strict` / `--deny-warnings`. Si no, reportalos igual.

## Formato de salida

Use:

- **Reclamo**
- **Comando ejecutado**
- **Resumen del resultado**
- **Fragmento de evidencia**
- **Estado final**: pass / fail / partial

## Ejemplo de evidencia real pass / fail con exit 0

No declare listo sin este bloque completo. La salida debe ser de una corrida fresca, no de memoria ni de una corrida anterior.

Ejemplo pass:

```text
Reclamo: Tests pasan en API de facturación.
Comando ejecutado: npm test -- --run (2026-10-15, commit a3f9c1d)
Resumen: 48 passed, 0 failed, duración 12,4 s.
Evidencia:
  Test Files  6 passed (6)
       Tests  48 passed (48)
    Exit code: 0
Estado final: pass
```

Ejemplo fail:

```text
Reclamo: Build listo para PR.
Comando ejecutado: npm run build (2026-10-15, commit a3f9c1d)
Resumen: 1 error en TypeScript, build detenido.
Evidencia:
  src/invoice.ts(42,7): error TS2322: Type 'string' is not assignable to type 'number'.
    Exit code: 1
Estado final: fail - corregir tipo en invoice.ts, reejecutar build, responsable: quien implementa.
```

Reglas de este ejemplo:

- Incluya siempre comando exacto, fecha o commit y exit code verificado con `echo $?`.
- En caso de pass, muestre conteo de pruebas y duración.
- En caso de fail, copie el mensaje exacto de error y la línea que falla.
- Nunca resuma sin fragmento de evidencia.

## Umbrales de coverage

- Si el proyecto define umbral en `package.json`, `pyproject.toml`, `coveragerc` o `CLAUDE.md`, ese valor es obligatorio.
- Si no hay umbral definido, use como referencia mínima: líneas 80 %, ramas 70 %. Registre que es referencia, no regla del proyecto.
- Comando típico por stack:
  - JS/TS: `npx vitest run --coverage` o `npm test -- --coverage`
  - Python: `pytest -q --cov=src --cov-report=term --cov-fail-under=80`
- Si el coverage queda bajo el umbral, el estado es fail aunque los tests pasen. Reporte archivo y porcentaje que falla.
- Adjunte tabla de coverage en la evidencia, no solo el porcentaje global.

## Manejo de flaky tests

- Un test que falla de forma intermitente nunca se marca como pass directo.
- Procedimiento:
  1. Registre el fallo con log o trace completo.
  2. Reejecute el test aislado 3 veces: `pytest -q tests/test_invoice.py -k test_caso --count=3` o `npx vitest run test_caso -t "nombre" --retry=3`.
  3. Si pasa 3/3, marque como partial y abra tarea de seguimiento con causa probable (tiempo, red, orden de ejecución).
  4. Si falla 1/3 o más, marque como fail y bloquee el PR.
- Para E2E use retries configurados en el proyecto (por ejemplo Playwright `retries: 2` en CI) y adjunte reporte HTML o trace.
- Nunca use `--retry` para ocultar un fallo real sin registrarlo.

## Repos faltantes y qué verificar antes de afirmar

Antes de declarar listo, confirme que revisó estos repos o fuentes del proyecto:

- [ ] Comando oficial en `package.json`, `README` o `CLAUDE.md`. Si no existe, indíquelo como faltante.
- [ ] Configuración de CI en `.github/workflows/`. Si no hay CI, la verificación local es la única evidencia.
- [ ] Configuración de coverage y lint (`eslint.config.js`, `pyproject.toml`, `.coveragerc`).
- [ ] Si falta alguno, reporte `partial` con la lista de faltantes y no afirme cobertura completa.

## Referencias oficiales y repositorios famosos

1. Pytest docs (fixtures, parametrize, exit codes, reportes): https://docs.pytest.org/en/stable/
2. Vitest guide (run, coverage, UI, CI): https://vitest.dev/guide/
3. Playwright test retries y reporters (repetibilidad E2E): https://playwright.dev/docs/test-retries
4. GitHub Actions docs (gates CI, environments, artefactos): https://docs.github.com/en/actions

El comando del proyecto en `package.json`, `README` o `CLAUDE.md` prevalece sobre la tabla general.

### Checklist aplicable antes de declarar listo

- [ ] Comando fresco recien corrido con exit 0, sin reusar salida historica, con commit y fecha registrados.
- [ ] Reclamo mapeado a evidencia: tests pasan con salida completa, build OK, bug con reproduccion que ya no falla mas test dirigido.
- [ ] Warnings revisados, si el proyecto usa `--strict` cuentan como fallo, si no se reportan igual.
- [ ] Suite afectada mas regresion adyacente en verde, `trace` o log adjunto si hubo fallo intermitente.
- [ ] Estado final explicito pass, fail o partial con proximo paso y dueno, nunca listo sin evidencia.
