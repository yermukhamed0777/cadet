# CADET plan index

This directory is the single source of truth for what the project is, what is
being done, and what has been proven. It is designed to be readable by a
reviewer who has never seen the repository.

## Files and roles

| File | Role | Mutability |
|---|---|---|
| [strategy.md](strategy.md) | Thesis, users, positioning, measured vs claimed metrics, risks, open questions | Edit in place; record rationale in decisions.md |
| [roadmap.md](roadmap.md) | Short / mid / long horizons, each item tagged Intelligence or Human | Edit in place |
| [backlog.md](backlog.md) | Stable IDs, file:line references, "Done when" criteria | Append new IDs; only change status text, never renumber |
| [decisions.md](decisions.md) | Append-only decision log with alternatives and why | Append only |
| [progress.md](progress.md) | Append-only command/outcome log with exact commands and results | Append only |

## Update convention

1. Work starts by adding a backlog row with a stable `CADET-NNN` ID, a
   `file:line` reference and a measurable "Done when" criterion.
2. Every fix lands in the same commit as its regression test and any plan-doc
   updates. The commit message references the backlog ID.
3. After a command is run, append the **exact command** and **exact result** to
   `progress.md` (counts, PASS lines, sizes). A claim without a recorded
   command is not a claim.
4. Product decisions made without the owner present are appended to
   `decisions.md`, then flagged in the final handoff report.
5. Logs are append-only: never rewrite or renumber an existing entry. Corrections
   are new entries that point at the earlier one.
6. `backlog.md` status values: `Open`, `In progress`, `Done (CADET-…)`,
   `Verified no-change`, `Human only`. A status may only become `Done` after
   the "Done when" command result is recorded in `progress.md`.

## Boundary

Agent-owned work ends at the handoff document in
[`docs/pilot-handoff.md`](../pilot-handoff.md). Recruiting, consenting,
contacting or testing with real users is **Human only**. Pushing, publishing,
changing repository visibility or licence and spending money are also
Human only.
