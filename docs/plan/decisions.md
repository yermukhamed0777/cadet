# Decisions log (append-only)

Format: `D-NNN · date · decision · alternatives considered · why · affected IDs`.
Do not edit earlier entries; append a superseding entry instead.

- **D-001 · 2026-11-26 · Treat the human boundary as real-user pilot work.** The
  agent completes every local task through the pilot handoff document and stops
  before recruiting, contacting, consenting or testing with people. Alternatives:
  (a) ask for a clarifying question now, (b) run a "test with a friend" step.
  Chosen because the user's instruction says not to ask them or anyone else to
  test, and the placeholder clearly points at the last step needing real users.
  Affects: CADET-012.
- **D-002 · 2026-11-26 · Do not add a project LICENSE without explicit
  confirmation.** The repository is already public and has no licence file;
  adding one changes its legal status, which the guardrails reserve for the
  owner. Alternatives: apply MIT unilaterally (rejected: irreversible public
  commitment). Affects: CADET-011.
- **D-003 · 2026-11-26 · Use local toolchains only (Vitest, ESLint, Playwright
  against the installed Chrome/Edge).** Alternatives: hosted CI-only checks
  (rejected: cannot prove locally), browser download (rejected: unnecessary —
  system Chrome is present). Affects: CADET-002, CADET-003.
- **D-004 · 2026-11-26 · Fix lower-is-better reference grading by comparing in
  the event's own direction rather than treating a published figure as a
  passing cutoff.** Alternatives: relabel the badge as "met reference" only
  (rejected: still wrong for timed events), remove grading entirely (rejected:
  the UI already promises a comparison). Affects: CADET-001.
- **D-005 · 2026-11-26 · Add local JSON backup/restore instead of documenting
  manual browser-storage copying.** Alternatives: tell users to export via
  DevTools (rejected: error-prone and not user-facing), add a cloud account
  (rejected: needs money/accounts and changes the privacy story). Backup files
  are versioned, validated and confirmed before replacing state. Affects:
  CADET-006.
- **D-006 · 2026-11-26 · Scrub the OAuth token from the address bar with
  `replaceState` while preserving the router's history-state object.** Alternatives:
  change the documented backend contract to a fragment (rejected: requires a
  backend change outside this repo), leave the query in place (rejected: history
  and Referer leak). Affects: CADET-007.
- **D-007 · 2026-11-26 · Event harness stores only allowlisted names plus a
  timestamp, in memory, with no network calls.** Alternatives: payload-based
  analytics (rejected: risks capturing journal/account content), DOM-based
  counting (rejected: no automated content assertion). Affects: CADET-008.
- **D-008 · 2026-11-26 · Use e2e port `4183` because `4173` is occupied on this
  machine by an unrelated project.** Alternatives: kill the other server
  (rejected: it is another user's work). Affects: CADET-002, CADET-003.
- **D-009 · 2026-11-26 · Stop tracking generated `tsconfig.tsbuildinfo` and
  ignore test artifacts.** It is a TypeScript incremental cache, not source;
  it remains on disk. Affects: CADET-002.
- **D-010 · 2026-11-26 · Do not add a project LICENSE (see D-002) and do not
  push.** Both are explicit human confirmations. Affects: CADET-011.
