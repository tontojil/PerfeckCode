import { Plugin, usePlugin } from "@opencode/plugin/tui"
import { For, Show, createMemo } from "solid-js"
import { subagentPanel, type ActivityState } from "./model"

const glyphs: Record<ActivityState, string> = {
  running: "●",
  done: "✓",
  error: "✕",
  idle: "○",
  interrupted: "‖",
}

const order: ActivityState[] = ["running", "done", "error", "idle", "interrupted"]

function clip(value: string, max = 30): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`
}

function Subagents(props: { sessionID: string }) {
  const ctx = usePlugin()
  const panel = createMemo(() => subagentPanel(
    props.sessionID,
    ctx.data.session.list(),
    (id) => ctx.data.session.status(id),
  ))
  const stateColor = (state: ActivityState) =>
    state === "done" ? ctx.theme.text.feedback.success.base
      : state === "error" ? ctx.theme.text.feedback.error.base
      : state === "running" ? ctx.theme.text.feedback.info.base
      : state === "interrupted" ? ctx.theme.text.feedback.warning.base
      : ctx.theme.text.muted
  const summary = createMemo(() => {
    const counts = panel().counts
    const parts = order.filter((state) => counts[state] > 0).map((state) => `${counts[state]} ${state}`)
    return parts.length > 0 ? parts.join(" · ") : "No activity"
  })
  const open = (sessionID: string) => ctx.ui.router.navigate({ type: "session", sessionID })
  const select = async () => {
    const sessionID = await ctx.ui.dialog.select({
      title: "Open subagent",
      options: panel().rows.map((row) => ({
        title: row.title,
        value: row.id,
        description: row.state,
      })),
    })
    if (sessionID) open(sessionID)
  }
  ctx.keymap.layer(() => ({
    commands: [{
      id: "perfeckcode.subagents.open",
      title: "Open subagent",
      description: "Choose a direct child of the current session",
      group: "PerfeckCode",
      palette: true,
      enabled: () => panel().rows.length > 0,
      run: select,
    }],
  }))

  return (
    <box flexDirection="column" paddingTop={1} flexShrink={0}>
      <text fg={ctx.theme.text.base}><b>Subagents</b></text>
      <text fg={ctx.theme.text.muted}>{summary()}</text>
      <Show when={panel().rows.length > 0} fallback={<text fg={ctx.theme.text.muted}>No subagents in this session.</text>}>
        <For each={panel().rows}>{(row) => (
          <text wrapMode="none" onMouseUp={() => open(row.id)}>
            <span style={{ fg: stateColor(row.state) }}>{glyphs[row.state]}</span>
            <span style={{ fg: ctx.theme.text.base }}> {clip(row.title)}</span>
            <Show when={row.usage}>{(usage) => <span style={{ fg: ctx.theme.text.muted }}>  {usage()}</span>}</Show>
          </text>
        )}</For>
      </Show>
    </box>
  )
}

export default Plugin.define({
  id: "perfeckcode.tui",
  setup(ctx) {
    const sidebar = ctx.ui.slot({
      append: "sidebar.content",
      render: (props) => <Subagents sessionID={props.sessionID} />,
    })
    const home = ctx.ui.slot({
      append: "home.footer.status",
      render: () => <text fg={ctx.theme.text.muted}>[P/C] PerfeckCode</text>,
    })
    return () => {
      home()
      sidebar()
    }
  },
})
