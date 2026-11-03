export interface ChildSession {
  readonly id: string
  readonly parentID?: string
  readonly title?: string
  readonly outcome?: "succeeded" | "failed" | "interrupted"
  readonly model?: { readonly providerID: string; readonly id: string }
  readonly tokens?: { readonly input: number; readonly output: number }
}

export type ActivityState = "running" | "done" | "error" | "idle" | "interrupted"
export interface ActivityRow {
  readonly id: string
  readonly title: string
  readonly state: ActivityState
  readonly metrics: string[]
  readonly usage?: string
}
export interface ActivityPanel {
  readonly rows: ActivityRow[]
  readonly counts: Record<ActivityState, number>
}

export function subagentPanel(
  sessionID: string,
  sessions: readonly ChildSession[],
  status: (id: string) => "idle" | "running",
): ActivityPanel {
  const counts: ActivityPanel["counts"] = { running: 0, done: 0, error: 0, idle: 0, interrupted: 0 }
  const rows = sessions.filter((session) => session.parentID === sessionID).map((session): ActivityRow => {
    const state: ActivityState = status(session.id) === "running" ? "running"
      : session.outcome === "succeeded" ? "done"
      : session.outcome === "failed" ? "error"
      : session.outcome === "interrupted" ? "interrupted" : "idle"
    counts[state]++
    const metrics: string[] = []
    if (session.model?.providerID && session.model.id) {
      metrics.push(`${session.model.providerID}/${session.model.id}`)
    }
    const tokens = session.tokens
    let usage: string | undefined
    if (tokens && Number.isSafeInteger(tokens.input) && tokens.input >= 0
      && Number.isSafeInteger(tokens.output) && tokens.output >= 0 && (tokens.input > 0 || tokens.output > 0)) {
      metrics.push(`${tokens.input} in / ${tokens.output} out tokens`)
      usage = compactTokens(tokens.input + tokens.output)
    }
    return { id: session.id, title: session.title?.trim() || "Untitled subagent", state, metrics, ...(usage ? { usage } : {}) }
  })
  return { rows, counts }
}

// Compact token count for one-line rows: 950, 3.8k, 46k.
function compactTokens(total: number): string {
  if (total < 1000) return `${total}`
  if (total < 10000) return `${(total / 1000).toFixed(1)}k`
  return `${Math.round(total / 1000)}k`
}
