import { describe, expect, test } from "bun:test"
import { subagentPanel, type ChildSession } from "../plugins/perfeckcode/model"

const child = (id: string, values: Partial<ChildSession> = {}): ChildSession => ({
  id,
  parentID: "root",
  title: id,
  ...values,
})

describe("Subagents presentation", () => {
  test("includes only direct children of the selected session, preserving host order and titles", () => {
    const sessions = [child("a", { title: "Review architecture" }), child("grandchild", { parentID: "a" }),
      child("other", { parentID: "elsewhere" }), child("root", { parentID: undefined }), child("b")]
    const before = structuredClone(sessions)
    const panel = subagentPanel("root", sessions, () => "idle")
    expect(panel.rows.map(({ id, title }) => ({ id, title }))).toEqual([
      { id: "a", title: "Review architecture" }, { id: "b", title: "b" },
    ])
    expect(sessions).toEqual(before)
    expect(subagentPanel("a", sessions, () => "idle").rows.map((row) => row.id)).toEqual(["grandchild"])
  })

  test("counts running, explicit success and failure without treating idle or interruption as failure", () => {
    const sessions = [child("busy", { outcome: "failed" }), child("done", { outcome: "succeeded" }),
      child("error", { outcome: "failed" }), child("idle"), child("interrupted", { outcome: "interrupted" })]
    const panel = subagentPanel("root", sessions, (id) => id === "busy" ? "running" : "idle")
    expect(panel.rows.map((row) => row.state)).toEqual(["running", "done", "error", "idle", "interrupted"])
    expect(panel.counts).toEqual({ running: 1, done: 1, error: 1, idle: 1, interrupted: 1 })
    expect(subagentPanel("root", [child("busy")], () => "running").rows[0].state).toBe("running")
    expect(subagentPanel("root", [child("busy")], () => "idle").rows[0].state).toBe("idle")
  })

  test("reflects restart, completion and recovery from current host data without sticky errors", () => {
    expect(subagentPanel("root", [child("a", { outcome: "failed" })], () => "idle").rows[0].state).toBe("error")
    expect(subagentPanel("root", [child("a", { outcome: "failed" })], () => "running").rows[0].state).toBe("running")
    expect(subagentPanel("root", [child("a", { outcome: "succeeded" })], () => "idle").rows[0].state).toBe("done")
    expect(subagentPanel("root", [], () => "idle")).toEqual({ rows: [], counts: { running: 0, done: 0, error: 0, idle: 0, interrupted: 0 } })
  })

  test("uses supplied model and measured input/output only, never fabricating missing metrics", () => {
    const panel = subagentPanel("root", [child("empty", { title: "  " }), child("measured", {
      model: { providerID: "provider", id: "actual-model" },
      tokens: { input: 120, output: 30 },
    }), child("zero", { tokens: { input: 0, output: 0 } }), child("invalid", { tokens: { input: NaN, output: -1 } })], () => "idle")
    expect(panel.rows[0]).toEqual({ id: "empty", title: "Untitled subagent", state: "idle", metrics: [] })
    expect(panel.rows[1].metrics).toEqual(["provider/actual-model", "120 in / 30 out tokens"])
    expect(panel.rows[2].metrics).toEqual([])
    expect(panel.rows[3].metrics).toEqual([])
  })
})
