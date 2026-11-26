# Strategy

## Thesis

CADET is a source-grounded **execution layer** for U.S. federal service academy
applications. It does not discover schools, predict admission chances or replace
official decisions. It carries one applicant from an eligibility review to an
appointment by turning official, dated facts into a personal checklist whose
progress is derived from the applicant's own recorded actions.

The product's distinguishing property is *epistemic honesty*: every fact carries
an official source, a check date, an applicable year and a status
(`verified` / `archive` / `needs_review`). Unknowns render as "No confirmed
data" instead of being guessed. This is the asset inherited from the recovered
Kazakhstan MVD PWA (preserved at tag `v1-kz-mvd`).

## Users

- **Primary:** a U.S. high-school junior or senior considering one of the five
  federal service academies, who needs to know *what to do next* and wants a
  private place to track it.
- **Secondary:** a parent or mentor helping that applicant keep a checklist
  current (no account sharing is built; they use the same device).
- **Not served:** applicants seeking a chance-of-admission score, official
  medical/legal advice, or a replacement for the academy's own portal.

## Positioning

"Your path to commission." A quiet, editorial, mobile-first tracker. It sits
between discovery catalogues and exam prep: those answer *where* and *how to
study*; CADET answers *what step is next and have I done it*. Comparison is
deliberately limited to objective, sourced facts — no rankings, scores or
recommendations.

## Measured vs claimed

**Measured** (commands and exact outputs are in `progress.md`; nothing is
entered here until a command result exists):

- _Pending first verification run._ No usage, user, retention or revenue
  numbers exist in this repository. None will be invented.

**Claimed / inherited, not re-measured here:**

- `REPOSITIONING.md` records a Lighthouse result and a ~96 kB gzipped JS bundle
  for the *recovered predecessor*. These are historical observations by a
  previous agent, not claims about the current build, and are not repeated in
  the README as current metrics.
- `src/data/sources.ts` records `CHECKED_AT`, a manual source-review date. It is
  a provenance claim, not a measurement produced by a command.

## Risks

1. **Data staleness.** Admission cycles change yearly. Mitigation: every fact
   keeps a source and year; `needs_review` is a first-class state; no fact is
   added without a source. Re-checking official pages remains human work.
2. **Local-only data loss.** Demo accounts live in the browser. Mitigation:
   built-in JSON export/import, explicit demo notices, and documented
   backup/restore steps.
3. **Misinterpretation as an official or predictive tool.** Mitigation:
   persistent "independent, not official" framing, no chance scoring,
   reference-only fitness figures, explicit FAQ answers.
4. **Production backend is a contract, not an implementation.** The OAuth,
   `/me/state` and support endpoints are documented but not deployed here.
   Claiming a working production service would be false.
5. **Privacy.** No network transmission of applicant text in demo mode. Any
   future telemetry must be content-free (see the event harness) and the pilot
   must collect no journal or account content.

## Open questions (human decisions)

- What is the project licence? No licence file exists. Adding one changes the
  legal status of a public repository and is explicitly Human only.
- Should a real backend ever be funded and deployed? That changes the privacy
  story from "stays on this device" to server-side storage.
- Which cohort and consent wording will the seven-day pilot use? A draft exists
  in `docs/pilot-handoff.md` and needs a human decision.
