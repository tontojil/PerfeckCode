import { expect, test } from "bun:test"
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { installOpenCode } from "../../scripts/install-opencode.mjs"

test("every installed agent keeps standalone frontmatter fences for the native loader", () => {
  const home = mkdtempSync(join(tmpdir(), "agent-fences-"))
  try {
    installOpenCode({ repo: resolve(import.meta.dir, "../.."), home })
    const directory = join(home, ".config/opencode/agents")
    for (const name of readdirSync(directory)) {
      expect(readFileSync(join(directory, name), "utf8"), name).toMatch(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
    }
  } finally {
    rmSync(home, { recursive: true })
  }
})

test("shared agent files retain V1 restrictions alongside equivalent native V2 rules", () => {
  const repo = resolve(import.meta.dir, "../..")
  const home = mkdtempSync(join(tmpdir(), "agent-permissions-"))
  try {
    installOpenCode({ repo, home })
    for (const name of readdirSync(join(repo, "opencode/agents"))) {
      const parse = (path: string) => Bun.YAML.parse(/^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(path, "utf8"))![1])
      const source = parse(join(repo, "opencode/agents", name))
      const installed = parse(join(home, ".config/opencode/agents", name))
      if (!source.permission) continue
      expect(installed.permission).toEqual(source.permission)
      for (const [key, value] of Object.entries(source.permission)) {
        for (const [resource, effect] of Object.entries(typeof value === "string" ? { "*": value } : value as object)) {
          expect(installed.permissions).toContainEqual({
            action: key === "bash" ? "shell" : key === "task" ? "subagent" : key,
            resource,
            effect,
          })
        }
      }
    }
  } finally {
    rmSync(home, { recursive: true })
  }
})
