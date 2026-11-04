import { afterAll, expect, test } from "bun:test"
import { createHash } from "node:crypto"
import { tmpdir } from "node:os"
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const repo = resolve(import.meta.dir, "../..")
const homes: string[] = []
const owned = "---\nmode: primary\n---\nUsted es el agente principal tonto jil de opencode, con acceso total a herramientas.\n"
const rules = [{ action: "subagent", resource: "*", effect: "deny" }, { action: "subagent", resource: "depurador", effect: "allow" }]
function fixture(server: object) {
  const home = mkdtempSync(join(tmpdir(), "identity-migration-"))
  homes.push(home)
  const config = join(home, ".config/opencode")
  mkdirSync(config, { recursive: true })
  writeFileSync(join(config, "opencode.jsonc"), JSON.stringify(server))
  chmodSync(join(config, "opencode.jsonc"), 0o640)
  return { home, config }
}
function run(home: string) {
  const result = Bun.spawnSync([process.execPath, "-e", `import { installOpenCode } from ${JSON.stringify(join(repo, "scripts/install-opencode.mjs"))}; try { console.log(installOpenCode({ repo: ${JSON.stringify(repo)}, home: ${JSON.stringify(home)} })); } catch (error) { console.error(error.message); process.exitCode = 1; }`], { stdout: "pipe", stderr: "pipe" })
  return { code: result.exitCode, stdout: result.stdout.toString(), stderr: result.stderr.toString() }
}
function snapshot(path: string): unknown {
  return readdirSync(path).sort().map((name) => {
    const file = join(path, name), stat = statSync(file)
    return [name, stat.mode & 0o777, stat.isDirectory() ? snapshot(file) : createHash("sha256").update(readFileSync(file)).digest("hex")]
  })
}
function success(home: string, config: string) {
  expect(run(home)).toEqual({ code: 0, stdout: `${config}\n`, stderr: "" })
}

test("B1 rejects conflicting inline profiles before any destination writes", () => {
  for (const key of ["agents", "agent"]) {
    for (const default_agent of ["tonto-jil", "personal"]) {
      const old = key === "agents" ? { permissions: rules } : { permission: { task: { "*": "deny", depurador: "allow" } } }
      const { home, config } = fixture({ default_agent, [key]: { "tonto-jil": old, perfeck: { mode: "primary" } } })
      mkdirSync(join(config, "agent"))
      writeFileSync(join(config, "agent/tonto-jil.md"), owned)
      const before = snapshot(config)
      expect(run(home)).toEqual({ code: 1, stdout: "", stderr: `Conflicting ${key} profiles: tonto-jil and perfeck. Reconcile both profiles in ${join(config, "opencode.jsonc")} before installing; no files were changed.\n` })
      expect(snapshot(config)).toEqual(before)
    }
  }
})

test("B2 migrates both inline maps independently of personal defaults and preserves ordered rules", () => {
  for (const default_agent of ["personal", "tonto-jil", "perfeck"]) {
    const legacy = { permission: { task: { "*": "deny", depurador: "allow" }, edit: "deny" }, model: "provider/personal" }
    const native = { permissions: rules, mode: "primary" }
    const { home, config } = fixture({ default_agent, model: "provider/personal", agents: { "tonto-jil": native, personal: { mode: "primary" } }, agent: { "tonto-jil": legacy } })
    success(home, config)
    const path = join(config, "opencode.jsonc")
    expect(JSON.parse(readFileSync(path, "utf8"))).toEqual({ default_agent: default_agent === "tonto-jil" ? "perfeck" : default_agent, model: "provider/personal", agents: { personal: { mode: "primary" }, perfeck: native }, agent: { perfeck: legacy } })
    expect(statSync(path).mode & 0o777).toBe(0o640)
    expect(readdirSync(config).filter((name) => name.startsWith("opencode.jsonc.backup-"))).toHaveLength(1)
    const before = snapshot(config)
    success(home, config)
    expect(snapshot(config)).toEqual(before)
  }
})

test("B3 retires owned primaries in both supported directories but retains custom files", () => {
  for (const custom of [false, true]) {
    const { home, config } = fixture({ default_agent: "personal" })
    for (const dir of ["agent", "agents"]) {
      mkdirSync(join(config, dir))
      writeFileSync(join(config, dir, "tonto-jil.md"), custom ? "---\nmode: primary\n---\nMy personal agent.\n" : owned)
      chmodSync(join(config, dir, "tonto-jil.md"), 0o640)
    }
    success(home, config)
    for (const dir of ["agent", "agents"]) {
      const names = readdirSync(join(config, dir)).filter((name) => name.startsWith("tonto-jil.md"))
      expect(existsSync(join(config, dir, "tonto-jil.md"))).toBe(custom)
      if (custom) expect(names).toEqual(["tonto-jil.md"])
      else {
        expect(names.filter((name) => name.startsWith("tonto-jil.md.backup-"))).toHaveLength(1)
        expect(names.filter((name) => name.startsWith("tonto-jil.md.disabled-"))).toHaveLength(1)
      }
      for (const name of names) {
        expect(readFileSync(join(config, dir, name), "utf8")).toBe(custom ? "---\nmode: primary\n---\nMy personal agent.\n" : owned)
        expect(statSync(join(config, dir, name)).mode & 0o777).toBe(0o640)
      }
    }
    const before = snapshot(config)
    success(home, config)
    expect(snapshot(config)).toEqual(before)
  }
})

test("equivalent inline profiles can migrate without duplicating or reordering permissions", () => {
  const native = { permissions: rules }, legacy = { permission: { task: { "*": "deny", depurador: "allow" } } }
  const { home, config } = fixture({ default_agent: "tonto-jil", agents: { "tonto-jil": native, perfeck: native }, agent: { "tonto-jil": legacy, perfeck: legacy } })
  success(home, config)
  expect(JSON.parse(readFileSync(join(config, "opencode.jsonc"), "utf8"))).toEqual({ default_agent: "perfeck", agents: { perfeck: native }, agent: { perfeck: legacy } })
})

test("different permission ordering is a conflict even when the same rules appear in both profiles", () => {
  for (const key of ["agents", "agent"]) {
    const old = key === "agents" ? { permissions: rules } : { permission: { task: { "*": "deny", depurador: "allow" } } }
    const current = key === "agents" ? { permissions: [...rules].reverse() } : { permission: { task: { depurador: "allow", "*": "deny" } } }
    const { home, config } = fixture({ default_agent: "tonto-jil", [key]: { "tonto-jil": old, perfeck: current } })
    const before = snapshot(config)
    expect(run(home)).toEqual({ code: 1, stdout: "", stderr: `Conflicting ${key} profiles: tonto-jil and perfeck. Reconcile both profiles in ${join(config, "opencode.jsonc")} before installing; no files were changed.\n` })
    expect(snapshot(config)).toEqual(before)
  }
})

test("singular legacy-agent destinations are preflighted before installing assets", () => {
  const { home, config } = fixture({ default_agent: "personal" })
  mkdirSync(join(config, "agent"))
  const target = join(home, "untouched.md")
  writeFileSync(target, owned)
  symlinkSync(target, join(config, "agent/tonto-jil.md"))
  const before = snapshot(config)
  expect(run(home)).toEqual({ code: 1, stdout: "", stderr: `Symlink destination requires manual installation: ${join(config, "agent/tonto-jil.md")}\n` })
  expect(snapshot(config)).toEqual(before)
  expect(readFileSync(target, "utf8")).toBe(owned)
})

afterAll(() => homes.forEach((home) => rmSync(home, { recursive: true })))
