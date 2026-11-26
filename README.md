# CADET — Your path to commission

A mobile-first PWA that helps applicants to **U.S. federal service academies**
track the steps from eligibility review to appointment:

- U.S. Military Academy (West Point)
- U.S. Naval Academy (Annapolis)
- U.S. Air Force Academy (Colorado Springs)
- U.S. Coast Guard Academy (New London)
- U.S. Merchant Marine Academy (Kings Point)

This is an independent tracker, **not an official U.S. government or academy
resource**. Every fact carries an official source, a check date, an applicable
year and a status (`verified` / `archive` / `needs_review`). Confirmed unknowns
are shown as “No confirmed data” rather than guessed. The app deliberately does
**not** predict admission chances or present reference fitness scores as passing
thresholds.

The project was recovered from a Kazakhstan MVD admissions PWA; the previous
version is preserved on the `v1-kz-mvd` tag. See `REPOSITIONING.md`.

## Stack

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · React Router 6 · Lucide React · vite-plugin-pwa (Workbox).

## Install and run

```bash
npm install
cp .env.example .env    # defaults to VITE_AUTH_MODE=demo
npm run dev             # http://localhost:5173 (--host is already set)
```

Demo registration uses Web Crypto, which browsers expose only on `https://` or
`localhost`. For phone testing use a production build over HTTPS or a tunnel.

```bash
npm run build           # TypeScript check + build to dist/ with a service worker
npm run preview         # local production preview at http://localhost:4173
npm run build:hash      # dist-hash/ with HashRouter, relative paths, no SW
```

`dist/` is a static site. Configure an SPA fallback on the host (`/* /index.html 200`
on Netlify, `rewrites` on Vercel, `try_files` on Nginx). PWA and Web Crypto need HTTPS.

### Live demo

**https://yermukhamed0777.github.io/cadet/**

GitHub Pages uses the hash build (`/#/home`) because it has no SPA fallback.
The trade-off is that the service worker is disabled there, so **offline
caching is not available** on that deployment. Because Pages is served over
HTTPS, it *is* a secure context: Web Crypto and demo registration work there.
Observed in Chrome on 2026-11-26: `isSecureContext=true`, PBKDF2 succeeded, no
service worker, no manifest, no HTTP errors, and `/#/login` loaded. The live site
still serves the last published commit until a new push is authorised. Run the
standard build on an HTTPS host with SPA rewrites for the full PWA experience;
`npm run verify:pwa` checks both variants locally.

## Authentication

### Demo mode (default)

`VITE_AUTH_MODE=demo` (or an empty `VITE_API_URL`). Accounts and state live in
this browser only (`localStorage`, in-memory fallback). The password is stored
as a PBKDF2-SHA256 hash (150,000 iterations) with a random salt — never in plain
text. A “Demo mode” notice is shown; Google sign-in stays disabled with an
explanation.

### Production mode

```env
VITE_AUTH_MODE=production
VITE_API_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
VITE_OAUTH_REDIRECT_PATH=/auth/callback
```

Only the public Client ID is stored in the frontend. The Client Secret and the
code-for-token exchange live on the backend. Flow:

```
Google button → GET {API}/auth/google?redirect_uri={APP}/auth/callback
→ Google → {API}/auth/google/callback (backend exchanges the code)
→ redirect to {APP}/auth/callback?token=<session_token>
→ frontend: GET {API}/auth/me
```

**This is a documented contract, not a working feature.** No production backend,
Google OAuth client or cloud synchronisation has been deployed or verified end to
end; in the shipped build Google sign-in stays disabled. The query-string token
handoff above is a known credential-leakage risk (browser history, copied URLs,
referrer headers and server logs). The callback scrubs the token from the
address bar after reading it, but a secure implementation should instead use an
authorisation code with PKCE and a backend code-for-session exchange, returning
an HttpOnly session cookie. Do not treat the documented query token as secure.

## Backup and restore

Demo data lives only in this browser. **Profile → Backup & restore** downloads
a versioned JSON file (`schema: 1`) containing your profile, academy and
program selection, checklists, fitness results, notifications and comparison
list. Restoring validates the file, lets you confirm, and then replaces the
current state. Signing out does not delete local data; clearing browser data or
switching devices does — keep the backup somewhere private, since it contains
your name and date of birth. **Profile → Delete demo account and local data**
removes the account record, profile, checklists, results, support messages and
session after typing `DELETE`; this cannot be undone. In production mode the
backend owns state instead (`GET/PUT /me/state`), the local backup is not used,
and account deletion must be provided by that backend — the client refuses to
pretend it can delete a remote account.

## Verify

The same checks run locally and in CI. CI deploys only after every step passes.

```bash
npm run lint          # ESLint, warnings denied (--max-warnings 0)
npm run typecheck     # tsc -b
npm test              # Vitest: unit + data-layer suites
npm run build         # TypeScript check + root-path PWA build → dist/
npm run build:hash    # subpath/HashRouter build → dist-hash/
npm run verify:build  # asserts artifacts and relative vs absolute paths
npm run verify:pwa    # both builds: SW, offline, Web Crypto, routes, assets
npm run test:e2e      # Playwright (system Chrome) against dist/
npm run verify        # all of the above in order
```

`docs/plan/progress.md` records the exact commands and results of the last
local run. `npm run capture:walkthrough` regenerates the deterministic
screenshots in `docs/walkthrough/`; see `docs/walkthrough/README.md`.

## Accessibility

A skip link is the first focusable element on every screen and targets
`#main-content`. The signed-in shell announces the current view in a polite
live region and updates the document title. Form errors set `aria-invalid` and
are tied to their fields. `npm run test:e2e` checks keyboard focus, labelled
controls, announcements and 375 px overflow across the major workspaces. A
manual screen-reader pass is still required before the pilot.

Source provenance and the 2026-11-26 official-source audit are in
[`docs/plan/source-audit.md`](docs/plan/source-audit.md).

## Backend contract

The UI talks to `src/services` and does not depend on a specific store. Expected
production endpoints:

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/register` | `{email, password}` → `{user, token}` |
| POST | `/auth/login` | `{email, password}` → `{user, token}` |
| GET | `/auth/google` | start OAuth (redirect) |
| GET | `/auth/me` | current user |
| POST | `/auth/logout` | end session |
| GET / PUT | `/me/state` | `UserState` (profile, selections, checklists, results, notifications) |
| GET | `/news` | `NewsItem[]` from a CMS |
| POST | `/support/messages` | `{subject, message}` |

Bearer token plus `credentials: 'include'`; a Supabase/Firebase/custom backend
can be used by replacing the service implementations.

## Where the data lives

| What | File |
|---|---|
| Academies (addresses, eligibility, contacts) | `src/data/academies.ts` |
| Academic programs | `src/data/specialties.ts` |
| Eligibility, deadlines and steps | `src/data/requirements.ts` |
| CFA reference scores | `src/data/fitness.ts` |
| Document checklist | `src/data/documents.ts` |
| DoDMERB medical checklist | `src/data/vvk.ts` |
| Verified updates | `src/data/news.ts` |
| FAQ and starter notifications | `src/data/faq.ts`, `src/data/notifications.ts` |
| Official source registry and check date | `src/data/sources.ts` |

Rules:

- Do not add a fact without a source. Unconfirmed items → `needs_review`.
- Previous-cycle material → `archive` with its year.
- `verified` + `applicableYear` means the item was checked against the linked
  official page; `CHECKED_AT` in `sources.ts` records the last review.
- Some official pages block automated fetching. They were checked via a cached
  or translated view of the **same canonical URL** — the note on those facts
  says so. Re-check manually before publishing new numbers.
- Fitness figures are **maximum scores or published averages**, not passing
  thresholds; the UI marks them `referenceOnly`.

## Structure

Other top-level folders:

```
docs/plan/        strategy, roadmap, stable-ID backlog, decisions, progress logs
docs/walkthrough/ deterministic screenshots and capture instructions
docs/pilot-handoff.md  what remains human before and during the pilot
scripts/          build-artifact verification
tests/unit/       fast pure-rule tests (Vitest)
tests/data/       storage/auth/state tests (Vitest + jsdom)
tests/e2e/        browser journeys and walkthrough capture (Playwright)
```

```
src/
  components/  UI kit (ui/), navigation, guards, cards
  context/     Auth, AppState, Toast
  data/        static catalogs with sources
  hooks/       useAuth, useAppState/usePath, useToast, useAsync
  layouts/     AppLayout (bottom nav), AuthLayout
  pages/       screens
  services/    auth, profile/support, academy, news, storage, apiClient, config
  types/       TypeScript types
  utils/       progress, fitness, validation, crypto, formatting, backup, events, oauth
```
