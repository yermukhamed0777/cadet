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

### Fixed

- Reference-only fitness grading and progress now respect lower-is-better timed
  events: a faster shuttle/run no longer shows as "below standard".
- README no longer claims Web Crypto is unavailable on the HTTPS GitHub Pages
  deployment; it now states the real constraint (no service worker in the hash
  build).
- The OAuth callback token is scrubbed from the address bar after use.
- The historical check date in `REPOSITIONING.md` is labelled as such.

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
