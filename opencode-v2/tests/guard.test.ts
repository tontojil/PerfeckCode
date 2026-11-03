import { afterAll, expect, mock, test } from "bun:test"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"

mock.module("@opencode/plugin", () => ({ Plugin: { define: (definition: unknown) => definition } }))
const guard = (await import("../plugins/guard.js")).default as {
  setup: (context: unknown) => Promise<void>
}

type Hook = (event: unknown) => void

const DESTRUCTIVE = "Bloqueado por guard Perfeck: comando destructivo o secreto"
const EXISTING_TEST = "Bloqueado por guard Perfeck: edicion de test existente. Indique que test, por que y que queda cubierto."
const PRIVATE_CREDENTIAL = "Bloqueado por guard Perfeck: posible credencial privada"

// Synthetic shapes only: no real credential literals live in this file.
const fill = (char: string, count: number) => char.repeat(count)
const token = (...parts: Array<string | number>) =>
  parts.map((part) => (typeof part === "number" ? fill("x", part) : part)).join("")

const openAiClassic = token("sk-", 20, "T3BlbkFJ", 16)
const stripePublishable = token("pk_live_", 24)
const awsAccessKeyId = token("AKIA", 16, "U")
const serviceAccount = token(12, "-", 32, "@developer.gserviceaccount.com")

const scratch = join(tmpdir(), "opencode")
const workspaces: string[] = []

function workspace(): string {
  mkdirSync(scratch, { recursive: true })
  const root = mkdtempSync(join(scratch, "perfeck-guard-"))
  workspaces.push(root)
  return root
}

function fixture(root: string, relative: string, content = ""): string {
  const path = join(root, relative)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
  return path
}

async function register(directory: string): Promise<Hook> {
  let hook: Hook | undefined
  await guard.setup({
    location: { directory },
    tool: {
      hook: async (name: string, callback: Hook) => {
        expect(name).toBe("execute.before")
        hook = callback
      },
    },
  })
  if (!hook) throw new Error("guard did not register execute.before")
  return hook
}

afterAll(() => {
  for (const root of workspaces) rmSync(root, { recursive: true, force: true })
})

test("preserves destructive command checks for native shell and legacy bash", async () => {
  const before = await register(workspace())
  for (const tool of ["shell", "bash"]) {
    expect(() => before({ tool, input: { command: "sudo rm /example" } })).toThrow(DESTRUCTIVE)
    expect(() => before({ tool, input: { command: "echo ok > .env" } })).toThrow(DESTRUCTIVE)
    expect(() => before({ tool, input: { command: "mkfs.example" } })).toThrow(DESTRUCTIVE)
    expect(() => before({ tool, input: { command: "git status" } })).not.toThrow()
  }
})

test("preserves existing-test protection through read-only filesystem existence", async () => {
  const root = workspace()
  fixture(root, "tests/existing.test.ts", "export {}\n")
  const before = await register(root)
  const editInput = { path: "tests/existing.test.ts", oldString: "a", newString: "b" }

  expect(() => before({ tool: "edit", input: editInput })).toThrow(EXISTING_TEST)
  expect(() => before({ tool: "write", input: { path: "tests/existing.test.ts", content: "export {}\n" } }))
    .toThrow(EXISTING_TEST)
  expect(() => before({ tool: "edit", input: { ...editInput, path: "tests\\existing.test.ts" } }))
    .toThrow(EXISTING_TEST)
  expect(() => before({ tool: "write", input: { path: join(root, "tests/existing.test.ts"), content: "" } }))
    .toThrow(EXISTING_TEST)
  expect(() => before({
    tool: "patch",
    input: { patchText: "*** Begin Patch\n*** Update File: tests/existing.test.ts\n@@\n-a\n+b\n*** End Patch" },
  })).toThrow(EXISTING_TEST)
})

test("allows new test creation with write, edit and patch while normal files still pass", async () => {
  const root = workspace()
  fixture(root, "tests/existing.test.ts", "export {}\n")
  fixture(root, "src/example.ts", "export const value = 1\n")
  const before = await register(root)

  expect(() => before({ tool: "write", input: { path: "tests/new.test.ts", content: "test('ok', () => {})\n" } }))
    .not.toThrow()
  expect(() => before({ tool: "edit", input: { path: "tests/another.spec.ts", oldString: "a", newString: "b" } }))
    .not.toThrow()
  expect(() => before({ tool: "write", input: { path: "tests\\windows-new.test.ts", content: "" } }))
    .not.toThrow()
  expect(() => before({
    tool: "patch",
    input: { patchText: "*** Begin Patch\n*** Add File: tests/patched.test.ts\n+test('ok', () => {})\n*** End Patch" },
  })).not.toThrow()
  expect(() => before({ tool: "write", input: { path: "src/new.ts", content: "export const fresh = 2\n" } }))
    .not.toThrow()
  expect(() => before({ tool: "edit", input: { path: "src/example.ts", oldString: "1", newString: "2" } }))
    .not.toThrow()
  expect(() => before({ tool: "edit", input: { filePath: "src/legacy.ts", oldText: "a", newText: "b" } }))
    .not.toThrow()
})

test("rejects private credentials in every native input with label-only errors and no mutation", async () => {
  const root = workspace()
  fixture(root, "src/example.ts", "export const value = 1\n")
  const before = await register(root)
  const cases = [
    { tool: "shell", input: { command: `echo ${openAiClassic}` } },
    { tool: "bash", input: { command: `echo ${openAiClassic}` } },
    { tool: "write", input: { path: "src/new.ts", content: `const key = "${openAiClassic}"\n` } },
    { tool: "edit", input: { path: "src/example.ts", oldString: "1", newString: openAiClassic } },
    { tool: "edit", input: { path: "src/example.ts", oldString: openAiClassic, newString: "1" } },
    { tool: "patch", input: { patchText: `*** Begin Patch\n*** Update File: src/example.ts\n@@\n-1\n+${openAiClassic}\n*** End Patch` } },
    { tool: "write", input: { path: "tests/new-secret.test.ts", content: openAiClassic } },
    { tool: "patch", input: { patchText: `*** Begin Patch\n*** Add File: tests/new-secret.test.ts\n+${openAiClassic}\n*** End Patch` } },
  ]

  for (const { tool, input } of cases) {
    const snapshot = structuredClone(input)
    let caught: unknown
    try {
      before({ tool, input })
    } catch (error) {
      caught = error
    }
    expect(caught, tool).toBeInstanceOf(Error)
    const message = (caught as Error).message
    expect(message, tool).toBe(
      `${PRIVATE_CREDENTIAL} (OpenAI API key). Revise el contenido antes de proceder.`,
    )
    expect(message, tool).not.toContain(openAiClassic)
    expect(message, tool).not.toContain("echo")
    expect(input, tool).toEqual(snapshot)
  }
})

test("does not treat public identifiers or obvious placeholders as private credentials", async () => {
  const root = workspace()
  const before = await register(root)
  const allowed = [stripePublishable, awsAccessKeyId, serviceAccount, "ssh-rsa AAAApublicmaterial"]

  for (const value of allowed) {
    expect(() => before({ tool: "write", input: { path: "src/public.txt", content: value } }), value)
      .not.toThrow()
    expect(() => before({ tool: "shell", input: { command: `echo ${value}` } }), value).not.toThrow()
  }
  expect(() => before({
    tool: "write",
    input: { path: "docs/example.md", content: 'api_key = "your-placeholder-key-value-here"' },
  })).not.toThrow()
})

test("ignores events and tools without a guarded native input shape", async () => {
  const before = await register(workspace())
  expect(() => before(undefined)).not.toThrow()
  expect(() => before({ tool: "read", input: { path: "tests/missing.test.ts" } })).not.toThrow()
  expect(() => before({ tool: "shell", input: {} })).not.toThrow()
  expect(() => before({ tool: "write", input: { path: "" } })).not.toThrow()
  expect(() => before({ tool: "write" })).not.toThrow()
})
