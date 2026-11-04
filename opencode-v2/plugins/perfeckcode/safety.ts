import { posix, resolve } from "node:path"

export interface SecretRule {
  readonly label: string
  readonly pattern: RegExp
}

// High-confidence private credential families only. Publishable keys,
// service-account emails and AWS access key ids are deliberately absent.
export const SECRET_RULES: readonly SecretRule[] = [
  { label: "OpenAI API key", pattern: /\bsk-[A-Za-z0-9]{20,}T3BlbkFJ[A-Za-z0-9]{16,}\b/ },
  { label: "OpenAI project key", pattern: /\bsk-proj-[A-Za-z0-9_-]{40,}\b/ },
  { label: "OpenAI service key", pattern: /\bsk-svc[A-Za-z0-9_-]{40,}\b/ },
  { label: "Anthropic API key", pattern: /\bsk-ant-api[0-9A-Za-z_-]{40,}\b/ },
  { label: "Stripe secret key", pattern: /\bsk_(?:test|live)_[0-9A-Za-z]{24,}\b/ },
  { label: "GitHub token", pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/ },
  { label: "GitHub fine-grained token", pattern: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { label: "Slack token", pattern: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/ },
  { label: "Square secret", pattern: /\bsq0i-[A-Za-z0-9_-]{22,}\b/ },
  { label: "Square access token", pattern: /\bEAAA[A-Za-z0-9_-]{40,}\b/ },
  { label: "JWT bearer token", pattern: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/ },
  { label: "Private key block", pattern: /-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----[\s\S]{64,}/ },
  { label: "AWS secret access key", pattern: /\baws_secret_access_key\s*[:=]\s*['"]?[A-Za-z0-9/+=]{40}['"]?/i },
  { label: "generic credential assignment", pattern: /\b(?:api[_-]?key|secret[_-]?key|client[_-]?secret|auth[_-]?token|access[_-]?token|private[_-]?key)\s*[:=]\s*['"][A-Za-z0-9+/=_-]{24,}['"]/i },
]

const PLACEHOLDER_MARKERS = /(?:example|sample|placeholder|your[_-]|changeme|dummy|redacted|public|firebase|<[^>]+>)/i
// Publishable identifiers are not credentials: Firebase/Google browser keys and
// AWS access key ids identify a project but cannot authenticate on their own.
const PUBLIC_VALUE_MARKERS = /(?:AIza[0-9A-Za-z_-]{35}|AKIA[0-9A-Z]{16})/

function isPlaceholderMatch(value: string): boolean {
  return PLACEHOLDER_MARKERS.test(value)
}

function isPublicIdentifier(value: string): boolean {
  return PUBLIC_VALUE_MARKERS.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function pushString(target: string[], value: unknown): void {
  if (typeof value === "string" && value.length > 0) target.push(value)
}

export function normalizePathSeparators(value: string): string {
  return value.replace(/\\/g, "/")
}

export function isTestPath(value: unknown): boolean {
  if (typeof value !== "string") return false
  const path = normalizePathSeparators(value)
  if (/\.test\.[A-Za-z0-9]+$/.test(path)) return true
  if (/\.spec\.[A-Za-z0-9]+$/.test(path)) return true
  if (/(^|\/)(tests|__tests__|e2e)(\/|$)/.test(path)) return true
  return false
}

// Returns an empty string when a relative target cannot be resolved.
export function resolveWorkspacePath(baseDirectory: string | undefined, target: string): string {
  const normalized = normalizePathSeparators(target)
  if (!normalized) return ""
  if (/^(?:[A-Za-z]:\/|\/|\/\/)/.test(normalized)) return normalized
  if (!baseDirectory) return ""
  const base = normalizePathSeparators(baseDirectory)
  // Una base POSIX debe seguir siendo POSIX aunque el host sea Windows.
  if (base.startsWith("/") && !base.startsWith("//")) return posix.resolve(base, normalized)
  return resolve(base, normalized)
}

export function extractPatchPaths(patchText: unknown): string[] {
  if (typeof patchText !== "string") return []
  const paths: string[] = []
  for (const rawLine of patchText.split("\n")) {
    const line = rawLine.trim()
    const file = /^\*\*\* (?:Add|Update|Delete) File:\s*(.+)$/.exec(line)
    const target = file?.[1] ?? /^\*\*\* Move to:\s*(.+)$/.exec(line)?.[1]
    if (target === undefined) continue
    const normalized = normalizePathSeparators(target.trim())
    if (normalized && !paths.includes(normalized)) paths.push(normalized)
  }
  return paths
}

// Reads the verified OpenCode V2.1.2 tagged argument shapes. Legacy aliases
// remain only for compatibility with the older bash/write/edit payloads.
export function secretInputText(tool: unknown, input: unknown): string {
  if (typeof tool !== "string" || !isRecord(input)) return ""
  const name = tool.toLowerCase()
  const fields: string[] = []
  if (name === "shell" || name === "bash") {
    pushString(fields, input.command)
    pushString(fields, input.cmd)
  } else if (name === "patch" || name.includes("patch")) {
    pushString(fields, input.patchText)
  } else if (name === "write" || name.includes("write")) {
    pushString(fields, input.content)
    pushString(fields, input.text)
  } else if (name === "edit" || name.includes("edit")) {
    pushString(fields, input.oldString)
    pushString(fields, input.newString)
    pushString(fields, input.oldText)
    pushString(fields, input.newText)
    pushString(fields, input.content)
  }
  return fields.join("\n")
}

export function testTargetPaths(tool: unknown, input: unknown): string[] {
  if (typeof tool !== "string" || !isRecord(input)) return []
  const name = tool.toLowerCase()
  if (name === "patch" || name.includes("patch")) return extractPatchPaths(input.patchText)
  if (name !== "write" && name !== "edit" && !name.includes("write") && !name.includes("edit")) return []
  const target = typeof input.path === "string" ? input.path : input.filePath
  return typeof target === "string" && target.length > 0 ? [normalizePathSeparators(target)] : []
}

// Returns label-only matches in rule order. Never return the matched text.
export function findSecretLabels(text: unknown): string[] {
  if (typeof text !== "string" || text.length === 0) return []
  const labels: string[] = []
  for (const rule of SECRET_RULES) {
    const match = rule.pattern.exec(text)
    if (!match || isPlaceholderMatch(match[0]) || isPublicIdentifier(match[0])) continue
    if (!labels.includes(rule.label)) labels.push(rule.label)
  }
  return labels
}
