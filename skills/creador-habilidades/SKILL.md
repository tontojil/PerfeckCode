---
name: creador-habilidades
description: "Creación de nuevas skills de agente según la especificación oficial, para patrones repetidos o instrucciones nuevas. (skill creator, Agent Skills, instructions)"
license: Apache-2.0
metadata:
  version: "1.0"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Cuando usar

Usa esta skill cuando quieras crear una skill nueva y reutilizable.
- Cuando un patrón se repite y la IA necesita guía paso a paso.
- Cuando las convenciones del proyecto piden instrucciones propias.
- Cuando un flujo complejo se beneficia de un checklist o decision tree.
No la uses para tareas de una sola vez (one-off); resuélvelas directo sin crear skill.

## When to Create a Skill

Create a skill when:

- A pattern is used repeatedly and AI needs guidance
- Project-specific conventions differ from generic best practices
- Complex workflows need step-by-step instructions
- Decision trees help AI choose the right approach

**Don't create a skill when:**

- Documentation already exists (create a reference instead)
- Pattern is trivial or self-explanatory
- It's a one-off task

---

## Skill Structure

```
skills/{skill-name}/
├── SKILL.md              # Required - main skill file
├── assets/               # Optional - templates, schemas, examples
│   ├── template.py
│   └── schema.json
└── references/           # Optional - links to local docs
    └── docs.md           # Points to docs/developer-guide/*.mdx
```

---

## SKILL.md Template

```markdown
---
name: {skill-name}
description: >
  {One-line description of what this skill does}.
  Trigger: {When the AI should load this skill}.
license: Apache-2.0
metadata:
  version: "1.0"
---

## When to Use

{Bullet points of when to use this skill}

## Critical Patterns

{The most important rules - what AI MUST know}

## Code Examples

{Minimal, focused examples}

## Commands

```bash
{Common commands}
```

## Resources

- **Templates**: See [assets/](assets/) for {description}
- **Documentation**: See [references/](references/) for local docs

```

---

## Naming Conventions

| Type | Pattern | Examples |
|------|---------|----------|
| Generic skill | `{technology}` | `pytest`, `playwright`, `typescript` |
| Project-specific | `{project}-{component}` | `api-auth`, `ui-checkout`, `sdk-payments` |
| Testing skill | `test-{component}` | `test-sdk`, `test-api` |
| Workflow skill | `{action}-{target}` | `creador-habilidades`, `jira-task` |

---

## Decision: assets/ vs references/

```

Need code templates?        → assets/
Need JSON schemas?          → assets/
Need example configs?       → assets/
Link to existing docs?      → references/
Link to external guides?    → references/ (with local path)

```

**Key Rule**: `references/` should point to LOCAL files (`docs/developer-guide/*.mdx`), not web URLs.

---

## Decision: Project-Specific vs Generic

```

Patterns apply to ANY project?     → Generic skill (e.g., pytest, typescript)
Patterns are project-specific?     → {project}-{name} skill
Generic skill needs project info?  → Add references/ pointing to project docs

```

---

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill identifier (lowercase, hyphens) |
| `description` | Yes | What + Trigger in one block |
| `license` | Yes | Apache-2.0 por defecto; si el proyecto usa otra, esa manda |
| `metadata.version` | Yes | Semantic version as string |

---

## Content Guidelines

### DO
- Start with the most critical patterns
- Use tables for decision trees
- Keep code examples minimal and focused
- Include Commands section with copy-paste commands

### DON'T
- Add Keywords section (agent searches frontmatter, not body)
- Duplicate content from existing docs (reference instead)
- Include lengthy explanations (link to docs)
- Add troubleshooting sections (keep focused)
- Use web URLs in references (use local paths)

---

## Registering the Skill

After creating the skill, add it to `skill-registry.md` (tabla del grupo que
corresponda) y actualiza el contador de Total skills:

```markdown
| `nombre-skill` | Trigger en español corto. |
```

## Evaluar la skill antes de darla por lista

No entregues una skill sin probarla. Loop chico y efectivo:

1. Escribe 2-3 prompts de prueba realistas (lo que un usuario diría de verdad,
   con detalle y contexto, no "formatea esto").
2. Corre cada prompt DOS veces: una CON la skill cargada y una SIN ella
   (baseline). Compara: la versión con skill tiene que ganar claramente.
3. Muestrale ambos resultados al usuario y pide feedback concreto.
4. Mejora la skill desde el feedback (generaliza, no parchees solo el ejemplo),
   saca lo que no aporta peso y explica el POR QUE de cada regla en vez de
   puros MUST en mayusculas. Repite hasta que el usuario quede conforme.
5. Si la salida es subjetiva (estilo, diseño), la evaluacion es cualitativa
   con el usuario, no fuerces metricas.

Tip de descripcion: se "pushy" en el trigger. En vez de "genera dashboards",
escribe "genera dashboards. Usala cuando el usuario mencione metricas,
visualizacion o reportes, aunque no pida un dashboard explicito".

---

## Checklist Before Creating

- [ ] Skill doesn't already exist (check `skills/`)
- [ ] Pattern is reusable (not one-off)
- [ ] Name follows conventions
- [ ] Frontmatter is complete (description includes trigger keywords)
- [ ] Critical patterns are clear
- [ ] Code examples are minimal
- [ ] Commands section exists
- [ ] Added to skill-registry.md (y contador Total actualizado)

## Resources

- **Templates**: See [assets/](assets/) for SKILL.md template

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar la plantilla ni el flujo existente. Úsela para crear skills válidas y evaluadas.

### Documentación oficial

- Agent Skills Spec: https://agentskills.io/ — estructura, frontmatter y validación de `SKILL.md`.
- Anthropic Agent Skills: https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills — guía de creación y buenas prácticas.
- OpenCode Customization: https://opencode.ai/docs/ — skills en `~/.config/opencode/` y `skills/` de proyecto.
- Anthropic Skills Repo: https://github.com/anthropics/skills — ejemplos `pdf`, `pptx`, `xlsx` con `LICENSE.txt`.
- Skill Authoring Best Practices: https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/best-practices — patrones DO y DON'T.
- Markdown GitHub: https://docs.github.com/github/writing-on-github/getting-started-with-writing-and-formatting-on-github — formato legible.
- SemVer: https://semver.org/ — versionado `metadata.version` como string.

### Repositorios famosos y listas curadas

- Awesome Claude Skills: https://github.com/ComposioHQ/awesome-claude-skills — patrones reutilizables por dominio.
- Vercel Agent Skills: https://github.com/vercel-labs/agent-skills — triggers pushy y ejemplos mínimos.
- Skills.sh: https://skills.sh/ — publicación y descubrimiento con `npx skills`.
- Claude Code Plugins: https://github.com/anthropics/claude-code — registro y contadores en `skill-registry.md`.
- Skill Creator Examples: https://github.com/anthropics/skills — plantilla `SKILL.md` con `assets/` y `references/`.

### Guías de profundización sugeridas

- Revise la spec antes de nombrar: `{tecnologia}`, `{proyecto}-{componente}` o `{accion}-{target}`.
- Consulte best practices para mantener ejemplos mínimos y sección Commands copiable.
- Valide frontmatter completo: `name`, `description` con trigger, `license` y `metadata.version`.
- Verifique decisión `assets/` versus `references/` con rutas locales, no URLs web.
- Mida con loop A/B: mismo prompt con y sin skill, dos corridas, feedback del usuario.

### Checklist de verificación

- [ ] Se consultó `agentskills.io` y `docs.anthropic.com` para la estructura creada.
- [ ] El nombre sigue convenciones y no duplica skill existente en `skills/`.
- [ ] El frontmatter incluye trigger pushy en español con keywords de búsqueda.
- [ ] Los patrones críticos van primero con tablas de decisión cuando aplica.
- [ ] Los ejemplos son mínimos y la sección Commands es copiable.
- [ ] Se agrega entrada en `skill-registry.md` con contador Total actualizado.
- [ ] La evaluación A/B demuestra ganancia clara con 2-3 prompts realistas.
- [ ] La licencia es `Apache-2.0` por defecto o la del proyecto cuando manda.
