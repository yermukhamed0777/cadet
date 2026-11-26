# Seven-day pilot handoff

This is the last agent-doable deliverable. Everything needed to start the pilot
is in this repository; the pilot itself needs real people and is **Human only**.
No agent has recruited, contacted, consented or tested with a user, and nobody
has been asked to try the app.

## Goal

Find out whether an applicant can use CADET, unaided, to go from a fresh browser
to a personalised "My Path" checklist with the correct academy, program and
sourced facts — and whether any step causes confusion or data loss. The product
claim being tested is *navigation and comprehension*, not admission outcomes.

## Cohort and consent wording (draft — human must approve)

**Cohort:** 5–8 U.S. high-school juniors or seniors, or recent applicants, with
no prior exposure to the app. Recruitment and consent are the facilitator's job.
Do not include minors without a parent/guardian's separate consent.

**Draft consent text (needs human/legal review):**

> You are being invited to try a prototype that helps applicants track service
> academy application steps. Participation is voluntary and you may stop at any
> time. The prototype runs in your browser; any details you enter stay on that
> device. We will not collect your name, date of birth, email, passwords,
> journal notes or support messages. During the session the app records only
> anonymous counts of which screens and buttons were used (event names and
> times); nothing is transmitted anywhere. We will ask you a few questions at
> the end. Your answers will be summarised without identifying details. You can
> ask for all locally stored data to be deleted at the end of the session.

The claim "nothing is transmitted" is accurate for the demo build: the event
harness (`src/utils/events.ts`) has no network code, and demo support messages
stay in the browser. Do not change that without revisiting this wording.

## Schedule (seven days, proposed)

| Day | Facilitator action |
|---|---|
| 0 | Approve consent wording, confirm devices, set up a fresh local/HTTPS build. No accounts or payments needed. |
| 1–3 | Supervised sessions: participants complete registration → profile → academy → program → My Path. Facilitator observes silently and notes where help is requested. |
| 4 | Unsupervised follow-up: same flow on a fresh browser, no prompts. |
| 5 | Backup/restore exercise using throwaway data only. |
| 6 | Short structured interview; collect the content-free event counts locally. |
| 7 | Apply go/no-go criteria below, file any failure as a new backlog ID, decide next steps. |

## What to collect

- **Automatic, content-free counts** from the local event harness: `app_opened`,
  `path_stage_completed`, `checklist_item_toggled`, `reference_viewed`,
  `backup_exported`, `backup_imported`. Only event names and timestamps exist;
  there is no payload and no transmission. An automated unit test asserts that
  no journal or account content can be emitted.
- **Facilitator observations** written as short, non-identifying notes: which
  step stalled, what wording was misread, whether help was requested. Do not
  copy participant text into notes.
- **Optional anonymised feedback** (e.g. a 3-question form run by the
  facilitator). Store it outside the app and without account content.

**Do not collect:** names, dates of birth, email addresses, passwords, support
message text, journal/checklist content, or any recording that includes them.

## Filing a failure

1. Add a new stable `CADET-NNN` row to
   [`docs/plan/backlog.md`](plan/backlog.md) with a `file:line` reference, a
   non-identifying reproduction and a measurable "Done when" criterion.
2. Append the observation to [`docs/plan/decisions.md`](plan/decisions.md) if a
   product choice is needed, and the exact command/result to
   [`docs/plan/progress.md`](plan/progress.md) if a command was run.
3. Fix with a regression test in the same commit, then mark the ID `Done` only
   after the verification command is recorded. Never renumber IDs or rewrite
   log entries.

## Go / no-go criteria (proposed targets — not measured)

These numbers are **proposed by the agent**; the owner must approve or change
them before the pilot. No result has been recorded yet.

- **Go:** every participant reaches `/home` without assistance; no data-loss or
  privacy incident; no P0/P1 backlog item open; all proposed consent wording
  approved; event counts show the six screens were reached in the expected
  order.
- **No-go:** any participant cannot complete onboarding unaided, any local data
  is lost or sent off-device, a P0 defect remains open, or consent wording is
  not approved.

## Explicitly human only

- Recruiting participants, obtaining consent, and running all sessions.
- Approving or rewriting the consent text and go/no-go targets.
- Rechecking official source facts against canonical pages for a new cycle.
- Choosing and applying a project licence (CADET-011).
- Pushing, publishing, changing repository visibility, or spending money.
- Deploying a production backend and any accounts it requires.

## Stop line

Work stopped here. The next action is a human decision to start the pilot; no
further agent work is needed to make the repository ready for it.
