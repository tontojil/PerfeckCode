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

## Output Format

Use:

- **Claim**
- **Command run**
- **Result summary**
- **Evidence snippet**
- **Final status**: pass / fail / partial

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
