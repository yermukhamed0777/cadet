# Recovery assessment & repositioning proposal

> **Implementation status:** the U.S. service-academy track (CADET) is
> implemented on branch `reposition-us`. The Kazakhstan version is preserved at
> tag `v1-kz-mvd`. This document is the original analysis and mapping that the
> implementation follows.

Status: recovered project (single commit `61318e8`, 2026-11-23), cloned from
`yermukhamed0777/bolashaq-kursant` into this folder. No live website is attached
to the repo (`has_pages: false`, no homepage). The only deployed artifacts found
are local one-file copies (`deploy-multi/bolashaq.html`, `kb.html`) of the same
production bundle.

## 1. What was actually recovered

A mobile-first PWA, **BOLASHAQ KURSANT — «Твой путь в академию»**, an applicant
companion for the four MVD of Kazakhstan academies (Almaty, Karaganda,
Kostanay, Aktobe).

- Stack: React 18 + TypeScript + Vite 5 + Tailwind 3 + React Router 6 + Lucide + `vite-plugin-pwa`.
- 22 screens, 4-tab mobile navigation, rating: Lighthouse accessibility 100 / best practices 100 / SEO 80.
- Build verified: `npm install` + `npm run build` → clean `tsc -b` + Vite build, ~96 kB gz JS.
- Auth: fully working local "demo mode" (PBKDF2-SHA256, 150k iterations, salted hash only) with a documented production contract (REST + Google OAuth).
- Data: 4 academies, 11 programs, 9 document items, ~20 medical-checklist items, 2 fitness norm sets, 3 news items — all with per-fact source, check date, applicable year and `verified | archive | needs_review` status.

### Verified in the browser (local preview, demo account, full onboarding)

Registration → profile → academy → specialty → dashboard works end to end.
The UI is polished and consistent: navy header, gold accents, Oswald display type,
source badges on every fact, confirmation modals, progress ring, bottom nav,
safe-area insets, reduced-motion support.

## 2. Assessment

**Strengths worth preserving**
1. *Epistemic honesty*: `Fact<T>` / `SourceRef` make "no confirmed data" a first-class state instead of inventing numbers. This is rare in admissions products.
2. *Real execution engine*: `buildPath()` + `readiness()` derive progress from actual user state, with partial checklist progress and manual overrides — not decorative percentages.
3. *Clean separation*: `data/` (domain), `services/` (storage/backend), `context/` (auth/state/toasts), `pages/`, `utils/` — the domain can be swapped without touching the app shell.
4. *Working offline-first demo*: PWA + local state means the product can be evaluated without a backend.
5. *Accessibility and motion* are already handled.

**Weaknesses / blockers for growth**
1. Domain is geo-locked and tiny: four institutions, one ministry, one country; Russian-only UI; name is Kazakh/Russian and does not travel.
2. Data quality is candid but thin: `CHECKED_AT = 2026-09-27`, one fitness set is a 2025 archive, the other has no year, VVK locations list is deliberately empty, several fields are `needs_review`. Honest — but low utility as a standalone product.
3. No deployment, no SEO surface, no discoverability; SEO 80 due to invalid `robots.txt` on the SPA fallback.
4. Auth is demo-only; support messages and notifications are local/static; no real push; no document upload (only status toggles); no deadline calendar — the single most important missing piece for admissions.
5. Desktop layout wastes space (`max-w-2xl` centered column); toast notifications overlap page headers (visible on registration, onboarding and home).
6. No i18n: ~25 pages carry hard-coded Russian strings.
7. Overlaps the sibling *Methodos* project if repositioned as a generic program/scholarship catalog. Must differentiate as an **execution layer**, not a second discovery catalog.

## 3. Recommended repositioning

**Positioning:** keep the engine, change the domain to **uniformed / public-service academy admissions** — US service academies and ROTC paths first, Chinese police/public-security and military academies as a second track. The current Kazakhstan MVD flow is structurally almost identical to this world:

| Current module | New meaning (US) | New meaning (China) |
|---|---|---|
| `academies` | USMA, USNA, USAFA, USCGA, USMMA, ROTC | 公安院校 / 军校 (verified sources only) |
| `specialties` | majors, tracks, commissioning branches | 专业 / 培养方向 |
| `requirements` | nomination, age/citizenship, GPA, SAT/ACT, portal timeline | 高考分数、政审、体检、体能测试 |
| `documents` | transcript, test scores, recommendations, essays, nomination packet | 高考档案、身份证明、政审材料 |
| `vvk` (medical) | DoDMERB / entrance physical examination | 体检（军检） |
| `fitness` | Candidate Fitness Assessment norms | 体能测试标准 |
| `competition` / `enrollment` | board review → appointment | 投档录取 → 入校 |
| `news` | official admissions-cycle updates | 招生章程更新 |

Why this direction: it is the only pivot where **nearly every existing feature stays
and is simply re-pointed at new data** — including the unusual medical + fitness
modules that would be dead weight in a generic admissions app. It also avoids
competing with Methodos (discovery) and Scholion (exam prep): this product becomes
the *checklist/progress tracker that carries a candidate from decision to
appointment*.

**Name** (drop "Bolashaq Kursant" — unpronounceable outside KZ/RU and tied to one ministry):
- **CADET** — recommended; short, understood in both English and Chinese contexts, tagline *"Your path to commission."*
- **Commission** — stronger US service-academy framing, longer.
- **Oath** — memorable but ambiguous without a subtitle.

**Design**: move from "post-Soviet military portal" to "quiet institutional editorial":
warm paper background, deep ink text, one disciplined accent (cobalt or signal
red), condensed display type retained but used sparingly, data-dense comparison
tables, two-column desktop shell with sidebar, mobile bottom nav unchanged. Keep
the status/source badges as the signature trust element. Add EN and ZH locales;
keep RU/KK for any legacy Kazakhstan dataset. Verify domain/trademark availability
before committing to a name.

## 4. What stays vs. what changes

**Keep byte-for-byte:** Vite/React/TS/Tailwind setup, PWA config, router/guards,
auth + demo/production services, `UserState` and storage, UI kit, `Fact`/`SourceRef`
verification model, `buildPath`/`readiness`, all page layouts and interaction patterns.

**Replace (data + copy only):** `src/data/*.ts`, `index.html` title/description/lang,
`package.json` name, `manifest` name/theme, hardcoded Russian strings, amount and
provenance of source URLs. Keep the `SourceRef` statuses and the `ApplicableYear`
rules intact.

**Add in later phases:** i18n layer, deadline calendar + ICS export, document
upload/vault, real backend + auth + push (contract already documented in README),
and optionally a source-grounded assistant (reuse the pattern from Methodos, never
fabricate facts or predict admission chances).

## 5. Suggested sequence

0. Tag the current commit as `v1-kz-mvd` and branch `reposition` — preserve the recovered foundation.
1. Rename repo/package/title/manifest; swap in verified US (and then CN) source data; English-first copy.
2. Design pass: new tokens, desktop shell, logo, i18n scaffolding, fix toast overlap and `robots.txt`.
3. Integrations: backend/auth, deadlines + ICS, uploads, notifications.
4. Deploy the PWA (hash build for subpath hosting or Vercel with SPA rewrite), audit SEO/locales.

## 6. Risks

- US nomination/CFA/DoDMERB and Chinese 政审/体检 rules change by cycle — every fact must keep a source and year, or be marked `needs_review` as today.
- Chinese military/police academies generally restrict non-Chinese applicants; decide early whether the CN track targets domestic Chinese candidates (Chinese UI) or is limited to publicly documented international pathways.
- Verify name/domain/trademark availability; do not ship invented "chance of admission" scoring.
