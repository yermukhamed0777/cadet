# Changelog

All notable changes are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Dates and results of
verification runs are in [`docs/plan/progress.md`](docs/plan/progress.md).

## [Unreleased]

### Added

- Auditable plan layer: strategy, roadmap, stable-ID backlog, append-only
  decisions and progress logs, and an index with the update convention.
- Fast unit harness (Vitest) for pure rules, data-layer tests (jsdom), browser
  e2e (Playwright) and a build-artifact verifier for root and subpath builds.
- Content-free local event harness with an allowlist and an automated assertion
  that emitted events contain no journal or account content.
- Local JSON backup and restore under Profile → Backup & restore, with version
  validation and a confirmation step.
- Deterministic walkthrough capture (`npm run capture:walkthrough`) and a pilot
  handoff document.
- CI `verify` job that gates the GitHub Pages build and deployment.
- `verify:pwa`, which independently checks the root PWA and Pages hash builds
  for assets, Web Crypto, service-worker behaviour, offline navigation, direct
  routes and installability configuration.
- Demo account deletion with typed confirmation, removing local account,
  profile, checklists, results, support messages and session data.
- Skip link, focusable main landmark target, polite route announcer and
  per-view document titles.
- Official-source audit record with a narrower 2026-11-26 re-check date for
  facts whose pages could actually be fetched.

### Fixed

- Reference-only fitness grading and progress now respect lower-is-better timed
  events: a faster shuttle/run no longer shows as "below standard".
- README no longer claims Web Crypto is unavailable on the HTTPS GitHub Pages
  deployment; it now states the real constraint (no service worker in the hash
  build).
- The OAuth callback token is scrubbed from the address bar after use.
- The historical check date in `REPOSITIONING.md` is labelled as such.
- USNA eligibility now includes the official no-pregnancy and valid-SSN criteria;
  directly re-checked facts carry an explicit audit date while blocked sources
  keep their previous date and a manual-recheck note.
- README now states that Google OAuth and cloud sync are an unverified backend
  contract, names the query-token leakage risk, and recommends PKCE with an
  HttpOnly session for any future implementation.

### Changed

- ESLint replaces the previous no-lint setup; desktop layout uses a wider
  container while keeping the mobile bottom navigation.
- `tsconfig.tsbuildinfo` is no longer tracked (generated file).

## [2.0.0] — 2026-11-25

- Repositioned the recovered Kazakhstan MVD PWA as CADET, a U.S. service
  academy admissions tracker. The previous version is preserved at tag
  `v1-kz-mvd`.
- English-first copy, five sourced academy catalogs, source-grounded
  eligibility, document, medical and fitness screens.
- Demo and production authentication contracts; GitHub Pages hash deployment.
