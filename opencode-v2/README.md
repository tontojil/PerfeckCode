# PerfeckCode for OpenCode V2

Native terminal customization for **OpenCode 2.1.2**, based on the supplied V1 session screenshot: near-black surfaces, amber Markdown emphasis, blue input accents and a right-hand subagent monitor. This is an extension, not a fork of OpenCode or a Gentle AI distribution.

## Install and verify

Requirements: OpenCode V2 (`opencode2` or `opencode` on PATH), Bun 1.4+, and Git. The installer refuses V1 before changing configuration. It does not install or upgrade the OpenCode executable.

Run the full repository installer from the repository root to include the Claude agent definitions referenced by the OpenCode agents:

```sh
bash install.sh
```

On Windows, use the repository's `install.ps1`. Both entrypoints call the same Bun installer for OpenCode. The native assets are written to `$XDG_CONFIG_HOME/opencode` or `~/.config/opencode`; no machine-specific paths or credentials are distributed.

Restart OpenCode after installation. Open or create a session in a sufficiently wide terminal. The native `session.sidebar: "auto"` setting displays the sidebar only when there is enough space; a narrow window may hide it. Use the command palette's sidebar control or widen the terminal.

The primary agent is **Perfeck**, selected as `perfeck` or `@perfeck`. Team commands use the same identity. On reinstall, an existing `default_agent: "tonto-jil"` is migrated to `perfeck` together with its agent-specific restrictions; unrelated defaults are preserved. The old repository-owned primary file is backed up and disabled. Existing conversations may need to select Perfeck manually; session history is not rewritten.

The Subagents section displays direct children of the current session, explicit running/success/failure/interruption states, and supplied model/token measurements. Idle is not reported as success. Click a child or select **Open subagent** from the command palette. Empty sessions show an explicit empty state.

Native Context, MCP and Todo sections remain host-owned. MCP entries require configured servers; Todo entries require actual tasks. The installer enables the native todo experiment for a new server configuration. It does not copy the original machine's private MCP setup or session history.

## Architecture

| Surface | Responsibility |
|---|---|
| `cli.json` | Native V2 theme selection, automatic sidebar, hidden reasoning and scrollbar |
| `themes/perfeckcode.json` | Complete V2 semantic theme and hue palette; independent of the V1 theme |
| `plugins/perfeckcode/tui.tsx` | Additive sidebar, keyboard navigation and supported home-footer branding |
| `plugins/perfeckcode/model.ts` | Pure session-to-presentation mapping, with no host or filesystem dependencies |
| `plugins/perfeckcode/index.ts` | Separate V2 server entrypoint; no UI or console banner side effects |
| `plugins/guard.js` | Server-side tool hook; supports native V2 `shell` and legacy `bash` names |
| `plugins/perfeck-banner.js` | Optional standalone V2 console banner for manual use; the default profile does not install it |
| `../scripts/install-opencode.mjs` | Shared cross-platform installer, native config adapter and backups |
| `tests/` | Offline theme, activity, guard and installation regression tests |

The existing `opencode.jsonc` is retained as the source permission template. Installation translates its legacy rule names to native V2 ordered `permissions`, `agents`, and `mcp.servers`. Agent frontmatter receives the same translation; the original agent prompts remain unchanged. Existing server configuration is preserved rather than silently migrating personal providers or permissions. If an existing file still uses V1-only keys, migrate it with OpenCode's documented V2 migration procedure before expecting V2 compatibility.

## Preservation and rollback

Files changed by this installer receive adjacent `.backup-*` copies; identical files are not rewritten. Unrelated themes, plugins, dependencies, CLI settings, `tui.json(c)` and `opencode.json` remain untouched. The selected theme and session visibility defaults intentionally change to the PerfeckCode profile. Existing `opencode.jsonc` is preserved except for the former primary-agent identity migration described above; that migration preserves setting values and permissions, but JSONC comments are not retained in the rewritten file. Existing file permissions are retained. Invalid `cli.json` is rejected before asset writes, and symlink destinations require manual installation.

An older owned `plugins/tonto-jil-banner.js` is backed up and renamed to `.disabled-*`; it is no longer installed or printed. No legacy Herdr reference or V1 statusline package is added. Keep your existing backups until you have verified the new installation.

To undo the visual profile, close OpenCode and restore the adjacent backups of `cli.json`, `package.json`, the PerfeckCode theme and plugin files you changed. For a first installation, remove only the `./plugins/perfeckcode` entry from `cli.json`, select another installed theme, and remove the owned plugin/theme files. The legacy repository uninstall scripts do not yet own these additive V2 assets; do not use them as a complete V2 rollback.

## Verification and boundaries

```sh
bun test opencode/tests
bash -n install.sh
```

On Windows the four POSIX permission-mode assertions in `identity-migration.test.ts` and `install.test.ts` cannot pass because NTFS does not store POSIX mode bits; run the full suite on Linux/WSL for that gate. The functional, config and theme tests run on both platforms.

V2 does not expose V1's `home_logo` replacement slot. PerfeckCode uses the supported home footer and leaves OpenCode's native logo and composer intact. Fonts, terminal size and terminal rendering are outside the theme's control; pixel-identical V1 output is not promised. Theme/sidebar data tests are not a substitute for native runtime loading and interactive verification.

Sources: [V2 settings](https://github.com/anomalyco/opencode/blob/v2.1.2/services/www/src/docs/content/cli/config.mdx), [V2 plugin API](https://github.com/anomalyco/opencode/blob/v2.1.2/packages/plugin/src/tui/context.ts), [theme definition](https://github.com/anomalyco/opencode/blob/v2.1.2/packages/theme/src/tui/schema.ts).
