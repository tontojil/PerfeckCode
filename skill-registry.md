# Skill Registry — Claude Code

Catalogo central de skills para Claude Code. Las skills se auto-descubren desde
`~/.claude/skills/` (cada una con su `SKILL.md`). Esta tabla es la referencia rapida:
escanea triggers ANTES de codear y aplica la skill que calce.

- **Total skills:** 104 (80 base + 24 contrib)
- **Fuente:** `~/.claude/skills/` (base en raiz, nuevas en `skills/contrib/`)
- **Invocacion:** Claude carga la skill por su `name` del frontmatter cuando el contexto calza.
- **Ultima sync:** 2026-10-26

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
| `diagram-design` | Diagramas editoriales HTML+SVG: arquitectura, flujo, secuencia, ER, Kanban, Sankey, UML. |

## Media & Documents

| Skill | Trigger |
|---|---|
| `ffmpeg` | Convertir/comprimir video y audio, filtros. |
| `imagemagick` | Convert/resize/compress, favicon, WebP/AVIF. |
| `pandoc` | Conversor universal MD/DOCX/PDF/HTML/EPUB/LaTeX/PPTX. |
| `pptx` | Cualquier .pptx: decks, slides, presentaciones. |
| `xlsx` | Cualquier planilla .xlsx/.xlsm/.csv/.tsv como input/output. |
| `inacap` | DOCX academico formato INACAP (python-docx) + Anexo 7.0, indices TOC automaticos con `\h` y actualizacion con Word (`actualizar_word.ps1`). |
| `informe-maestro` | Sistema definitivo informes largos CUALQUIER tema con nota maxima: densidad, codigos D/F/CU/CA/K/S/R, formulas, limites, APA 7. |
| `sistematizacion-uc` | Sistematizacion UC Trabajo Social personas mayores, plan accion, Jara/Martinic/Cifuentes, formato UC APA 7. |
| `pdf` | Manipular PDFs: unir, dividir, OCR, tablas, formularios. |
| `rescatar-pdf` | Rescatar PDFs que el lector nativo no puede abrir ("PDF parser FaaS call failed"): extrae texto e imágenes con PyMuPDF local. |
| `avoid-ai-writing` | Base inglesa anti-IA (conorbronsdon, MIT): SKILL.md + references/patterns.md + detector local 0-100. Usar en textos en ingles. |
| `escritura-humana` | Humanizar informes en español: rewrite/detect/edit, 2 pases, Tiers ES, sin inventar datos, compatible informe-maestro/inacap. |
| `detector-ia` | Auditar con score local 0-100 + checklist español 12 puntos + gate pass/warn/fail antes de entregar. |

## Core & Workflow

| Skill | Trigger |
|---|---|
| `ramas-y-pr` | Crear branch, workflow de PR, conventional commits. |
| `windows-powershell` | Ordenes PowerShell en Windows, rutas y permisos. |
| `typescript-estricto` | Tipos estrictos, cero any, tsc en verde. |
| `accesibilidad-wcag` | Teclado, lector de pantalla y contraste AA. |
| `rendimiento-web` | LCP/INP/CLS medidos antes y despues. |
| `sii-chile` | DTE, folios CAF, firma y estados ante el SII. |
| `tienda-online-sii` | Tienda con boleta SII, voucher, RCV y F29. |
| `pagos-webpay` | Webpay Plus: crear, confirmar y validar pagos. |
| `experto-node` | Node Express/Nest, async seguro, Vitest. |
| `postgres-produccion` | Modelo, indices, EXPLAIN, respaldo. |
| `gestion-secretos` | Vault, rotacion, cero fugas. |
| `venta-redes-sociales` | Catalogo, WhatsApp, Marketplace, cierre. |
| `publicacion-web` | Dominio, SSL, hosting, tiendas de apps. |
| `soporte-pc-redes` | PC, WiFi, impresoras, respaldo 3-2-1. |
| `privacidad-datos-chile` | Consentimiento, derechos, aviso simple. |
| `biblioteca-programacion` | Libros gratis en español por lenguaje. |
| `extraccion-web-datos` | Datos publicos con respeto: robots y pausas. |
| `nube-propia` | Self-host con Docker, HTTPS y respaldo. |
| `anuncios-pagos` | Avisos Google/Meta/TikTok con permiso. |
| `linux-terminal` | Terminal sin miedo: archivos, bash, systemd, SSH. |
| `linux-servidores` | Servidor seguro: SSH, firewall, respaldo. |
| `depuracion-sistematica` | Root-cause-first para bugs y test failures. |
| `verificacion-final` | Gate de evidencia antes de "done"/commit/PR. |
| `traspaso-sesion` | Estado HANDOFF.md para traspaso de sesion. |
| `buscar-habilidades` | Descubrir/instalar skills nuevas. |
| `creador-habilidades` | Crear skills nuevas segun la Agent Skills spec. |

---

## Contrib (nuevas, adaptadas a neutro)

| Skill | Trigger |
|---|---|
| `contrib/incident-commander` | Incidente en produccion, severidad, roles y postmortem. |
| `contrib/slo-architect` | SLI, SLO, error budget y alertas por burn rate. |
| `contrib/feature-flags` | Flags por entorno, rollout progresivo y kill switch. |
| `contrib/pr-review-expert` | PR con blast radius, seguridad y cobertura delta. |
| `contrib/api-test-suite-builder` | Generar suites Vitest y Pytest desde rutas API. |
| `contrib/performance-profiler` | Profiling Node, Python y Go, bundle y carga. |
| `contrib/dependency-auditor` | Auditoria multi-lenguaje, licencias y upgrades. |
| `contrib/skill-security-auditor` | Auditar skill de terceros antes de instalar: PASS, WARN, FAIL. |
| `contrib/git-worktree-manager` | Trabajo paralelo con worktree y puertos aislados. |
| `contrib/codebase-onboarding` | Generar docs de onboarding desde el repo. |
| `contrib/runbook-generator` | Runbooks operativos con comandos exactos. |
| `contrib/changelog-generator` | Conventional Commits a changelog estructurado. |
| `contrib/rag-architect` | Pipeline RAG, chunking y evaluacion de retrieval. |
| `contrib/mcp-server-builder` | MCP desde OpenAPI en Python y TS. |
| `contrib/agent-workflow-designer` | Patrones secuencial, paralelo, router y evaluador. |
| `contrib/prompt-toolkit` | Versionar prompts, prueba A/B y calidad. |
| `contrib/deep-research` | Investigacion con rigor y limites declarados. |
| `contrib/litreview` | Revision de literatura con matriz y APA 7. |
| `contrib/interview-mapper` | Codificar entrevistas con citas verificadas. |
| `contrib/capture` | Volcado mental a acciones con GTD. |
| `contrib/weekly-review` | Revision semanal GTD con compuerta. |
| `contrib/deep-work` | Bloques de enfoque y presupuesto superficial. |
| `contrib/pricing-strategist` | Precios por plan con costos y margen. |
| `contrib/month-end-close` | Cierre mensual con conciliacion y variaciones. |
