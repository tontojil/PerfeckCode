import { describe, expect, test } from "bun:test"
import {
  SECRET_RULES,
  extractPatchPaths,
  findSecretLabels,
  isTestPath,
  resolveWorkspacePath,
  secretInputText,
  testTargetPaths,
} from "../plugins/perfeckcode/safety"

// Synthetic shapes only: no real credential literals live in this file.
const fill = (char: string, count: number) => char.repeat(count)
const token = (...parts: Array<string | number>) =>
  parts.map((part) => (typeof part === "number" ? fill("x", part) : part)).join("")

const openAiClassic = token("sk-", 20, "T3BlbkFJ", 16)
const openAiProject = token("sk-proj-", 40)
const anthropicKey = token("sk-ant-api03-", 40)
const stripeSecret = token("sk_live_", 24)
const stripePublishable = token("pk_live_", 24)
const githubToken = token("ghp_", 36)
const googleApiKey = token("AIza", 35)
const slackToken = token("xoxb-", 12, "-", 12)
const jwtToken = token("eyJ", 12, ".eyJ", 12, ".", 12)
const pemBody = token("MIIEowIBAAKCAQEA", 60)
const privateKeyBlock = ["-----BEGIN RSA PRIVATE KEY-----", pemBody].join("\n")
const awsSecret = token("aws_secret_access_key", " = ", '"', 40, '"')
const awsAccessKeyId = token("AKIA", 16, "U")
const serviceAccount = token(12, "-", 32, "@developer.gserviceaccount.com")
const genericSecret = token("api_key", ' = "', 40, '"')
const genericPlaceholder = 'api_key = "your-placeholder-key-value-here"'

describe("private credential detection", () => {
  test("labels high-confidence private credential families without echoing their contents", () => {
    const cases: Array<[string, string]> = [
      [openAiClassic, "OpenAI API key"],
      [openAiProject, "OpenAI project key"],
      [anthropicKey, "Anthropic API key"],
      [stripeSecret, "Stripe secret key"],
      [githubToken, "GitHub token"],
      [slackToken, "Slack token"],
      [jwtToken, "JWT bearer token"],
      [privateKeyBlock, "Private key block"],
      [awsSecret, "AWS secret access key"],
      [genericSecret, "generic credential assignment"],
    ]
    for (const [value, label] of cases) {
      const labels = findSecretLabels(`before\n${value}\nafter`)
      expect(labels, label).toContain(label)
      expect(labels.join(" "), label).not.toContain(value)
    }
    expect(SECRET_RULES.some((rule) => rule.label === "OpenAI API key")).toBe(true)
  })

  test("does not flag public identifiers or obvious placeholders", () => {
    const allowed = [
      stripePublishable,
      googleApiKey,
      awsAccessKeyId,
      serviceAccount,
      "ssh-rsa AAAApublicmaterial",
      genericPlaceholder,
      "sk-proj-your-placeholder-value",
      "-----BEGIN RSA PRIVATE KEY-----",
    ]
    for (const value of allowed) {
      expect(findSecretLabels(value), value).toEqual([])
    }
  })

  test("deduplicates labels and ignores empty or non-string input", () => {
    expect(findSecretLabels(`${openAiClassic} ${openAiClassic}`)).toEqual(["OpenAI API key"])
    expect(findSecretLabels("")).toEqual([])
    expect(findSecretLabels(undefined)).toEqual([])
    expect(findSecretLabels(42)).toEqual([])
  })
})

describe("test path policy helpers", () => {
  test("detects test paths across separators and directory conventions", () => {
    for (const value of [
      "tests/example.ts",
      "./tests/example.ts",
      "src/example.test.ts",
      "src/example.spec.mjs",
      "src/__tests__/example.ts",
      "e2e/example.ts",
      "C:\\repo\\tests\\example.test.ts",
    ]) {
      expect(isTestPath(value), value).toBe(true)
    }
    for (const value of ["src/example.ts", "opencode/tests.md", "contest/example.ts", "", undefined]) {
      expect(isTestPath(value), String(value)).toBe(false)
    }
  })

  test("normalizes Windows separators and resolves relative targets", () => {
    expect(resolveWorkspacePath("/workspace/app", "tests\\existing.test.ts"))
      .toBe("/workspace/app/tests/existing.test.ts")
    expect(resolveWorkspacePath("/workspace/app", "/tmp/existing.test.ts")).toBe("/tmp/existing.test.ts")
    expect(resolveWorkspacePath(undefined, "/tmp/absolute.test.ts")).toBe("/tmp/absolute.test.ts")
    expect(resolveWorkspacePath(undefined, "tests/relative.test.ts")).toBe("")
  })

  test("extracts every file target from a native patch payload", () => {
    const patchText = [
      "*** Begin Patch",
      "*** Update File: tests\\existing.test.ts",
      "*** Move to: tests/moved.test.ts",
      "@@",
      "-a",
      "+b",
      "*** Add File: tests/new.test.ts",
      "+new",
      "*** Delete File: src/old.ts",
      "*** End Patch",
    ].join("\n")
    expect(extractPatchPaths(patchText)).toEqual([
      "tests/existing.test.ts",
      "tests/moved.test.ts",
      "tests/new.test.ts",
      "src/old.ts",
    ])
    expect(extractPatchPaths(undefined)).toEqual([])
  })
})

describe("native tool input extraction", () => {
  test("reads the verified V2 argument shapes for shell, write, edit and patch", () => {
    expect(secretInputText("shell", { command: `echo ${openAiClassic}` })).toContain(openAiClassic)
    expect(secretInputText("bash", { command: `echo ${openAiClassic}` })).toContain(openAiClassic)
    expect(secretInputText("write", { path: "src/a.ts", content: `x = "${openAiClassic}"` }))
      .toContain(openAiClassic)
    expect(secretInputText("edit", { path: "src/a.ts", oldString: "old", newString: openAiClassic }))
      .toContain(openAiClassic)
    expect(secretInputText("edit", { path: "src/a.ts", oldString: openAiClassic, newString: "new" }))
      .toContain(openAiClassic)
    expect(secretInputText("patch", { patchText: `+${openAiClassic}` })).toContain(openAiClassic)
    expect(secretInputText("read", { path: "src/a.ts", content: openAiClassic })).toBe("")
  })

  test("returns write and edit targets plus patch hunk paths for the existing-test policy", () => {
    expect(testTargetPaths("write", { path: "tests/new.test.ts", content: "" })).toEqual(["tests/new.test.ts"])
    expect(testTargetPaths("edit", { filePath: "tests\\new.test.ts", oldString: "a", newString: "b" }))
      .toEqual(["tests/new.test.ts"])
    expect(testTargetPaths("patch", { patchText: "*** Add File: tests/new.test.ts\n+x\n" }))
      .toEqual(["tests/new.test.ts"])
    expect(testTargetPaths("shell", { command: "echo ok" })).toEqual([])
  })
})
