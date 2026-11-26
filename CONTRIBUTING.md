# Contributing to CADET

Thanks for helping. This project is a source-grounded tracker, so accuracy and
honesty matter more than feature count.

## Before you start

```bash
npm ci
npm run verify
```

`npm run verify` runs lint (warnings denied), typecheck, all unit and data-layer
tests, both build variants, build-artifact assertions and browser e2e. CI runs
the same command sequence and will not deploy a red run.

## Working on a change

1. Open a backlog item in [`docs/plan/backlog.md`](docs/plan/backlog.md). If none
   fits, add a new stable `CADET-NNN` ID with a `file:line` reference and a
   measurable "Done when" criterion. Never renumber existing IDs.
2. Make the smallest coherent fix.
3. Add a regression test that fails before the fix and passes after it. Pure
   rules go in `tests/unit/`, storage/auth/state in `tests/data/`, browser
   journeys in `tests/e2e/`.
4. Reconcile user-facing docs with the code in the same change.
5. Update `docs/plan/progress.md` with the exact commands you ran and their
   exact results. Do not claim a check you did not run.
6. Commit with the ID in the message, e.g. `CADET-001: grade timed reference
   results by event direction`.

## Data rules

- Never add a fact without an official source, check date and status.
- Use `needs_review` instead of guessing. `null` renders as "No confirmed data".
- Never present reference fitness figures as passing thresholds, and never add
  a chance-of-admission score.

## Privacy and validation

- Demo data stays in the browser. The event harness
  (`src/utils/events.ts`) is intentionally content-free: allowlisted names and
  timestamps only, no network transmission. Do not add user text to it.
- Do not recruit, contact or test with real users without the owner's consent
  and a documented pilot plan. That work belongs to a human, not a contributor
  automation.

## Out of scope for agents

Pushing, publishing, changing repository visibility or licence, and spending
money require explicit owner confirmation.
