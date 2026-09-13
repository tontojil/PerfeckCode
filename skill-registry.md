# Skill Registry — Claude Code

Catalogo central de skills para Claude Code. Las skills se auto-descubren desde
`~/.claude/skills/` (cada una con su `SKILL.md`). Esta tabla es la referencia rapida:
escanea triggers ANTES de codear y aplica la skill que calce.

- **Total skills:** 53
- **Fuente:** `~/.claude/skills/`
- **Invocacion:** Claude carga la skill por su `name` del frontmatter cuando el contexto calza.
- **Ultima sync:** 2026-09-12

---

## Engineering & DevOps

| Skill | Trigger |
|---|---|
| `diseno-api` | Disenar APIs RESTful: status codes, paginacion, versionado, HATEOAS. |
| `revision-codigo` | Revisar correctness/seguridad/perf/mantenibilidad antes de merge. |
| `revision-seguridad` | OWASP Top 10, secrets, injection, auth bypass sobre diffs/PRs. |
| `migraciones-base-datos` | Migraciones zero-downtime, rollback-ready. |
| `patrones-despliegue` | CI/CD, Docker, health checks, estrategias de rollback. |
| `experto-docker` | Multi-stage builds, compose, hardening de imagenes. |
| `acciones-github` | Workflows CI/CD, reusable workflows, matrix builds. |
| `pruebas-e2e` | Playwright, Page Object Model, integracion en CI. |
| `iniciacion-fuzzing` | AFL++, libFuzzer, ffuf, parameter discovery. |
| `constructor-mcp` | Crear servidores MCP en Python o TS para herramientas nuevas. |
| `api-claude` | Referencia API Claude: modelos, precios, streaming, caching. |

## Backend Languages

| Skill | Trigger |
|---|---|
| `patrones-diseno-python` | SOLID, composicion, dependency injection en Python. |
| `patrones-pruebas-python` | pytest, fixtures, mocking, TDD. |
| `experto-laravel` | Laravel 11+, Eloquent, Sanctum, Horizon, Livewire, Pest. |
| `patrones-django` | DRF, ORM, viewsets, signals. |
| `experto-go` | goroutines, channels, gRPC, microservicios. |
| `patrones-backend-dotnet` | ASP.NET Core, EF Core, Dapper, xUnit. |

## Mobile

| Skill | Trigger |
|---|---|
| `android-interfaz-compose` | Compose: state, navegacion, Material3. |
| `android-arquitectura-limpia` | Clean Arch MVVM, Hilt, repository pattern. |
| `swift` | SwiftUI, SwiftData, async/await, Actors. |
| `kotlin-corutinas-flujos` | Structured concurrency, Flow, StateFlow. |
| `pruebas-apps-moviles` | Espresso/XCTest, snapshot testing, CI. |
| `desarrollador-unity` | Unity 6 LTS, URP/HDRP, addressables. |

## Frontend & Animation

| Skill | Trigger |
|---|---|
| `tanstack-query` | TanStack Query v5: keys, caching, mutations, SSR. |
| `gsap-basico` | gsap.to/from/fromTo, easing, matchMedia. |
| `gsap-react` | useGSAP, gsap.context, cleanup. |
| `gsap-vue-svelte` | Integracion Vue/Svelte con lifecycle. |
| `gsap-linea-tiempo` | Sequencing, position parameter. |
| `gsap-animacion-scroll` | Scroll-linked, pinning, scrub. |
| `gsap-complementos` | ScrollTo, ScrollSmoother, Flip, Draggable, SplitText. |
| `gsap-rendimiento` | Transforms, 60fps, will-change. |
| `gsap-utilidades` | clamp, mapRange, random, snap. |

## Design (Stitch)

| Skill | Trigger |
|---|---|
| `buen-gusto-diseno` | Semantic Design System para Google Stitch, anti-UI generica. |
| `diseno-frontend` | Direccion estetica anti-generica para UI (referencia Anthropic). |
| `diseno-md` | REDIRECT a stitch-extraer-diseno. No usar directo. |
| `mejorar-prompt` | Ideas UI vagas -> prompts optimizados para Stitch. |
| `stitch-generar-diseno` | Generar pantallas desde texto/imagenes via Stitch MCP. |
| `stitch-sistema-diseno` | Gestionar design systems via Stitch MCP. |
| `stitch-extraer-diseno` | Extraer DESIGN.md desde codigo frontend. |
| `stitch-componentes-react` | Disenos Stitch -> componentes Vite/React, validacion AST. |

## Media & Documents

| Skill | Trigger |
|---|---|
| `ffmpeg` | Convertir/comprimir video y audio, filtros. |
| `imagemagick` | Convert/resize/compress, favicon, WebP/AVIF. |
| `pandoc` | Conversor universal MD/DOCX/PDF/HTML/EPUB/LaTeX/PPTX. |
| `pptx` | Cualquier .pptx: decks, slides, presentaciones. |
| `xlsx` | Cualquier planilla .xlsx/.xlsm/.csv/.tsv como input/output. |
| `inacap` | DOCX academico formato INACAP (python-docx). |
| `pdf` | Manipular PDFs: unir, dividir, OCR, tablas, formularios. |

## Core & Workflow

| Skill | Trigger |
|---|---|
| `ramas-y-pr` | Crear branch, workflow de PR, conventional commits. |
| `depuracion-sistematica` | Root-cause-first para bugs y test failures. |
| `verificacion-final` | Gate de evidencia antes de "done"/commit/PR. |
| `traspaso-sesion` | Estado HANDOFF.md para traspaso de sesion. |
| `buscar-habilidades` | Descubrir/instalar skills nuevas. |
| `creador-habilidades` | Crear skills nuevas segun la Agent Skills spec. |
