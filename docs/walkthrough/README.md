# Deterministic walkthrough capture

These screenshots were generated from the production build with a fixed clock
(`2026-11-26T12:00:00Z`), a fixed locale/timezone and throwaway demo accounts.
They contain no real user data. They exist so a video can be recorded later
from the images without re-running the whole app or re-entering data.

## Regenerate

```bash
npm run capture:walkthrough
# or, for the whole suite:
npm run verify
```

The Playwright project in `playwright.config.ts` builds `dist/`, starts a local
preview on `127.0.0.1:4183`, and runs `tests/e2e/walkthrough.spec.ts`. The
capture command writes these files:

| File | Content |
|---|---|
| `01-sign-in.png` | Unauthenticated sign-in screen (mobile) |
| `02-sign-up.png` | Registration screen (mobile) |
| `03-home-with-toast.png` | Home screen immediately after onboarding, with the success toast visible (evidence for CADET-014) |
| `04-my-path.png` | Derived readiness path (mobile) |
| `05-fitness.png` | Reference-only CFA figures (mobile) |
| `06-backup.png` | Local backup and restore screen (mobile) |
| `07-home-desktop.png` | Wider desktop container (1280×900) |

Animations are disabled during capture. The seeded account uses the email
`walkthrough@example.com` / `desktop@example.com` and a local-only demo
password; no account exists outside this browser context.

## Video later

A human can combine the images into a narrated clip. No additional app run or
network access is required for the visuals. Any narration that claims users,
usage or outcomes must come from a recorded command result in
[`../plan/progress.md`](../plan/progress.md); no such claims exist yet.
