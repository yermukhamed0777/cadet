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

