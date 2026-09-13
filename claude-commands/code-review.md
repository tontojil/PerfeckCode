---
description: "Review the current diff or specified files using the revisor-codigo agent"
---

Run a systematic code review on ${ARGUMENTS:-the current diff}.

Uses the `revision-codigo` skill with the `revisor-codigo` agent.

Dimensions to review: correctness, security, performance, maintainability, testing.

Output format:
```
path:line: <severity> <problem>. <fix suggestion>.
```
