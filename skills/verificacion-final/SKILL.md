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

| Stack | Comando tipico | Alternativa |
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
