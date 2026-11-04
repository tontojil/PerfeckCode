# OpenCode V2 agent orchestration

This document describes the PerfeckCode agent catalog shipped in
`opencode-v2/agents`, the native V2 delegation contract used by `opencode-v2/commands`,
and the source/installer split for permissions. It covers OpenCode 2.1.2 only.

Sources:

- Agents and modes: <https://github.com/anomalyco/opencode/blob/v2.1.2/services/www/src/docs/content/agents.mdx>
- `subagent` tool: <https://github.com/anomalyco/opencode/blob/v2.1.2/services/www/src/docs/content/tools.mdx>
- Migration notes: <https://github.com/anomalyco/opencode/blob/v2.1.2/services/www/src/docs/content/migrate-v1.mdx>

## Catalog

The distribution owns 33 agent identities:

- One primary: `perfeck`.
- 32 specialists with `mode: subagent`.

| Group | Agent IDs |
|---|---|
| Product and architecture | `jefe-producto`, `arquitecto-backend`, `disenador-ui-ux`, `analista-datos` |
| Implementation and debugging | `desarrollador-frontend`, `depurador`, `ingeniero-rendimiento` |
| Quality and security | `ingeniero-calidad-qa`, `revisor-codigo`, `auditor-seguridad`, `cazador-vulnerabilidades` |
| Delivery and operations | `ingeniero-despliegue`, `ingeniero-observabilidad`, `jefe-nube-propia`, `ingeniero-windows`, `ingeniero-linux` |
| Documents and research | `redactor-tecnico`, `tutor-inacap`, `trabajo-social`, `humanizador-informes` |
| Business | `estratega-ceo`, `estratega-marketing`, `representante-ventas`, `vendedor-redes`, `auditor-anuncios`, `finanzas-cfo`, `legal-cumplimiento`, `jefe-operaciones`, `exito-cliente`, `recursos-humanos` |
| Local commerce and learning | `super-agente-sii`, `mentor-programacion` |

`perfeck` is the only primary and the configured `default_agent`. Its prompt is
the source of truth for tone, clarification gates, review discipline and
delegation. Every other file is a specialist with `mode: subagent`.

## Delegation contract

OpenCode V2 launches child sessions through the `subagent` tool. The parent
passes an agent ID, a short description and a complete prompt. V1 used the word
`task` for the same action; the V1 word must not remain in prompts.

The four team commands use one stable invocation shape:

```text
use `subagent` con `<agent-id>` ...
```

Stable agent IDs are the interface. Team commands must not:

- reference an agent that is absent from `opencode-v2/agents`;
- delegate to a `primary`-only agent;
- delegate to Perfeck itself;
- use `Task`, `Task a` or `Task con skill ...` as a delegation target.

`opencode.jsonc` keeps the ordered allowlist under the legacy V1 key `task`.
The installer translates that key to the native V2 action `subagent`. Renaming
the key by hand in the source template would bypass the adapter; the source
stays V1-shaped on purpose.

## Role coherence

Some catalog roles produce design or read-only output. They never receive
implementation writes:

| Role | Allowed output | Forbidden output |
|---|---|---|
| `arquitecto-backend` | API contracts, schemas, architecture decisions | Code changes, patches, file writes |
| `disenador-ui-ux` | Visual direction, component specs, UX flows | Code changes, patches, file writes |
| `jefe-producto` | PRDs, requirements, acceptance criteria | Code changes |
| `revisor-codigo` | Findings with file and line references | Edits, shell mutations |
| `auditor-seguridad` | Audit findings, threat model, compliance gaps | Edits, shell mutations |
| `cazador-vulnerabilidades` | Authorized exploit validation and findings | Edits, shell mutations |

Implementation ownership:

- Perfeck implements backend code inline. There is no backend writer subagent.
- `desarrollador-frontend` owns frontend implementation.
- `depurador` applies minimal fixes for a failing check and returns evidence.
- `redactor-tecnico` and `humanizador-informes` own prose changes.

The program team command reflects this split: step 2 delegates design to
`arquitecto-backend` and `disenador-ui-ux`; step 3 has Perfeck implement the
backend inline and delegates only the frontend to `desarrollador-frontend`.

## Commands

| Command | Native targets | Notes |
|---|---|---|
| `/equipo-programacion` | `jefe-producto`, `arquitecto-backend`, `disenador-ui-ux`, `desarrollador-frontend`, `ingeniero-calidad-qa`, `depurador`, `revisor-codigo`, `auditor-seguridad`, `ingeniero-rendimiento` | Backend implementation stays with Perfeck |
| `/equipo-informes` | `tutor-inacap`, `trabajo-social`, `analista-datos`, `redactor-tecnico`, `humanizador-informes` | Skills `inacap`, `sistematizacion-uc`, `pptx`, `xlsx` load inline with the `skill` tool |
| `/equipo-negocios` | `jefe-producto`, `estratega-ceo`, `analista-datos`, `finanzas-cfo`, `legal-cumplimiento`, `estratega-marketing`, `representante-ventas`, `vendedor-redes`, `auditor-anuncios`, `jefe-operaciones`, `exito-cliente`, `recursos-humanos` | No code writes |
| `/equipo-sistemas` | `ingeniero-windows`, `ingeniero-linux`, `jefe-nube-propia`, `ingeniero-despliegue`, `ingeniero-observabilidad`, `ingeniero-rendimiento`, `auditor-seguridad`, `cazador-vulnerabilidades`, `super-agente-sii`, `mentor-programacion` | Destructive shell actions remain gated |

`/equipo-informes` no longer treats `detector-ia` as an agent or as a separate
delegation target. Score and gate belong to `humanizador-informes`, which loads
its own detection workflow in the same child session.

## Skills

Commands and guidance reference skills by ID with `skill \`<id>\``. Every
repository-referenced skill must exist as a directory under `skills/`. External
skills under `~/.claude/skills` remain user-owned and are not copied into the
distribution.

## Clarification and human gates

The primary prompt and `AGENTS.md` preserve these gates:

- If scope, edit surface, acceptance criteria or a human decision is ambiguous,
  ask before writing.
- Do not push, merge, deploy, publish or release without explicit confirmation.
- The commit always belongs to the user.
- Never skip hooks or use `--no-verify`.

Team commands keep their own domain gates: teacher instructions win for
academic work, destructive shell actions and `sudo` require confirmation, and
offensive testing requires explicit authorization in an isolated environment.

## Models

The distribution does not pin providers or models. `opencode.jsonc` has no
`model`, `small_model` or `provider` key, and no agent or command file sets a
model. A subagent inherits the parent model unless the user configures one.

## Permissions and installation

`opencode-v2/opencode.jsonc` is the source permission template:

- The `task` map starts with `"*": "deny"` and allows exactly the 32
  subagent-mode IDs. Last matching rule wins.
- `question` is allowed for the primary.
- Read and edit rules still ask before touching secrets, keys and environment
  files.
- Shell rules keep destructive commands denied.

`scripts/install-opencode.mjs` translates the source into native V2:

| Source (V1 template) | Installed V2 |
|---|---|
| `permission.task` | `permissions` action `subagent` |
| `permission.bash` | `permissions` action `shell` |
| `permission.read` / `permission.edit` | same-name actions |
| `agent` | `agents` |
| `mcp` object | `mcp.servers` |

The installed config is what OpenCode loads. Do not load the repository
`opencode.jsonc` directly as a V2 project config.

## Verification

Static contracts, no model calls and no network:

```sh
bun test opencode-v2/tests/agents.test.ts
bun test opencode-v2/tests
```

`opencode-v2/tests/agents.test.ts` verifies:

- the exact 33-agent catalog and one-primary/32-subagent mode split;
- every command `agent` field and every `subagent` target resolves;
- the source allowlist matches the subagent catalog while retaining `task`;
- no V1 `Task` delegation wording remains in the changed prompts;
- design and read-only roles never receive implementation writes;
- every referenced skill exists under `skills/`;
- no provider or model pinning;
- `perfeck` remains the single primary identity.

## Known limits

- Static tests do not load the TUI or execute a model. Native runtime loading is
  verified separately.
- The source template intentionally keeps V1 permission keys; it is not a
  directly loadable V2 config.
- V2 default subagent nesting depth is one. Team commands stay single-level.
- Windows and PowerShell execution are not covered by this test file.
- User-local skills and user-selected models remain outside the distribution.
- The installer preserves an existing server config; it does not silently
  migrate unrelated personal providers or permissions.

## Extending the catalog

When adding a specialist:

1. Add `opencode-v2/agents/<id>.md` with `mode: subagent`, a description and a
   prompt.
2. Add `<id>: "allow"` to the `task` allowlist in `opencode-v2/opencode.jsonc`.
3. Reference it from a command as `` `subagent` con `<id>` ``.
4. Add the ID to `expectedAgents` in `opencode-v2/tests/agents.test.ts`.
5. Run `bun test opencode-v2/tests/agents.test.ts`.

When adding a team command, set `agent: perfeck` in frontmatter and use the
same `subagent` invocation shape. Do not add a second primary without an
explicit product decision.
