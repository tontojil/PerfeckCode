import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import { nativeConfig } from "../../scripts/install-opencode.mjs"

// Contract pinned to the OpenCode v2.1.2 agent and tool documentation:
// https://github.com/anomalyco/opencode/blob/v2.1.2/services/www/src/docs/content/agents.mdx
// https://github.com/anomalyco/opencode/blob/v2.1.2/services/www/src/docs/content/tools.mdx
// V2 launches children through the `subagent` tool; V1 called the same action `task`.
const root = resolve(import.meta.dir, "..")
const repo = resolve(root, "..")
const agentsDir = join(root, "agents")
const commandsDir = join(root, "commands")
const skillsDir = join(repo, "skills")
const teamCommands = ["equipo-programacion", "equipo-informes", "equipo-negocios", "equipo-sistemas"]
const changedPrompts = ["agents/perfeck.md", "AGENTS.md", ...teamCommands.map((name) => `commands/${name}.md`)]
const nonWriters = ["arquitecto-backend", "disenador-ui-ux", "revisor-codigo", "auditor-seguridad", "cazador-vulnerabilidades"]
const writeVerbs = /\b(implemente|implementa|implementar|escriba|escribe|escribir|edite|edita|editar|modifique|modifica|modificar|corrija|corrige|corregir|genere|genera|generar)\b/i
const expectedAgents = [
  "analista-datos", "arquitecto-backend", "auditor-anuncios", "auditor-seguridad",
  "cazador-vulnerabilidades", "depurador", "desarrollador-frontend", "disenador-ui-ux",
  "estratega-ceo", "estratega-marketing", "exito-cliente", "finanzas-cfo",
  "humanizador-informes", "ingeniero-calidad-qa", "ingeniero-despliegue", "ingeniero-linux",
  "ingeniero-observabilidad", "ingeniero-rendimiento", "ingeniero-windows", "jefe-nube-propia",
  "jefe-operaciones", "jefe-producto", "legal-cumplimiento", "mentor-programacion",
  "perfeck", "recursos-humanos", "redactor-tecnico", "representante-ventas", "revisor-codigo",
  "super-agente-sii", "trabajo-social", "tutor-inacap", "vendedor-redes",
]

type Agent = { data: Record<string, any>; body: string }

function read(path: string) {
  return readFileSync(join(root, path), "utf8")
}

function frontmatter(text: string, label: string): Agent {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text)
  if (!match) throw new Error(`Missing frontmatter: ${label}`)
  return { data: Bun.YAML.parse(match[1]) as Record<string, any>, body: match[2] }
}

function catalog() {
  return new Map(readdirSync(agentsDir).filter((name) => name.endsWith(".md")).map((name) => {
    const id = name.slice(0, -3)
    return [id, frontmatter(readFileSync(join(agentsDir, name), "utf8"), name)] as const
  }))
}

function commands() {
  return new Map(readdirSync(commandsDir).filter((name) => name.endsWith(".md")).map((name) => {
    const id = name.slice(0, -3)
    return [id, frontmatter(readFileSync(join(commandsDir, name), "utf8"), name)] as const
  }))
}

function config() {
  return Bun.JSONC.parse(read("opencode.jsonc")) as Record<string, any>
}

function subagentTargets(body: string) {
  return [...body.matchAll(/`subagent`\s+(?:con(?:\s+el\s+agente)?|a|para)?\s*`([a-z][a-z0-9-]+)`/g)]
    .map((match) => match[1])
}

function referencedSkills(text: string) {
  const stopwords = new Set(["a", "con", "de", "el", "en", "la", "para", "por", "que", "un", "una", "y"])
  const ids = [...text.matchAll(/skills?\s+(?:`([a-z][a-z0-9-]+)`|([a-z][a-z0-9-]+))/g)]
    .map((match) => match[1] ?? match[2])
    .filter((id) => !stopwords.has(id))
  return new Set(ids)
}

describe("PerfeckCode native V2 agent orchestration", () => {
  test("keeps the 33-agent catalog with one primary and 32 native subagents", () => {
    const agents = catalog()
    expect([...agents.keys()].sort()).toEqual([...expectedAgents].sort())
    expect([...agents].filter(([, agent]) => agent.data.mode === "primary").map(([id]) => id)).toEqual(["perfeck"])
    for (const [id, agent] of agents) {
      expect(agent.data.mode).toBe(id === "perfeck" ? "primary" : "subagent")
      expect(typeof agent.data.description).toBe("string")
      expect(agent.data.description.length).toBeGreaterThan(20)
      expect(agent.body.trim().length).toBeGreaterThan(0)
      expect(agent.data.model).toBeUndefined()
    }
  })

  test("resolves every command target and subagent reference to a real catalog agent", () => {
    const agents = catalog()
    const profile = config().agent.perfeck.permission
    expect(profile.question).toBe("allow")
    expect(profile.task["*"]).toBe("deny")
    // The V1 `task` map stays as the source template; the installer translates it
    // to the native V2 `subagent` action. Renaming it here would bypass that adapter.
    expect(profile.subagent).toBeUndefined()
    expect(Object.keys(profile.task).filter((name) => name !== "*").sort())
      .toEqual([...agents.keys()].filter((id) => id !== "perfeck").sort())

    for (const [name, command] of commands()) {
      if (command.data.agent !== undefined) {
        expect(agents.has(command.data.agent)).toBe(true)
        expect(["primary", "all"]).toContain(agents.get(command.data.agent)!.data.mode)
      }
      for (const target of subagentTargets(command.body)) {
        expect(agents.has(target)).toBe(true)
        expect(agents.get(target)!.data.mode).toBe("subagent")
      }
    }
    for (const name of teamCommands) expect(subagentTargets(commands().get(name)!.body).length).toBeGreaterThan(0)

    const native = nativeConfig(config())
    const rules = native.agents.perfeck.permissions.filter((rule: any) => rule.action === "subagent")
    expect(rules[0]).toEqual({ action: "subagent", resource: "*", effect: "deny" })
    for (const id of expectedAgents.filter((id) => id !== "perfeck")) {
      expect(rules).toContainEqual({ action: "subagent", resource: id, effect: "allow" })
    }
  })

  test("uses native V2 subagent wording without V1 Task delegation", () => {
    for (const path of changedPrompts) {
      const text = read(path)
      expect(text).not.toMatch(/\bTask\b/)
      expect(text).not.toMatch(/herramienta\s+Task/)
    }
    expect(read("agents/perfeck.md")).toContain("`subagent`")
    expect(read("AGENTS.md")).toContain("`subagent`")
    for (const name of teamCommands) expect(commands().get(name)!.body).toContain("`subagent`")
  })

  test("never assigns implementation writes to design or read-only roles", () => {
    for (const [, command] of commands()) {
      for (const line of command.body.split("\n")) {
        for (const role of nonWriters) {
          if (line.includes(`\`${role}\``)) expect(line).not.toMatch(writeVerbs)
        }
      }
    }

    const steps = commands().get("equipo-programacion")!.body.split("\n").filter((line) => /^\d+\.\s/.test(line))
    const design = steps.find((line) => line.startsWith("2."))!
    const implementation = steps.find((line) => line.startsWith("3."))!
    expect(design).toContain("`arquitecto-backend`")
    expect(design).toContain("no codigo final")
    expect(implementation).toContain("implemente usted")
    expect(implementation).toContain("`desarrollador-frontend`")
    for (const role of nonWriters) expect(implementation).not.toContain(`\`${role}\``)

    expect(read("agents/perfeck.md")).toMatch(/nunca les asigne escritura/i)
    expect(read("AGENTS.md")).toMatch(/no implementan c[oó]digo/i)
  })

  test("preserves clarification and human gates in primary guidance", () => {
    const gates = [read("agents/perfeck.md"), read("AGENTS.md")]
    for (const text of gates) {
      expect(text).toMatch(/ambig/i)
      expect(text).toMatch(/pregunte antes de (escribir|actuar)/i)
      expect(text).toMatch(/push,\s*merge,\s*deploy[\s\S]*sin\s+confirmaci[oó]n expl[ií]cita/is)
      expect(text).toMatch(/commit.*manos del usuario/is)
    }
    expect(read("commands/equipo-programacion.md")).toMatch(/push,\s*merge,\s*deploy[\s\S]*sin\s+confirmaci[oó]n expl[ií]cita/is)
  })

  test("resolves every referenced skill to a repository skill", () => {
    const available = new Set(readdirSync(skillsDir).filter((name) => statSync(join(skillsDir, name)).isDirectory()))
    const referenced = new Set<string>()
    for (const path of ["AGENTS.md", ...teamCommands.map((name) => `commands/${name}.md`), "commands/verify.md"]) {
      for (const skill of referencedSkills(read(path))) referenced.add(skill)
    }
    expect(referenced.size).toBeGreaterThan(0)
    for (const skill of referenced) expect(available.has(skill)).toBe(true)
  })

  test("inherits user-chosen models without provider pinning", () => {
    const source = config()
    expect(source.default_agent).toBe("perfeck")
    expect(source.model).toBeUndefined()
    expect(source.small_model).toBeUndefined()
    expect(source.provider).toBeUndefined()
    for (const profile of Object.values(source.agent ?? {}) as Record<string, any>[]) expect(profile.model).toBeUndefined()
    for (const [, agent] of catalog()) expect(agent.data.model).toBeUndefined()
    for (const [, command] of commands()) expect(command.data.model).toBeUndefined()
  })

  test("keeps perfeck as the single primary identity without the retired name", () => {
    expect(config().default_agent).toBe("perfeck")
    const primary = catalog().get("perfeck")!
    expect(primary.data.mode).toBe("primary")
    expect(primary.body.trimStart().startsWith("Usted es Perfeck")).toBe(true)
    for (const name of teamCommands) expect(commands().get(name)!.data.agent).toBe("perfeck")
    for (const path of [...changedPrompts, "opencode.jsonc", ...[...catalog().keys()].map((id) => `agents/${id}.md`)]) {
      expect(read(path)).not.toContain("tonto-jil")
    }
  })
})
