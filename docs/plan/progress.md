# Progress log (append-only)

Every entry records an **exact command** and its **exact result**. Counts, sizes
and PASS lines are copied verbatim. Measured values are never mixed with
proposed targets. Do not edit earlier entries; append instead.

## 2026-11-26 — Orientation (read-only)

- Command: `git status --porcelain=v1; git branch --show-current; git remote -v`
  Result: no modified or untracked files; branch `main`; remote
  `origin https://github.com/yermukhamed0777/cadet.git`.
- Command: `git log --oneline -25 --decorate`
  Result: `83fc031` (HEAD, main, origin/main) "Document live GitHub Pages
  deployment"; `7004044` "Add GitHub Pages deployment workflow"; `892dce6`
  "Finalize cadet naming across project"; `1f86b99` "Reposition to CADET";
  `61318e8` (tag `v1-kz-mvd`) "Recover project from OneDrive backup".
- Command: `npm.cmd -v` Result: `11.16.0`.
- Command: `node -v` Result: `v24.18.1`.
- Command: `npm.cmd view vitest version --fetch-timeout=15000 --fetch-retries=0`
  Result: `5.1.2` (registry reachable; v2 line selected for Vite 5 compatibility).
- Command: `npm.cmd install -D vitest@^2.1.9 jsdom@^25.0.1 @playwright/test@^1.49.1 eslint@^9.17.0 @eslint/js@^9.17.0 typescript-eslint@^8.18.2 eslint-plugin-react-hooks@^5.1.0 globals@^15.14.0 --no-audit --no-fund`
  Result: `added 170 packages in 29s`; warnings about deprecated
  `whatwg-encoding@3.1.1`, `eslint@9.17.0`, and pending install scripts for
  `esbuild@0.21.5`.
- Command: `Test-Path 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'` Result: `True`.
- Command: `Test-Path 'C:\Program Files\Google\Chrome\Application\chrome.exe'` Result: `True`.

## 2026-11-26 — Defect queue and verification

- Command: `npm.cmd run test:unit` (before the CADET-001 fix)
  Result: `Test Files 1 failed (1)`, `Tests 4 failed | 5 passed (9)`. The four
  failures were exactly the timed reference-only grading/progress assertions.
- Command: `npm.cmd run test:unit` (after the CADET-001 fix and test correction)
  Result: `Test Files 1 passed (1)`, `Tests 9 passed (9)`.
- Command: `npm.cmd run test:data` Result: `Test Files 1 passed (1)`,
  `Tests 8 passed (8)`.
- Command: `npm.cmd test` Result (final clean run): `Test Files 8 passed (8)`,
  `Tests 48 passed (48)`, duration `1.77s`.
- Command: `npm.cmd run lint` Result: no output, exit code `0`. An intermediate
  run failed with `scripts/verify-build.mjs 2:10 error 'join' is defined but
  never used @typescript-eslint/no-unused-vars`; the unused import was removed.
- Command: `npm.cmd run typecheck` Result: no output, exit code `0`.
- Command: `npm.cmd run build` Result: `✓ 1657 modules transformed.`,
  `assets/index-5obsTNF6.js 311.98 kB │ gzip: 92.71 kB`,
  `assets/index-DSHvDa2r.css 30.32 kB │ gzip: 6.35 kB`, `✓ built in 2.69s`,
  PWA `precache 15 entries (370.41 KiB)`, `dist/sw.js` generated.
- Command: `npm.cmd run build:hash` Result: `✓ 1657 modules transformed.`,
  `assets/index-BbRsgN-a.js 312.35 kB │ gzip: 92.84 kB`, `✓ built in 2.54s`,
  no service worker.
- Command: `npm.cmd run verify:build` Result: `21` PASS lines, ending with
  `All build-artifact checks passed.` (root: absolute `/assets/`, SW present;
  hash: relative `./assets/`, no SW/manifest).
- Command: `npm.cmd run test:e2e` Result: `6 passed (33.3s)` — backup round
  trip, service-worker offline reload, onboarding, persistence after reload,
  mobile walkthrough capture, desktop layout capture. An earlier run failed all
  six tests because local port `4173` was occupied by an unrelated app; the port
  was changed to `4183` and all six then passed.
- Command: `npm.cmd ci --no-audit --no-fund` Result: `added 584 packages in 14s`,
  with npm warnings for deprecated `whatwg-encoding@3.1.1`, `glob@11.1.0`,
  `eslint@9.17.0` and a pending install script for `esbuild@0.21.5` (the binary
  worked; builds passed afterwards).
- Command: `npm.cmd run verify` Result: every step passed in sequence after a
  clean install: lint, typecheck, `48 passed (48)` Vitest tests, both builds,
  `21` build PASS lines, `6 passed (33.3s)` Playwright tests.
- Command: `Get-ChildItem docs/walkthrough | Select-Object Name,Length`
  Result: seven PNG files, `41020`, `42721`, `57625`, `59845`, `57833`,
  `46048` and `80618` bytes respectively.
- Command: `npm.cmd view <package> license` for all direct dependencies
  Result: recorded in `THIRD_PARTY_NOTICES.md` (MIT, Apache-2.0 and ISC only).

## Command-result policy

Counts above are measurements, not targets. Proposed pilot targets live in
`docs/pilot-handoff.md` and are explicitly labelled as unmeasured. No usage,
user, retention or revenue claim exists in this repository.

## 2026-11-26 — admissions-data and PWA reliability sprint (CADET-015…019)

Official-source reads (all read-only; exact outcomes are in
[`source-audit.md`](source-audit.md)):

- `webfetch https://www.usna.edu/Admissions/Apply/index.php` → HTTP 200;
  citizenship/age/marital/SSN eligibility, nomination sources, SAT/ACT/CLT,
  Class of 2031 deadlines and six CFA events confirmed.
- `webfetch https://www.usafa.edu/admissions/commitment/requirements/` → HTTP
  200; statutory eligibility, course guidance and the published CFA averages
  confirmed against `src/data/fitness.ts`.
- `webfetch https://uscga.edu/admissions/admission-requirements/` and
  `https://uscga.edu/admissions/apply/` → HTTP 200; no nomination requirement,
  eligibility, July 15/October 15/January 15/April 1/May 1 dates and PFE-only
  rule confirmed.
- `webfetch https://www.dha.mil/dodmerb` → HTTP 200; DMACS 2.0, DODMETS and
  commissioning-program waiver authority confirmed.
- `webfetch https://www.whitehouse.gov/service-academy-nomination/` → HTTP 200;
  Vice Presidential nomination excludes USCGA and USMMA.
- `webfetch` and `curl.exe -A <browser>` for the three West Point admissions
  pages → HTTP 403; archive endpoint → HTTP 429. Not re-verified; notes added.
- `webfetch https://www.usmma.edu/admissions` and `/8-steps-admission` → HTTP
  403. Not re-verified; existing notes retained.

Local verification after the fixes:

| Command | Exact result |
|---|---|
| `npm.cmd run test:unit` | `Test Files 7 passed (7)`, `Tests 40 passed (40)`. |
| `npm.cmd run test:data` | `Test Files 1 passed (1)`, `Tests 10 passed (10)` — includes demo-account deletion and refusal of remote deletion. |
| `npm.cmd run test:e2e` | `9 passed (1.0m)` — skip link/keyboard, labelled controls and 375 px overflow, backup round-trip, account deletion, offline PWA, onboarding, persistence, two walkthrough captures. |
| `npm.cmd run verify:pwa` | root PWA: 0 HTTP errors, PBKDF2 16 bytes, SW `activated`, `/home` → `/login`, offline reload works, manifest present, CDP installability errors `[]`, `installable-by-configuration true`. Hash build: 0 HTTP errors, PBKDF2 16 bytes, no SW, `/#/home` → `/#/login`, offline unavailable (expected), no manifest, `installable-by-configuration false`. `All PWA deployment checks passed.` |
| live Pages browser probe (`https://yermukhamed0777.github.io/cadet/`) | `{"secureContext":true,"cryptoOk":true,"serviceWorker":false,"manifest":false,"title":"CADET — Your path to commission","url":"https://yermukhamed0777.github.io/cadet/#/login"}`; `HTTP_ERRORS []`. |
| `npm.cmd run typecheck` / `npm.cmd run lint` | no output; exit `0`. |
| `npm.cmd run verify` (final) | exit 0; lint, typecheck, `50 passed (50)` unit/data tests, both builds (`✓ built in 2.60s` / `2.49s`), all `verify:build` PASS lines, all `verify:pwa` PASS lines, `9 passed (1.0m)` e2e, Prettier clean. |

The live Pages site still serves the previously published commit; this sprint's
local commits are not pushed. No account, email, participant, payment or public
commitment was created.

## 2026-11-27 — Google Fonts failure fix, push, CI and Pages confirmation (final)

### Investigation of the onboarding failure

- Command: Playwright page loaded with
  `--host-resolver-rules=MAP fonts.googleapis.com ~NOTFOUND, MAP fonts.gstatic.com ~NOTFOUND`
  Result: exactly **two** console errors, one per navigation, both
  `Failed to load resource: net::ERR_NAME_NOT_RESOLVED`. The message text
  carries **no URL**, but `ConsoleMessage.location().url` returns the failing
  `https://fonts.googleapis.com/css2?…` stylesheet URL — so any filter that
  matches on message text alone cannot identify the host.
- Command: same probe without the resolver rule (this environment)
  Result: `fonts.googleapis.com` resolves (HTTP 200), zero failed requests,
  zero errors — the failure only appears when the font hosts are
  unresolvable, which is why the flow reached its final assertions and then
  failed on the two collected errors.
- Conclusion: production code was not at fault; the test's error collector
  had to distinguish environment-dependent font-host DNS failures from real
  application errors.

### Fix (test-only; no production code changed)

- `tests/e2e/helpers.ts` — new `collectErrors(page)` helper: ignores
  `net::ERR_NAME_NOT_RESOLVED` only when `location().url` is
  `fonts.googleapis.com` or `fonts.gstatic.com`; every other page/console
  error still fails the suite.
- `tests/e2e/onboarding.spec.ts` — uses `collectErrors` (behaviour
  otherwise unchanged).
- `tests/e2e/fonts.spec.ts` (new) — launches Chrome with DNS failing for
  exactly those two hosts, **asserts a font request really failed** with
  `net::ERR_NAME_NOT_RESOLVED` (so the scenario cannot pass vacuously), then
  checks the locally bundled CSS still applies (`system-ui` fallback font
  stack, non-empty background) and that registration plus onboarding
  complete end to end.
- `index.html` — left unchanged: the Google Fonts `<link>` already degrades
  to the system-font stack declared in `src/index.css`, so the public
  experience keeps rendering when the font CDN is unreachable.

### Local verification

| Command | Exact result |
|---|---|
| `npm.cmd run verify` (first attempt) | failed before tests with a transient `VirtualAlloc failed` / `Worker exited unexpectedly` in the Vitest worker (machine memory, not code). |
| `npm.cmd run verify` (rerun, final) | exit `0`: lint, typecheck, `Test Files 8 passed (8)` / `Tests 50 passed (50)`, root build `✓ built in 10.95s` + `precache 15 entries (373.92 KiB)`, hash build `✓ built in 4.32s`, `21` verify:build PASS lines (`All build-artifact checks passed.`), all verify:pwa PASS lines (`All PWA deployment checks passed.`), `11 passed (1.5m)` e2e — the 9 previous tests plus the 2 new font-resilience tests. |
| `npm.cmd run test:e2e -- tests/e2e/fonts.spec.ts` | `2 passed (3.6s)` including the self-check `expected a font host DNS failure`. |

### Review of the ten-commit diff (`5ad420e..04176c7`)

- `git diff HEAD~10..HEAD --stat`: 74 files, 4882 insertions, 55 deletions —
  docs/plan, walkthrough PNGs, verification scripts, tests, source and
  `tsconfig.tsbuildinfo` removal (intentional, D-009). No `.env`, IDE, OS
  or build artifacts added.
- Secret scan over the whole diff: no private keys, tokens, passwords,
  `secrets.*`, client secrets or bearer headers. The only `token:` hit is
  `token: 'fake'` in a unit test; the only URL hit is an npm registry link.
- Walkthrough PNGs regenerated during test runs differed from the committed
  files by 195/329160 pixels (0.06 %, text antialiasing only); restored to
  the committed versions so the fix commit contains only test changes.

### Push, CI and Pages — final SHA

- Command: `git push origin main` Result: `83fc031..924b79c main -> main`
  (11 commits: CADET-004…019 plus the font fix).
- **Final verified SHA: `924b79c`.**
- Command: `gh run watch 46015459725 --exit-status` Result: overall success,
  exit `0` — workflow "Verify and deploy to GitHub Pages": `verify` ✓ in
  `2m24s` (npm ci, lint, typecheck, test, build, build:hash, verify:build,
  test:e2e), `build` ✓ in `28s`, `deploy` ✓ in `8s`
  (`actions/deploy-pages@v4`). One non-blocking annotation: Node.js 20
  deprecation warning for `actions/checkout@v4`/`actions/setup-node@v4`.
- Live Pages probe (`https://yermukhamed0777.github.io/cadet/`): HTTP `200`,
  served asset `assets/index-CFy1mYvw.js` (identical to the local hash
  build), `{"secureContext":true,"cryptoOk":true,"skipLink":true,
  "loginVisible":true,"title":"CADET — Your path to commission","url":"https://yermukhamed0777.github.io/cadet/#/login"}`,
  `HTTP_ERRORS []`.

### Explicit scope limits (unchanged)

- **West Point and USMMA remain unverified**: their official pages returned
  HTTP 403 to automated fetching and were not re-checked; those facts keep
  the prior check date and an explicit manual-recheck note
  ([`source-audit.md`](source-audit.md)).
- **Production OAuth is not implemented**: the Google sign-in handoff is
  documentation only (D-013). **Account deletion is local demo-data
  deletion only**; the client refuses remote deletion (D-012).
- No account, email, participant, payment or public commitment was created.

