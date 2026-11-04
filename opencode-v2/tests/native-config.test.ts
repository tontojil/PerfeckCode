import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"

const root = new URL("../", import.meta.url)
const read = (path: string) => readFileSync(new URL(path, root), "utf8")

// Regresion del ajuste pedido en revision: sin tui.jsonc roto, tema en cli.json,
// skills con confirmacion e identidad Perfeck en los plugins nativos.
describe("native V2 configuration after review", () => {
  test("does not ship the obsolete tui.jsonc that required a missing Herdr plugin", () => {
    expect(existsSync(new URL("tui.jsonc", root))).toBe(false)
  })

  test("keeps the theme in cli.json and gates every skill behind confirmation", () => {
    const cli = JSON.parse(read("cli.json"))
    expect(cli.theme).toEqual({ name: "perfeckcode", mode: "dark" })
    const server = Bun.JSONC.parse(read("opencode.jsonc"))
    expect(server.permission.skill).toEqual({ "*": "ask" })
  })

  test("uses Perfeck plugin ids and drops the old banner filename", () => {
    expect(read("plugins/guard.js")).toContain('id: "perfeck-guard"')
    expect(read("plugins/perfeck-banner.js")).toContain('id: "perfeck-banner"')
    expect(read("plugins/perfeck-banner.js")).toContain("Perfeck")
    expect(existsSync(new URL("plugins/tonto-jil-banner.js", root))).toBe(false)
  })
})
