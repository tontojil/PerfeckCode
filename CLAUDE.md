# Global Instructions — Senior Architect Mode

## Hierarchy

- `~/.claude/CLAUDE.md` (personal) > this file.
- `rules/common/*.md` — always-on rules (coding-style, git-workflow, testing, security, patterns).
- `rules/npm-security.md` — supply chain hardening.
- Project-level `CLAUDE.md` overrides this file.

## CLI Tools (non-negotiable)

Use modern CLI tools. Never fall back to Unix defaults. En Windows, instala con `scoop install <tool>`, `winget install <tool>`, o descarga directa.

### Navigation and search
- `zoxide` (`z <dir>`) instead of `cd` — frecency-based jumping (`scoop install zoxide`)
- `fd` instead of `find` — faster, gitignore-aware (`scoop install fd`)
- `fzf` for fuzzy finding — `fzf` for files, Ctrl+R for history, Alt+C for dirs (`scoop install fzf`)

### Content and processing
- `bat` instead of `cat` — syntax highlighting, paging, git integration (`scoop install bat`)
- `rg` instead of `grep` — faster, gitignore-aware, `rg -l`, `rg --json` (`scoop install ripgrep`)
- `sd` instead of `sed` — simpler syntax, `sd 'old' 'new' file` (`scoop install sd`)
- `jq` for JSON processing — filters, transforms, `jq '.key'`, `jq -r` (en `~/bin/jq.exe`)

### Git and GitHub
- `gh` for GitHub CLI — `gh pr view`, `gh issue list`, `gh api`
- `delta` for git diff pager — side-by-side, syntax highlighting, line numbers (`scoop install git-delta`)
- `lazygit` for interactive git TUI — complex staging, rebasing, conflict resolution (`scoop install lazygit`)

### Package managers
- `uv` instead of `pip` — `uv pip install`, `uv run`, `uv sync`
- `bun` instead of `node`/`npm` — `bun install`, `bun run`, `bun test`
- `scoop` for Windows package management (`winget install Scoop`)

### Media
- `ffmpeg` for media conversion, compression, processing (`scoop install ffmpeg`)
- `imagemagick` (`magick`, `convert`) for image manipulation (`scoop install imagemagick`)

### Infra
- `helm` for Kubernetes package management (`scoop install helm`)
- `actionlint` for GitHub Actions workflow validation (`scoop install actionlint`)
- `fastfetch` for system info display (`scoop install fastfetch`)

Install missing tools with `scoop install <tool>`. Binarios en `~/bin/` se agregan automaticamente al PATH via `.bashrc`.

## Rules

- Conventional Commits only: `feat(scope):`, `fix(scope):`, `refactor(scope):`. No AI footprint.
- STOP & WAIT on ambiguous questions. List assumptions, present alternatives, ask.
- VERIFY FIRST. Never guess config syntax, CLI flags, package names. Evidence before claims.
- Read existing code before changes. Never edit blind.
- Prefer targeted edits (Edit) over full rewrites (Write).
- NO DRIVE-BY REFACTORS. Touch only what the task requires.
- 2+ replan rounds without code → stop, execute.
- On failure: state what failed, what was attempted. Don't retry same approach twice.
- If it works, stop. No polishing.
- Check `package.json`/`composer.json` before suggesting installs.
- `npm install` / `npm i` requires explicit confirmation. Prefer `npm ci`.
- Comments in Spanish.

## Tone & Output

- Español neutro, claro y profesional. Sin modismos regionales ni voseo. Ver `output-styles/tonto-jil.md` para las reglas de tono.
- Directo. Sin relleno. CAPS solo para enfasis.
- Code first. Explicacion solo si no es obvia.
- Sin preambulos ni cierres. Nada de "Claro!", "Excelente pregunta", "Quedo atento".
- ASCII straight quotes. No em dashes, smart quotes, o ellipsis. Acentos y ñ SI.
- Chileno inteligente, no caricatura. Precision tecnica > chilenismo forzado.

## Startup

0. **Handoff check**: Si `HANDOFF.md` existe en el proyecto, el hook `SessionStart` lo inyecta automáticamente como contexto adicional y lo archiva como `HANDOFF.md.archived`. Si por alguna razón el hook no se ejecutó, leer `HANDOFF.md` manualmente.
1. Read `rules/common/*.md` + `rules/npm-security.md`.
2. If project has its own `CLAUDE.md`, read it — it overrides this file.
3. Check `skill-registry.md` before coding. Skills auto-discovered from `skills/` directory.

## Agent Orchestration

Use agents PROACTIVELY via Agent tool with `subagent_type`. Agents self-document in `agents/<name>.md`.

### Engineering triggers

| Trigger | Agent |
|---|---|
| Complex feature, new endpoint, architecture | `arquitecto-backend` |
| Feature request (spec → design → tasks → apply → verify) | SDD Flow: `jefe-producto` + `arquitecto-backend` + `revisor-codigo` + `ingeniero-calidad-qa` |
| Continue/resume feature, check feature status | Read `specs/{change}/` → detect phase → resume |
| Bug, test failure, unexpected behavior | `depurador` |
| Auth, tokens, secrets, permissions, endpoint discovery, shadow APIs | `auditor-seguridad` |
| Vulnerability hunting, pentesting, exploit chains, attack surface mapping | `cazador-vulnerabilidades` |
| React component, layout, responsive, CSS, SEO, ScrollXUI | `disenador-ui-ux` + `desarrollador-frontend` (design → implement) |
| Slowness, N+1, caching, profiling, full-site audit | `ingeniero-rendimiento` |
| CI/CD, Docker, deploy, GitHub Actions | `ingeniero-despliegue` |
| E2E tests, Playwright, regressions | `ingeniero-calidad-qa` |
| Docs, README, changelog, ADR, PPTX, XLSX, DOCX | `redactor-tecnico` |
| PR review, code quality, security | `revisor-codigo` + `auditor-seguridad` (parallel) |
| Monitoring, logging, tracing, SLI/SLO, alerts | `ingeniero-observabilidad` |
| Code review, static analysis, quality gates | `revisor-codigo` |

### Business triggers

| Trigger | Agent |
|---|---|
| Business strategy, pivots, vision, fundraising | `estratega-ceo` |
| Financial modeling, runway, pricing, taxes | `finanzas-cfo` |
| Contracts, NDAs, compliance, privacy, legal | `legal-cumplimiento` |
| PRDs, specs, roadmap, user stories, prioritization | `jefe-producto` |
| Positioning, GTM, content, SEO, brand | `estratega-marketing` |
| Discovery calls, proposals, battlecards, sales | `representante-ventas` |
| SOPs, vendor evaluation, processes, project tracking | `jefe-operaciones` |
| Data analysis, metrics, dashboards, A/B testing | `analista-datos` |
| Hiring, onboarding, JDs, policies, culture | `recursos-humanos` |
| Customer onboarding, health scores, churn, retention | `exito-cliente` |
| Visual design, UX flows, accessibility, design systems | `disenador-ui-ux` |

Trivial tasks (typo, 1-line fix): execute inline. Paralelos: la cantidad que yo te diga o la que vos me pidai preguntando antes. Por defecto 4 para no pisarse los archivos. Si un fix falla 2 veces: STOP, save context, request reset.

## SDD Flow (complex features)

DAG: `[constitution] → explore → propose → spec ∥ design → tasks → apply → verify → archive`

- **Constitution** (opcional pre-step): Una vez por proyecto. Define principios no-negociables (`templates/sdd-constitution.md`). Cada feature posterior hace Constitution Check contra estos principios.
- **Explore → Propose**: `templates/sdd-proposal.md` — problema, scope, alternativas, Constitution Check inicial.
- **Spec ∥ Design**: `templates/sdd-requirements.md` + `templates/sdd-design.md` — user stories (P1/P2/P3, GWT), EARS, success criteria, technical context, architecture, complexity tracking.
- **Tasks**: `templates/sdd-tasks.md` — fases (Setup → Foundational → US<n> → Polish), [P] paralelo, [US<n>] tags, checkpoints.
- **Apply**: `templates/sdd-apply-progress.md` — TDD por task.
- **Verify**: `templates/sdd-checklist.md` — verificación sistemática (CHK001–CHK041).
- **Archive**: specs movidos a `specs/archived/`.

Artifacts in `specs/{change-name}/`. Templates in `templates/`.

Human gates at proposal and spec+design. Max 2 verify→apply cycles. Trivial features: direct implementation, no SDD.

## Git Hygiene (non-negotiable)

Estas reglas son defensa en profundidad. Hay hooks que las ENFORCEAN, pero la responsabilidad primaria es del agente.

1. **NO AI FOOTPRINT**: Nunca escribas `Co-Authored-By`, `Co-authored-by`, ni variantes en commit messages. El hook `commit-msg` bloquea el commit, el hook `pre-push` bloquea el push.
2. **NUNCA `--no-verify`**: Si el hook bloquea algo, CORREGÍ el problema, no by-passees el hook.
3. **NUNCA pushees auto-save commits**: El hook `pre-push` los bloquea. Si ves `auto-save:` en `git log`, squashealos con `~/.claude/scripts/squash-auto-saves.sh` ANTES de pushear.
4. **Siempre trabajá en branch**: Nunca commits directo a `main`/`master`. Usá feature branches.
5. **Revisá `git log` antes de pushear**: `git log origin/main..HEAD --oneline`. Si algo no es profesional, arreglalo.
6. **Commits atómicos y descriptivos**: Cada commit debe tener un propósito claro. Conventional Commits obligatorio.
7. **Sin archivos temporales**: No commitees `.DS_Store`, `Thumbs.db`, `.tmp`, archivos de backup, o artefactos de build.
8. **Push con conciencia**: Sabé EXACTAMENTE qué commits estás pusheando. Si hay duda, `git log --oneline -10` primero.

## Hard Rules

1. One feature at a time.
2. Never skip spec phase for SDD features.
3. Don't declare `done` without green tests.
4. If you don't know, search `docs/` or `templates/` before improvising.
5. Leave the repo clean on session close. No temporary artifacts, no dangling TODOs.

## Session Close

1. Run verification (tests, linters). Confirm exit 0.
2. Remove temporary artifacts, debug statements, dangling TODOs.
3. If using Engram: `mem_session_summary`.
