---
name: buscar-habilidades
description: Te ayuda a encontrar e instalar skills nuevos cuando preguntas cómo hacer algo o si existe un skill para eso. Úsalo cuando quieras ampliar lo que el agente sabe hacer. (find skills, discover, install)
---

# Buscar Habilidades

Esta skill ayuda a descubrir e instalar skills del ecosistema abierto de agent skills.

## Cuándo usar esta skill

Use esta skill cuando el usuario:

- Pregunta "cómo hago X" donde X puede ser una tarea común con una skill existente.
- Dice "busca una skill para X" o "existe una skill para X".
- Pregunta "puedes hacer X" donde X es una capacidad especializada.
- Manifiesta interés en ampliar las capacidades del agente.
- Quiere buscar herramientas, plantillas o flujos de trabajo.
- Menciona que necesita ayuda en un dominio específico (diseño, pruebas, despliegue, etc.).

## Qué es la Skills CLI

La Skills CLI (`npx skills`) es el gestor de paquetes del ecosistema abierto de agent skills. Las skills son paquetes modulares que amplían las capacidades del agente con conocimiento especializado, flujos y herramientas.

**Comandos clave:**

- `npx skills find [consulta]` — buscar skills de forma interactiva o por palabra clave.
- `npx skills add <paquete>` — instalar una skill desde GitHub u otras fuentes.
- `npx skills check` — revisar actualizaciones disponibles.
- `npx skills update` — actualizar todas las skills instaladas.

**Explorar skills en:** https://skills.sh/

## autoskills — Alternativa automatizada

Para la configuración inicial de un proyecto, `npx autoskills` detecta el stack tecnológico e instala skills curadas y revisadas a nivel de proyecto. Sin preguntas interactivas. Prefiera `autoskills` para la primera instalación; use `buscar-habilidades` para descubrir skills adicionales específicas después.

## Cómo ayudar a encontrar skills

### Paso 1: Entender qué necesita

Cuando el usuario pide ayuda, identifique:

1. El dominio (por ejemplo React, pruebas, diseño, despliegue).
2. La tarea específica (por ejemplo escribir pruebas, crear animaciones, revisar PR).
3. Si es una tarea común para la cual probablemente existe una skill.

### Paso 2: Buscar skills

Ejecute el comando de búsqueda con una consulta relevante:

```bash
npx skills find [consulta]
```

Por ejemplo:

- Usuario pregunta "cómo hago más rápida mi app React" → `npx skills find react performance`
- Usuario pregunta "me ayudas con revisión de PR" → `npx skills find pr review`
- Usuario pregunta "necesito crear un changelog" → `npx skills find changelog`

El comando retorna resultados como:

```text
Install with npx skills add <owner/repo@skill>

vercel-labs/agent-skills@vercel-react-best-practices
└ https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### Paso 3: Presentar opciones al usuario

Cuando encuentre skills relevantes, presente cada una con:

1. Nombre de la skill y qué hace.
2. Comando de instalación que puede ejecutar.
3. Enlace para más información en skills.sh.

Ejemplo de respuesta:

```text
Encontré una skill que puede ayudar. La skill "vercel-react-best-practices"
entrega guías de optimización React y Next.js del equipo de ingeniería de Vercel.

Para instalarla:
npx skills add vercel-labs/agent-skills@vercel-react-best-practices

Más información: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### Paso 4: Ofrecer instalar

Si el usuario decide continuar, puede instalar la skill por él:

```bash
npx skills add <owner/repo@skill> -g -y
```

La bandera `-g` instala a nivel global (usuario) y `-y` omite confirmaciones.

### Fijar versión al instalar

Al instalar skills de terceros, fije versión con `@v1` o SHA de commit (ejemplo: `npx skills add owner/repo@skill@v1`).
Así evita cambios rotos por actualizaciones automáticas. Revise actualizaciones con `npx skills check` antes de subir versión.

## Categorías comunes de skills

Al buscar, considere estas categorías:

| Categoría        | Consultas ejemplo                         |
| ---------------- | ----------------------------------------- |
| Desarrollo web   | react, nextjs, typescript, css, tailwind  |
| Pruebas          | testing, jest, playwright, e2e            |
| DevOps           | deploy, docker, kubernetes, ci-cd         |
| Documentación    | docs, readme, changelog, api-docs        |
| Calidad código   | review, lint, refactor, best-practices    |
| Diseño           | ui, ux, design-system, accessibility       |
| Productividad    | workflow, automation, git                  |

## Consejos para búsquedas efectivas

1. **Use palabras específicas**: "react testing" es mejor que solo "testing".
2. **Pruebe términos alternos**: si "deploy" no funciona, pruebe "deployment" o "ci-cd".
3. **Revise fuentes populares**: muchas skills vienen de `vercel-labs/agent-skills` o `ComposioHQ/awesome-claude-skills`.

## Cuando no se encuentran skills

Si no existen skills relevantes:

1. Reconozca que no se encontró una skill existente.
2. Ofrezca ayuda directa con la tarea usando capacidades generales.
3. Sugiera crear una skill propia con `npx skills init`.

Ejemplo:

```text
Busqué skills relacionadas con "xyz" pero no encontré coincidencias.
Igual puedo ayudar con esta tarea directamente. Desea que continúe?

Si esto es algo frecuente, puede crear su propia skill:
npx skills init my-xyz-skill
```

## Ejemplo mínimo

Flujo completo copiable para "revisión de PR":

```bash
npx skills find pr review
# Revisar ficha en https://skills.sh/ antes de instalar
npx skills add vercel-labs/agent-skills@vercel-react-best-practices@v1
npx skills check
```

Respuesta mínima al usuario:

```text
Skill: vercel-react-best-practices — guías de revisión React y Next.js.
Instalar: npx skills add vercel-labs/agent-skills@vercel-react-best-practices@v1
Ficha: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
Prueba: pida "revisa este componente con la skill instalada" y compare con baseline.
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
- [ ] No se instalan skills con permisos excesivos sin revisión de docs.
- [ ] El skill instalado se prueba con un prompt real antes de declararlo útil.
