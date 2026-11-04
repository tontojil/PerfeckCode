import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"

const action = (name) => ({ bash: "shell", task: "subagent", write: "edit" })[name] ?? name
function permissions(input = {}) {
  return Object.entries(input).flatMap(([name, value]) =>
    Object.entries(typeof value === "string" ? { "*": value } : value)
      .map(([resource, effect]) => ({ action: action(name), resource, effect })))
}

// Conserva las reglas existentes; solo traduce sus nombres a la API V2.
export function nativeConfig(legacy) {
  return {
    $schema: "https://opencode.ai/config.json",
    formatter: legacy.formatter,
    default_agent: legacy.default_agent,
    mcp: { servers: legacy.mcp },
    permissions: permissions(legacy.permission),
    agents: Object.fromEntries(Object.entries(legacy.agent ?? {}).map(([name, value]) =>
      [name, { permissions: permissions(value.permission) }])),
    experimental: { todo: true },
  }
}

function backup(path) {
  if (!existsSync(path)) return
  let suffix = `${path}.backup-${Date.now()}`
  while (existsSync(suffix)) suffix += "-1"
  copyFileSync(path, suffix)
}

function write(path, bytes) {
  if (existsSync(path) && readFileSync(path).equals(Buffer.from(bytes))) return
  mkdirSync(dirname(path), { recursive: true })
  backup(path)
  const temp = `${path}.${process.pid}.tmp`
  const mode = existsSync(path) ? statSync(path).mode & 0o777 : 0o600
  writeFileSync(temp, bytes, { flag: "wx", mode })
  renameSync(temp, path)
}

export function installOpenCode({ repo, home = homedir(), configDir = join(home, ".config/opencode") }) {
  // Modo dual: la fuente V2 vive en opencode-v2/; se conserva opencode/ como fallback.
  const source = join(repo, existsSync(join(repo, "opencode-v2")) ? "opencode-v2" : "opencode")
  const cliPath = join(configDir, "cli.json")
  const prior = existsSync(cliPath) ? JSON.parse(readFileSync(cliPath, "utf8")) : {}
  if (!prior || Array.isArray(prior) || typeof prior !== "object") throw new Error("cli.json must be an object")
  if (prior.plugins !== undefined && !Array.isArray(prior.plugins)) throw new Error("cli.json plugins must be an array")
  const defaults = JSON.parse(readFileSync(join(source, "cli.json"), "utf8"))
  const files = new Map()
  const collect = (fromDir, target) => {
    for (const entry of readdirSync(fromDir, { withFileTypes: true })) {
      const from = join(fromDir, entry.name), to = join(target, entry.name)
      if (entry.isDirectory()) collect(from, to)
      else files.set(to, readFileSync(from))
    }
  }
  collect(join(source, "plugins/perfeckcode"), join(configDir, "plugins/perfeckcode"))
  collect(join(source, "commands"), join(configDir, "commands"))
  for (const entry of readdirSync(join(source, "agents"))) {
    const text = readFileSync(join(source, "agents", entry), "utf8")
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
    if (!match) throw new Error(`Invalid agent frontmatter: ${entry}`)
    const header = Bun.YAML.parse(match[1])
    if (header.permission) {
      header.permissions = permissions(header.permission)
    }
    files.set(join(configDir, "agents", entry), `---\n${Bun.YAML.stringify(header).trimEnd()}\n---${text.slice(match[0].length)}`)
  }
  for (const name of ["AGENTS.md", "plugins/guard.js", "themes/perfeckcode.json"]) {
    files.set(join(configDir, name), readFileSync(join(source, name)))
  }
  const packagePath = join(configDir, "package.json")
  const priorPackage = existsSync(packagePath) ? JSON.parse(readFileSync(packagePath, "utf8")) : {}
  const dependency = JSON.parse(readFileSync(join(source, "package.json"), "utf8")).dependencies
  files.set(packagePath, JSON.stringify({ ...priorPackage, private: true,
    dependencies: { ...priorPackage.dependencies, ...dependency } }, null, 2) + "\n")
  const serverPath = join(configDir, "opencode.jsonc")
  if (!existsSync(serverPath)) {
    files.set(serverPath, JSON.stringify(nativeConfig(Bun.JSONC.parse(readFileSync(join(source, "opencode.jsonc"), "utf8"))), null, 2) + "\n")
  } else {
    const server = Bun.JSONC.parse(readFileSync(serverPath, "utf8"))
    let migrated = false
    if (server.default_agent === "tonto-jil") {
      server.default_agent = "perfeck"
      migrated = true
    }
    for (const key of ["agents", "agent"]) {
      const profiles = server[key]
      if (profiles && Object.hasOwn(profiles, "tonto-jil")) {
        // Compara sin ordenar: el orden de las reglas de permisos es significativo.
        if (Object.hasOwn(profiles, "perfeck") && JSON.stringify(profiles.perfeck) !== JSON.stringify(profiles["tonto-jil"])) {
          throw new Error(`Conflicting ${key} profiles: tonto-jil and perfeck. Reconcile both profiles in ${serverPath} before installing; no files were changed.`)
        }
        profiles.perfeck = profiles["tonto-jil"]
        delete profiles["tonto-jil"]
        migrated = true
      }
    }
    if (migrated) files.set(serverPath, JSON.stringify(server, null, 2) + "\n")
  }
  files.set(cliPath, JSON.stringify({
    ...defaults, ...prior,
    $schema: defaults.$schema,
    theme: defaults.theme,
    session: { ...prior.session, ...defaults.session },
    diffs: { ...defaults.diffs, ...prior.diffs },
    plugins: [...(prior.plugins ?? []).filter((entry) =>
      (typeof entry === "string" ? entry : entry.package) !== "./plugins/perfeckcode"), ...defaults.plugins],
  }, null, 2) + "\n")
  // Rechaza enlaces antes de escribir para no modificar dotfiles fuera del destino.
  const oldPrimaries = ["agent", "agents"].map((dir) => join(configDir, dir, "tonto-jil.md"))
  for (const path of [...files.keys(), ...oldPrimaries, join(configDir, "plugins/tonto-jil-banner.js")]) {
    for (let part = path; part !== dirname(configDir); part = dirname(part)) {
      if (existsSync(part) && lstatSync(part).isSymbolicLink()) throw new Error(`Symlink destination requires manual installation: ${part}`)
    }
  }
  for (const [path, bytes] of files) write(path, bytes)
  const oldBanner = join(configDir, "plugins/tonto-jil-banner.js")
  if (existsSync(oldBanner)) {
    backup(oldBanner)
    renameSync(oldBanner, `${oldBanner}.disabled-${Date.now()}`)
  }
  for (const oldPrimary of oldPrimaries) {
    if (existsSync(oldPrimary) && readFileSync(oldPrimary, "utf8").includes("Usted es el agente principal tonto jil de opencode")) {
      backup(oldPrimary)
      renameSync(oldPrimary, `${oldPrimary}.disabled-${Date.now()}`)
    }
  }
  return configDir
}

export function checkRuntime() {
  for (const name of ["opencode2", "opencode"]) {
    try {
      const result = Bun.spawnSync([name, "--version"], { stdout: "pipe", stderr: "pipe" })
      if (result.exitCode === 0 && /(?:^|\s)v?2\./.test(result.stdout.toString())) return name
    } catch (error) {
      if (error.code !== "ENOENT") throw error
    }
  }
  throw new Error("OpenCode V2 is required. V1 configuration was not changed.")
}

if (import.meta.main) {
  try {
    if (process.argv.includes("--help")) console.log("Usage: bun scripts/install-opencode.mjs [--check-runtime]\nInstalls V2 appearance with backups. Requires OpenCode V2; respects XDG_CONFIG_HOME.")
    else {
      if (process.argv.slice(2).some((arg) => arg !== "--check-runtime")) throw new Error("Unknown argument; use --help")
      checkRuntime()
      if (!process.argv.includes("--check-runtime")) {
        const configDir = join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "opencode")
        console.log(`Installed PerfeckCode V2: ${installOpenCode({ repo: resolve(import.meta.dir, ".."), configDir })}`)
      }
    }
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
