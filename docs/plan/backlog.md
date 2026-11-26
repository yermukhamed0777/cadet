# Backlog

Stable IDs. Never renumber. Status may change; IDs and "Done when" criteria do
not. A `Done` status requires a recorded command result in
[`progress.md`](progress.md).

| ID | Priority | Item | Evidence (file:line) | Done when | Status |
|---|---|---|---|---|---|
| CADET-001 | P0 correctness | Reference-only grading and progress are inverted for lower-is-better timed exercises | `src/utils/fitness.ts:11-18`, `src/utils/fitness.ts:50-57`, `src/data/fitness.ts:40,43,46,49,60,63,66,69` | Unit tests show a faster shuttle/run is graded `excellent` and a slower one `below`, with progress increasing as time decreases; full suite green | Done (CADET-001) |
| CADET-002 | P0 build/CI | No automated verification suite exists | `package.json:6-11`, absence of any `test`/`lint` script | `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:data`, `npm run test:e2e`, `npm run verify:build` all exist and pass locally | Done (CADET-002) |
| CADET-003 | P0 release | Deploy workflow does not gate on lint/typecheck/tests/build variants | `.github/workflows/deploy.yml:17-41` | A `verify` job must succeed before `build`, and `build` before `deploy`; a red check prevents the Pages artifact from being uploaded | Done (CADET-003) — workflow rewritten; CI run not yet observed (Human: push) |
| CADET-004 | P0 plan | No auditable plan/backlog/decision/progress layer | Absence of `docs/plan/` before this commit | `docs/plan/{index,strategy,roadmap,backlog,decisions,progress}.md` exist with the update convention | Done (CADET-004) |
| CADET-005 | P1 docs | README claims Web Crypto is unavailable on the GitHub Pages deployment | `README.md:51-53` | README states the accurate constraint (HTTPS Pages is a secure context so Web Crypto works; the hash build only disables the service worker); no other doc contradicts it | Done (CADET-005) |
| CADET-006 | P0 data loss | No backup/restore path for demo data that lives only in this browser | `src/services/profileService.ts:21-44`, `src/context/AppStateContext.tsx:97-143` | Export produces a versioned JSON backup and import validates and restores it; unit tests cover malformed/rejected backups; e2e covers round-trip; README documents it | Done (CADET-006) |
| CADET-007 | P1 privacy | OAuth session token is read from the URL query and left in browser history/referrers | `src/pages/OAuthCallbackPage.tsx:15-28` | Token is consumed and stripped from the address bar via `replaceState` before navigation; a unit-testable helper covers the sanitisation rule | Done (CADET-007) |
| CADET-008 | P1 verification | No content-free event harness for validation-plan counts | Absence of any events module | Allowlisted event names only, no user text, no network transmission, and an automated assertion that emitted events contain no journal/account content | Done (CADET-008) |
| CADET-009 | P2 UX | Desktop layout uses the same narrow mobile column | `src/layouts/AppLayout.tsx:14` | Wide viewports use a wider responsive container without changing mobile layout; deterministic screenshot captured | Done (CADET-009) |
| CADET-010 | P1 docs | Missing CV-ready docs: CONTRIBUTING, CHANGELOG, THIRD_PARTY_NOTICES, walkthrough, pilot handoff | Root and `docs/` tree before this work | Each file exists, links resolve, and every claim is consistent with the code/plan | Done (CADET-010) |
| CADET-011 | P1 legal | No project licence file | Root tree | Human has chosen a licence and it is applied — explicitly **Human only**, do not apply without confirmation | Human only |
| CADET-012 | P1 pilot | Seven-day pilot with real users | Boundary in `docs/plan/index.md` | Human recruits, consents and runs it — explicitly **Human only** | Human only |
| CADET-013 | P2 docs | `REPOSITIONING.md` states `CHECKED_AT = 2026-09-27`, current sources use `2026-11-25` | `REPOSITIONING.md:44`, `src/data/sources.ts:4` | Historical doc is annotated so the stale number is clearly a past observation, not the current check date | Done (CADET-013) |
| CADET-014 | P2 UX | Toast placement can overlap page headers on small screens | `src/context/ToastContext.tsx:29-34` | Capture a deterministic screenshot with a visible toast and confirm no overlap with the header, or fix and recapture | Verified no-change (screenshot `docs/walkthrough/03-home-with-toast.png`) |
