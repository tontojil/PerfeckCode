---
name: buscar-habilidades
description: Te ayuda a encontrar e instalar skills nuevos cuando preguntas cómo hacer algo o si existe un skill para eso. Úsalo cuando quieras ampliar lo que el agente sabe hacer. (find skills, discover, install)
---

# Find Skills

This skill helps you discover and install skills from the open agent skills ecosystem.

## When to Use This Skill

Use this skill when the user:

- Asks "how do I do X" where X might be a common task with an existing skill
- Says "find a skill for X" or "is there a skill for X"
- Asks "can you do X" where X is a specialized capability
- Expresses interest in extending agent capabilities
- Wants to search for tools, templates, or workflows
- Mentions they wish they had help with a specific domain (design, testing, deployment, etc.)

## What is the Skills CLI?

The Skills CLI (`npx skills`) is the package manager for the open agent skills ecosystem. Skills are modular packages that extend agent capabilities with specialized knowledge, workflows, and tools.

**Key commands:**

- `npx skills find [query]` - Search for skills interactively or by keyword
- `npx skills add <package>` - Install a skill from GitHub or other sources
- `npx skills check` - Check for skill updates
- `npx skills update` - Update all installed skills

**Browse skills at:** https://skills.sh/

## autoskills — Automated Alternative

For initial project setup, `npx autoskills` automatically detects the project tech stack and installs curated, security-reviewed skills at project level. No interactive prompts — hands-off. Prefer `autoskills` for first-time setup; use `buscar-habilidades` for discovering specific additional skills later.

## How to Help Users Find Skills

### Step 1: Understand What They Need

When a user asks for help with something, identify:

1. The domain (e.g., React, testing, design, deployment)
2. The specific task (e.g., writing tests, creating animations, reviewing PRs)
3. Whether this is a common enough task that a skill likely exists

### Step 2: Search for Skills

Run the find command with a relevant query:

```bash
npx skills find [query]
```

For example:

- User asks "how do I make my React app faster?" → `npx skills find react performance`
- User asks "can you help me with PR reviews?" → `npx skills find pr review`
- User asks "I need to create a changelog" → `npx skills find changelog`

The command will return results like:

```
Install with npx skills add <owner/repo@skill>

vercel-labs/agent-skills@vercel-react-best-practices
└ https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### Step 3: Present Options to the User

When you find relevant skills, present them to the user with:

1. The skill name and what it does
2. The install command they can run
3. A link to learn more at skills.sh

Example response:

```
I found a skill that might help! The "vercel-react-best-practices" skill provides
React and Next.js performance optimization guidelines from Vercel Engineering.

To install it:
npx skills add vercel-labs/agent-skills@vercel-react-best-practices

Learn more: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### Step 4: Offer to Install

If the user wants to proceed, you can install the skill for them:

```bash
npx skills add <owner/repo@skill> -g -y
```

The `-g` flag installs globally (user-level) and `-y` skips confirmation prompts.

### Fijar versión al instalar

Al instalar skills de terceros, fija versión con `@v1` o commit SHA (ej: `npx skills add owner/repo@skill@v1`).
Así evitas cambios rotos por updates automáticos. Revisa updates con `npx skills check` antes de subir versión.

## Common Skill Categories

When searching, consider these common categories:

| Category        | Example Queries                          |
| --------------- | ---------------------------------------- |
| Web Development | react, nextjs, typescript, css, tailwind |
| Testing         | testing, jest, playwright, e2e           |
| DevOps          | deploy, docker, kubernetes, ci-cd        |
| Documentation   | docs, readme, changelog, api-docs        |
| Code Quality    | review, lint, refactor, best-practices   |
| Design          | ui, ux, design-system, accessibility     |
| Productivity    | workflow, automation, git                |

## Tips for Effective Searches

1. **Use specific keywords**: "react testing" is better than just "testing"
2. **Try alternative terms**: If "deploy" doesn't work, try "deployment" or "ci-cd"
3. **Check popular sources**: Many skills come from `vercel-labs/agent-skills` or `ComposioHQ/awesome-claude-skills`

## When No Skills Are Found

If no relevant skills exist:

1. Acknowledge that no existing skill was found
2. Offer to help with the task directly using your general capabilities
3. Suggest the user could create their own skill with `npx skills init`

Example:

```
I searched for skills related to "xyz" but didn't find any matches.
I can still help you with this task directly! Would you like me to proceed?

If this is something you do often, you could create your own skill:
npx skills init my-xyz-skill
```

## Referencias oficiales y repositorios famosos

Esta sección amplía sin modificar el flujo de descubrimiento existente. Úsela para instalar con seguridad y versión fijada.

### Documentación oficial

- Skills.sh: https://skills.sh/ — catálogo y fichas de instalación con `npx skills add`.
- Agent Skills Spec: https://agentskills.io/ — formato `SKILL.md`, frontmatter y estructura.
- Anthropic Skills: https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills — creación y uso de skills.
- OpenCode Docs: https://opencode.ai/docs/ — descubrimiento nativo desde `~/.claude/skills` y `skills/`.
- npm Skills CLI: https://www.npmjs.com/package/skills — comandos `find`, `add`, `check` y `update`.
- Autoskills: https://www.npmjs.com/package/autoskills — instalación curada por stack con `npx autoskills`.
- Supply Chain Security npm: https://docs.npmjs.com/security/ — verificación antes de instalar paquetes de terceros.

### Repositorios famosos y listas curadas

- Awesome Claude Skills: https://github.com/ComposioHQ/awesome-claude-skills — colección curada por dominio.
- Vercel Agent Skills: https://github.com/vercel-labs/agent-skills — `vercel-react-best-practices` y más.
- Anthropic Skills: https://github.com/anthropics/skills — ejemplos oficiales (`pdf`, `pptx`, `xlsx`).
- Skills.sh Registry: https://github.com/skills-sh/skills — índice público de skills instalables.
- Awesome Agents: https://github.com/kyrolabs/awesome-agents — agentes y skills complementarios.

### Guías de profundización sugeridas

- Revise la ficha en `skills.sh` antes de instalar: descripción, trigger y mantenimiento.
- Consulte la spec Agent Skills para distinguir `assets/` y `references/` al evaluar calidad.
- Valide versión fijada con `@v1` o SHA y revise con `npx skills check` antes de subir.
- Verifique alcance global (`-g`) versus proyecto antes de instalar en equipo.
- Mida utilidad con 2 búsquedas alternativas si la primera no retorna resultados.

### Checklist de verificación

- [ ] Se consultó `skills.sh` y la spec `agentskills.io` para el skill evaluado.
- [ ] La búsqueda utiliza keywords específicas con 2 variantes intentadas.
- [ ] La propuesta incluye nombre, función, comando de instalación y enlace.
- [ ] La instalación fija versión con `@v1` o SHA y evita `latest` implícito.
- [ ] Se ofrece instalación asistida con `-g -y` solo tras aprobación del usuario.
- [ ] Si no existen resultados, se ofrece ayuda directa y creación con `npx skills init`.
- [ ] No se instalan skills con permisos excesivos sin revisión deDocs.
- [ ] El skill instalado se prueba con un prompt real antes de declararlo útil.
