import { afterAll, describe, expect, test } from "bun:test"
import { chmodSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { installOpenCode } from "../../scripts/install-opencode.mjs"

const repo = resolve(import.meta.dir, "../..")
const homes: string[] = []
const home = () => {
  const path = mkdtempSync(join(tmpdir(), "perfeck-install-"))
  homes.push(path)
  return path
}

describe("native V2 installation", () => {
  test("installs the selected theme, sidebar and all agents using portable native V2 config", () => {
    const root = home()
    installOpenCode({ repo, home: root })
    const config = join(root, ".config/opencode")
    const cli = JSON.parse(readFileSync(join(config, "cli.json"), "utf8"))
    expect(cli.theme).toEqual({ name: "perfeckcode", mode: "dark" })
    expect(cli.session).toMatchObject({ sidebar: "auto", thinking: "hide", scrollbar: false })
    expect(cli.plugins).toContainEqual({ package: "./plugins/perfeckcode" })
    expect(readdirSync(join(config, "agents"))).toHaveLength(33)
    expect(JSON.parse(readFileSync(join(config, "themes/perfeckcode.json"), "utf8")).base).toBeDefined()
    expect(readFileSync(join(config, "plugins/perfeckcode/tui.tsx"), "utf8")).toContain('append: "sidebar.content"')
    const server = Bun.JSONC.parse(readFileSync(join(config, "opencode.jsonc"), "utf8"))
    expect(server.default_agent).toBe("perfeck")
    expect(server.experimental.todo).toBe(true)
    expect(server.permissions).toContainEqual({ action: "shell", resource: "rm -rf *", effect: "deny" })
    expect(server.agents.perfeck.permissions.filter((rule) => rule.action === "subagent")[0])
      .toEqual({ action: "subagent", resource: "*", effect: "deny" })
    expect(existsSync(join(config, "agents/perfeck.md"))).toBe(true)
    expect(existsSync(join(config, "agents/tonto-jil.md"))).toBe(false)
    for (const name of readdirSync(join(config, "commands"))) {
      const command = readFileSync(join(config, "commands", name), "utf8")
      expect(command).not.toContain("agent: tonto-jil")
    }
    expect(readFileSync(join(config, "agents/revisor-codigo.md"), "utf8")).toContain("permissions:")
  })

  test("preserves unrelated CLI settings, plugins, themes, V1 config and Claude settings across reinstall", () => {
    const root = home()
    const config = join(root, ".config/opencode")
    mkdirSync(join(config, "themes"), { recursive: true })
    writeFileSync(join(config, "cli.json"), JSON.stringify({ mouse: false, session: { tps: false, sidebar: "hide" }, plugins: ["other-plugin"] }))
    writeFileSync(join(config, "themes/personal.json"), "personal theme")
    writeFileSync(join(config, "tui.json"), "untouched V1 UI")
    writeFileSync(join(config, "opencode.json"), "{\"personal\":true}")
    mkdirSync(join(root, ".claude"))
    writeFileSync(join(root, ".claude/settings.json"), "untouched Claude")
    installOpenCode({ repo, home: root })
    const first = readFileSync(join(config, "cli.json"), "utf8")
    installOpenCode({ repo, home: root })
    expect(readFileSync(join(config, "cli.json"), "utf8")).toBe(first)
    const cli = JSON.parse(first)
    expect(cli.mouse).toBe(false)
    expect(cli.session.tps).toBe(false)
    expect(cli.session.sidebar).toBe("auto")
    expect(cli.plugins).toEqual(["other-plugin", { package: "./plugins/perfeckcode" }])
    expect(readdirSync(config).some((name) => name.startsWith("cli.json.backup-"))).toBe(true)
    expect(readFileSync(join(config, "themes/personal.json"), "utf8")).toBe("personal theme")
    expect(readFileSync(join(config, "tui.json"), "utf8")).toBe("untouched V1 UI")
    expect(readFileSync(join(config, "opencode.json"), "utf8")).toBe('{"personal":true}')
    expect(readFileSync(join(root, ".claude/settings.json"), "utf8")).toBe("untouched Claude")
  })

  test("rejects invalid CLI JSON before writing any assets", () => {
    const root = home()
    const config = join(root, ".config/opencode")
    mkdirSync(config, { recursive: true })
    writeFileSync(join(config, "cli.json"), "{bad JSON}")
    expect(() => installOpenCode({ repo, home: root })).toThrow()
    expect(readdirSync(config)).toEqual(["cli.json"])
    expect(readFileSync(join(config, "cli.json"), "utf8")).toBe("{bad JSON}")
  })

  test("migrates the former primary identity without losing its restrictions or personal settings", () => {
    const root = home()
    const config = join(root, ".config/opencode")
    mkdirSync(join(config, "agents"), { recursive: true })
    const legacyAgent = "---\nmode: primary\n---\nUsted es el agente principal tonto jil de opencode, con acceso total a\nherramientas.\n"
    writeFileSync(join(config, "agents/tonto-jil.md"), legacyAgent)
    const serverPath = join(config, "opencode.jsonc")
    const rules = [{ action: "subagent", resource: "*", effect: "deny" }, { action: "subagent", resource: "depurador", effect: "allow" }]
    writeFileSync(serverPath, JSON.stringify({ default_agent: "tonto-jil", model: "provider/personal-model",
      agents: { "tonto-jil": { permissions: rules }, personal: { mode: "subagent" } } }))
    chmodSync(serverPath, 0o600)
    installOpenCode({ repo, home: root })
    const installed = Bun.JSONC.parse(readFileSync(serverPath, "utf8"))
    expect(installed.default_agent).toBe("perfeck")
    expect(installed.agents.perfeck.permissions).toEqual(rules)
    expect(installed.agents).not.toHaveProperty("tonto-jil")
    expect(installed.model).toBe("provider/personal-model")
    expect(installed.agents.personal).toEqual({ mode: "subagent" })
    expect(statSync(serverPath).mode & 0o777).toBe(0o600)
    expect(existsSync(join(config, "agents/tonto-jil.md"))).toBe(false)
    expect(readdirSync(join(config, "agents")).some((name) => name.startsWith("tonto-jil.md.disabled-"))).toBe(true)
    const backup = readdirSync(config).find((name) => name.startsWith("opencode.jsonc.backup-"))!
    expect(Bun.JSONC.parse(readFileSync(join(config, backup), "utf8")).default_agent).toBe("tonto-jil")
  })

  test("keeps an unrelated personal default and its config bytes and mode unchanged", () => {
    const root = home()
    const config = join(root, ".config/opencode")
    mkdirSync(config, { recursive: true })
    const path = join(config, "opencode.jsonc")
    const bytes = '// Personal configuration\n{"default_agent":"personal","agents":{"personal":{"mode":"primary"}}}\n'
    writeFileSync(path, bytes)
    chmodSync(path, 0o640)
    installOpenCode({ repo, home: root })
    installOpenCode({ repo, home: root })
    expect(readFileSync(path, "utf8")).toBe(bytes)
    expect(statSync(path).mode & 0o777).toBe(0o640)
    expect(readdirSync(config).filter((name) => name.startsWith("opencode.jsonc.backup-"))).toEqual([])
  })
})

afterAll(() => homes.forEach((path) => rmSync(path, { recursive: true })))
