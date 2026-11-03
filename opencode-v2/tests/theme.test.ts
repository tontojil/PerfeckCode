import { describe, expect, test } from "bun:test"

// Contract pinned to OpenCode v2.1.2, not the incompatible V1 theme format:
// https://github.com/anomalyco/opencode/blob/v2.1.2/packages/theme/src/tui/schema.ts
// https://github.com/anomalyco/opencode/blob/v2.1.2/packages/theme/src/tui/resolve.ts
// https://github.com/anomalyco/opencode/blob/v2.1.2/packages/tui/src/theme/assets/v2/opencode.json
// Published https://opencode.ai/theme.json returned 404 when checked.
// This dependency-free validator covers our fully explicit, dark-only subset.
type Tree = { [key: string]: unknown }
const states = ["base", "$hovered", "$focused", "$pressed", "$selected", "$disabled"]
const variants = ["primary", "secondary", "destructive"]
const feedback = ["error", "warning", "success", "info"]
const hues = ["gray", "red", "orange", "yellow", "green", "cyan", "blue", "purple", "accent", "interactive", "neutral"]
const steps = ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
const syntax = ["comment", "keyword", "function", "variable", "string", "number", "type", "operator", "punctuation"]
const markdown = ["text", "heading", "link", "linkText", "code", "blockQuote", "emphasis", "strong", "horizontalRule", "listItem", "listEnumeration", "image", "imageText", "codeBlock"]
const hex = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i
const hueColor = /^(?:#[\da-f]{3}|#[\da-f]{4}|#[\da-f]{6}|#[\da-f]{8}|\$hue\..+\.(?:100|200|300|400|500|600|700|800|900))$/i

function record(value: unknown): Tree {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected object")
  return value as Tree
}

function at(tree: unknown, path: string): unknown {
  return path.split(".").reduce((value, key) => record(value)[key], tree)
}

function keys(value: unknown, expected: string[]) {
  expect(Object.keys(record(value)).sort()).toEqual([...expected].sort())
}

function leaves(value: unknown, prefix = ""): string[] {
  return Object.entries(record(value)).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof child === "object" ? leaves(child, path) : [path]
  })
}

// Independent required paths from CompleteThemeTokensDefinition. Include optional
// states/faint/feedback.muted explicitly as this theme promises no missing tokens.
const tokenPaths = [
  "text.base", "text.muted", "text.faint", "background.base",
  ...["base", "high", "max"].map((key) => `background.raised.${key}`),
  ...["text", "background"].flatMap((group) => [
    ...variants.flatMap((variant) => states.map((state) => `${group}.action.${variant}.${state}`)),
    ...states.map((state) => `${group}.formfield.${state}`),
    ...feedback.flatMap((kind) => (group === "text" ? ["base", "muted"] : ["base"])
      .map((key) => `${group}.feedback.${kind}.${key}`)),
  ]),
  "border.base", "scrollbar.base",
  ...["added", "removed", "context", "hunkHeader"].map((key) => `diff.text.${key}`),
  ...["added", "removed", "context"].map((key) => `diff.background.${key}`),
  ...["added", "removed"].map((key) => `diff.highlight.${key}`),
  "diff.lineNumber.text",
  ...["added", "removed"].map((key) => `diff.lineNumber.background.${key}`),
  ...syntax.map((key) => `syntax.${key}`),
  ...markdown.map((key) => `markdown.${key}`),
]

function parse(input: unknown) {
  const document = record(input)
  keys(document, ["$schema", "base", "dark"])
  expect(document.$schema).toBe("https://opencode.ai/theme.json")
  const base = record(document.base)
  const { categorical, "@dialog": dialog, ...tokens } = base
  expect(leaves(tokens).sort()).toEqual([...tokenPaths].sort())
  keys(document.dark, ["hue"])
  const palette = record(at(document, "dark.hue"))
  keys(palette, hues)

  function scale(name: string, stack: string[] = []): Tree {
    if (stack.includes(name)) throw new Error("Circular hue reference")
    const value = palette[name]
    if (typeof value === "string") {
      const match = /^\$hue\.([a-z]+)$/.exec(value)
      if (!match) throw new Error("Invalid hue alias")
      return scale(match[1], [...stack, name])
    }
    const result = record(value)
    keys(result, steps)
    for (const color of Object.values(result)) {
      if (typeof color !== "string" || !hex.test(color)) throw new Error("Invalid hue color")
    }
    return result
  }

  const hue = Object.fromEntries(hues.map((name) => [name, scale(name)]))
  if (!Array.isArray(categorical) || !categorical.length) throw new Error("Missing categorical hues")
  for (const name of categorical) {
    if (typeof name !== "string" || !hue[name]) throw new Error("Missing categorical hue")
  }

  function view(surface: Tree) {
    const source = { ...surface, hue }
    function color(path: string, stack: string[] = []): string {
      if (stack.includes(path)) throw new Error("Circular color reference")
      const value = at(source, path)
      if (typeof value !== "string") throw new Error(`Missing color: ${path}`)
      if (hex.test(value) || value === "transparent") return value.toLowerCase()
      if (!value.startsWith("$")) throw new Error(`Invalid color: ${path}`)
      return color(value.slice(1), [...stack, path])
    }
    for (const path of tokenPaths) color(path)
    return color
  }

  for (const path of [...syntax.map((key) => `syntax.${key}`), ...markdown.map((key) => `markdown.${key}`)]) {
    expect(at(tokens, path)).toMatch(hueColor)
  }
  keys(dialog, ["background"])
  keys(at(dialog, "background"), ["base"])
  const color = view(tokens)
  const dialogColor = view({ ...tokens, background: { ...record(tokens.background), ...record(at(dialog, "background")) } })
  return { color, dialogColor, hue, categorical }
}

async function theme() {
  return JSON.parse(await Bun.file(new URL("../themes/perfeckcode.json", import.meta.url)).text())
}

function luminance(color: string) {
  const channels = color.slice(1).match(/../g)!.map((part) => parseInt(part, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

describe("PerfeckCode native V2.1.2 theme", () => {
  test("parses a complete base, dark palette, states and contextual colors without host defaults", async () => {
    const resolved = parse(await theme())
    expect(resolved.dialogColor("background.base")).toBe("#141419")
    expect(resolved.color("background.base")).toBe("#0a0a0d")
    expect(resolved.categorical[0]).toBe("blue")
  })

  test("resolves screenshot surfaces, amber emphasis, blue interaction and feedback", async () => {
    const { color, hue } = parse(await theme())
    const expected = {
      "background.base": "#0a0a0d",
      "background.raised.base": "#141419",
      "background.raised.high": "#1f1f25",
      "background.formfield.base": "#1f1f25",
      "text.base": "#e6e4e0",
      "text.muted": "#8b8b93",
      "markdown.heading": "#e6b36a",
      "syntax.keyword": "#e6b36a",
      "text.formfield.$focused": "#7aa2f7",
      "text.feedback.info.base": "#7aa2f7",
      "text.feedback.success.base": "#9ece6a",
      "text.feedback.error.base": "#f7768e",
    }
    for (const [path, value] of Object.entries(expected)) expect(color(path)).toBe(value)
    expect(hue.accent["200"]).toBe("#e6b36a")
    expect(hue.interactive["200"]).toBe("#7aa2f7")
  })

  test("keeps text, muted labels, syntax, feedback and action states readable", async () => {
    const { color } = parse(await theme())
    const surfaces = ["background.base", "background.raised.base", "background.raised.high"]
    for (const surface of surfaces) {
      for (const text of ["text.base", "text.muted", ...syntax.map((key) => `syntax.${key}`)]) {
        expect(contrast(color(text), color(surface))).toBeGreaterThanOrEqual(4.5)
      }
    }
    for (const kind of feedback) {
      for (const token of ["base", "muted"]) {
        expect(contrast(color(`text.feedback.${kind}.${token}`), color(`background.feedback.${kind}.base`)))
          .toBeGreaterThanOrEqual(4.5)
      }
    }
    for (const variant of variants) {
      for (const state of states) {
        const bg = color(`background.action.${variant}.${state}`)
        expect(contrast(color(`text.action.${variant}.${state}`), bg === "transparent" ? color("background.base") : bg))
          .toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  test("dark hue scales follow V2 light-to-dark contrast direction", async () => {
    const { hue } = parse(await theme())
    for (const scale of Object.values(hue)) {
      for (let i = 1; i < steps.length; i++) {
        expect(luminance(scale[steps[i - 1]] as string)).toBeGreaterThan(luminance(scale[steps[i]] as string))
      }
    }
  })

  test("contract check rejects incomplete files and broken references", async () => {
    const input = await theme()
    const missing = structuredClone(input)
    delete missing.base.diff.lineNumber.background.removed
    expect(() => parse(missing)).toThrow()
    const broken = structuredClone(input)
    broken.base.text.base = "$hue.absent.200"
    expect(() => parse(broken)).toThrow()
    const cycle = structuredClone(input)
    cycle.dark.hue.accent = "$hue.accent"
    expect(() => parse(cycle)).toThrow("Circular hue reference")
    const tokenCycle = structuredClone(input)
    tokenCycle.base.text.base = "$text.base"
    expect(() => parse(tokenCycle)).toThrow("Circular color reference")
    const invalidSyntax = structuredClone(input)
    invalidSyntax.base.syntax.keyword = "$text.base"
    expect(() => parse(invalidSyntax)).toThrow()
  })
})
