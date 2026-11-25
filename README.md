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
  utils/       progress, fitness, validation, crypto, formatting
```
