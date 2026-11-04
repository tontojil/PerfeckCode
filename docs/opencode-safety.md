# OpenCode input safety guard

`opencode-v2/plugins/guard.js` is the single native OpenCode V2 input guard. It
registers the plugin id `perfeck-guard`, exactly one
`ctx.tool.hook("execute.before")` callback, and delegates pure checks to
`opencode-v2/plugins/perfeckcode/safety.ts`.

## Verified native input shapes

The guard reads the published OpenCode V2.1.2 tool schemas:

| Tool | Argument shape used by the guard |
| --- | --- |
| `shell` | `{ command, workdir?, timeout?, background? }` |
| `bash` (legacy) | `{ command }` |
| `write` | `{ path, content }` |
| `edit` | `{ path, oldString, newString, replaceAll? }` |
| `patch` | `{ patchText }` |

Legacy `filePath`, `oldText` and `newText` aliases remain readable so older
payloads do not lose their previous protection. The guard resolves relative
paths against the native `ctx.location.directory` value, not a guessed project
directory.

## Behavior

### Destructive shell checks

The V2 `shell` and legacy `bash` tools keep the previous substring checks:

- `rm -rf /`, `rm -rf /*`, `sudo rm`, `mkfs`, fork bombs and `:|:&`.
- Output redirection that mentions `.env` or `secrets/`.

Rejections keep the previous message:
`Bloqueado por guard Perfeck: comando destructivo o secreto`.

### Existing test protection

`edit`, `write` and `patch` are checked against test paths using the previous
`.test.*`, `.spec.*`, `tests/`, `__tests__/` and `e2e/` conventions.

- The guard only asks the filesystem whether the target already exists, using
  `existsSync` from `node:fs`. It never opens, reads or writes the file.
- Writing or editing a test path that does not exist is allowed, so new test
  creation works with the repository's test-first policy.
- Editing, overwriting or patching an existing test path is rejected with the
  previous message:
  `Bloqueado por guard Perfeck: edicion de test existente. Indique que test, por que y que queda cubierto.`
- Patch headers (`*** Add File:`, `*** Update File:`, `*** Delete File:` and
  `*** Move to:`) are inspected for the same policy.
- Windows backslashes are normalized before matching and resolution.

The existence check is path policy, not a sandbox. Absolute paths and relative
paths outside the workspace are still checked as given if `ctx.location.directory`
is available. If the location is unavailable, relative test targets keep the
conservative block.

### Private credential input detection

The guard scans the tool input text, not prompts or sessions, for high-confidence
private credential families:

- OpenAI classic, project and service keys.
- Anthropic API keys.
- Stripe secret keys (`sk_`), not publishable keys (`pk_`).
- GitHub personal, OAuth, user, server and refresh tokens; fine-grained PATs.
- Slack tokens, Square secrets and access tokens.
- JWT bearer tokens and PEM private key blocks with key material (a bare
  `-----BEGIN ... PRIVATE KEY-----` header alone is documentation, not a secret).
- Explicit `aws_secret_access_key` values and generic high-confidence credential
  assignments.

The following are deliberately not private credentials and are allowed:
publishable keys, Google/Firebase browser keys (`AIza...`), service-account
emails, AWS access key ids (`AKIA...`), public SSH material and obvious
placeholder values.

Rejections are label-only:
`Bloqueado por guard Perfeck: posible credencial privada (OpenAI API key). Revise el contenido antes de proceder.`

The message never includes the matched value, a source line, a file path or a
snippet. The guard also does not mutate the input object; a rejected call leaves
the event payload unchanged for the host to report.

## Best-effort limits

This is a best-effort input guard, not a data-loss-prevention system or a
sandbox:

- It does not scan prompts, chat messages, session history, model output or tool
  results.
- It does not scan files that already exist on disk, environment variables,
  credential stores or settings files.
- Shell detection is heuristic string matching, not shell parsing. Obfuscated,
  encoded or dynamically constructed commands can pass.
- Credential detection is pattern based. Novel token formats, split literals and
  encoded secrets can pass; public-looking values can still be sensitive in
  context.
- Patch inspection only reads file headers; it does not validate whether a patch
  would apply.
- It performs no automatic Git operation, background storage, account
  authentication, telemetry or startup model rewrite.

## Focused verification

Run only the guard and helper tests:

```sh
bun test opencode-v2/tests/guard.test.ts opencode-v2/tests/safety.test.ts
```

The tests use real filesystem fixtures outside the repository workspace and
construct synthetic credential shapes at runtime. No real keys, private files or
destructive commands are used.
