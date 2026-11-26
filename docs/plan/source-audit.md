# Official-source audit — 26 November 2026

Scope: the five U.S. federal service academy profiles and the shared eligibility,
nomination, application-cycle, academic, medical and fitness facts in `src/data/`.
No Kazakhstan MVD assumption was merged; `v1-kz-mvd` remains untouched.

## Method and date convention

Each official URL below was fetched read-only on 2026-11-26. Facts from pages
that answered successfully carry `checkedAt: 2026-11-26` (`AUDITED_AT` in
`src/data/sources.ts`) and a note recording the re-check. Facts from pages that
blocked automated fetching keep the previous `CHECKED_AT` of 2026-11-25 and,
where the claim is precise, an explicit note that manual re-check is needed.
No probability, score cutoff or admission outcome was inferred.

| Official source | Result | What was confirmed | Data action |
|---|---|---|---|
| `https://www.usna.edu/Admissions/Apply/index.php` | HTTP 200 | Citizenship by 1 July of entry year; at least 17 and not past 23rd birthday on 1 July; unmarried, not pregnant, no dependents, valid SSN. Nomination sources. SAT/ACT/CLT for Class of 2031. New applications close 31 December; application complete by 31 January 2027; rolling decisions mostly by 15 April. Six-event CFA; DoDMERB process. | Added the SSN/pregnancy criteria to the Annapolis profile and `req-age-annapolis` (renamed "Eligibility — Naval Academy"); re-dated those facts and the application facts to `AUDITED_AT`. |
| `https://www.usafa.edu/admissions/commitment/requirements/` | HTTP 200 | Statutory age/citizenship/marital rules; high-school course recommendations; ACT/CLT/SAT; six CFA events; the published men's/women's averages (69/42 ft, 12/2 reps, 8.1/9.4 s, 81/78 sit-ups, 62/41 push-ups, 6:29/7:30 mile); re-test policy; medical and waiver caveats. | USAFA average set re-dated to `AUDITED_AT`. Averages remain `referenceOnly`, never passing thresholds. |
| `https://uscga.edu/admissions/admission-requirements/` | HTTP 200 | No congressional nomination required; U.S. citizen of good moral character, unmarried, no dependents or debt, 17–22 on the last Monday in June, high-school graduate or GED. Early Action 15 October, regular 15 January. | Re-dated `req-nomination-exception`; Coast Guard eligibility retained. |
| `https://uscga.edu/admissions/apply/` | HTTP 200 | Portal opens 15 July; Early Action 15 October; regular 15 January; decisions by 1 April; acceptance by 1 May; PFE required and CFA cannot be substituted. | Re-dated `req-apply-newlondon`. |
| `https://www.dha.mil/dodmerb` | HTTP 200 | DoDMERB determines medical qualification for the five service academies, ROTC and USUHS; DMACS 2.0 and DODMETS are named; waiver authority rests with the commissioning program. | Re-dated DoDMERB fact, documents item and medical checklist. |
| `https://www.whitehouse.gov/service-academy-nomination/` | HTTP 200 | Vice President may nominate to USMA/USNA/USAFA but **not** USMMA or USCGA; general eligibility and March 1–January 31 application window. | Existing nomination facts are consistent. No change. |
| `https://www.westpoint.edu/admissions/steps-to-admission` and nomination/CFA subpages | HTTP 403 to automated fetch (including a browser user-agent); archive endpoint rate-limited | Not independently re-verified in this environment. | Existing source links and prior notes retained. Added an explicit manual-recheck note to `req-selection` (55/30/15 weighting). |
| `https://www.usmma.edu/admissions` and `/admissions/8-steps-admission` | HTTP 403 to automated fetch | Not independently re-verified in this environment. | Existing `applicableYear: 2027` and "check with the admissions office" notes retained. |

## Results

- Every catalog record still has a source, a check date and a status; HTTPS
  source URLs and unique IDs are asserted by `tests/unit/data.test.ts`.
- Verified open claims were not invented. The two funding-style "open" facts
  belong to the sibling Methodos project, not CADET; CADET publishes no
  admission-chance estimate.
- Fitness figures remain published maximums or averages with `referenceOnly`.
  West Point maximums are retained with the prior check date because their
  official page blocks automated re-checking.
- Unknown fields still render as "No confirmed data" (`null` facts in
  `src/data/academies.ts`). No missing value was filled by inference.

## Human follow-up

A person should open the West Point and Kings Point canonical URLs in a normal
browser and confirm the age, nomination, cycle and CFA claims for the next
cycle; those two sites could not be re-checked from this environment.
