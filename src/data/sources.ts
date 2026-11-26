import type { SourceRef } from '../types';

/** Date of the last full manual check against official sources */
export const CHECKED_AT = '2026-11-25';

/** Date of the targeted re-check recorded in docs/plan/source-audit.md */
export const AUDITED_AT = '2026-11-26';

export const URLS = {
  westpointHome: 'https://www.westpoint.edu/admissions',
  westpointSteps: 'https://www.westpoint.edu/admissions/steps-to-admission',
  westpointNominations: 'https://www.westpoint.edu/admissions/steps-to-admission/start-nomination-planning',
  westpointCfa: 'https://www.westpoint.edu/admissions/steps-to-admission/candidate-fitness-assessment',
  westpointMajors: 'https://www.westpoint.edu/academics/majors-and-minors',
  annapolisHome: 'https://www.usna.edu/Admissions/index.php',
  annapolisApply: 'https://www.usna.edu/Admissions/Apply/index.php',
  annapolisNominations: 'https://www.usna.edu/Admissions/Apply/Nomination-Sources.php',
  annapolisCfa: 'https://www.usna.edu/Admissions/Candidate-Fitness-Assessment.php',
  annapolisAcademics: 'https://www.usna.edu/Admissions/Academics/index.php',
  annapolisNews: 'https://www.usna.edu/NewsCenter/2025/11/index.php',
  coloradoHome: 'https://www.usafa.edu/admissions/',
  coloradoRequirements: 'https://www.usafa.edu/admissions/commitment/requirements/',
  coloradoNominations: 'https://www.usafa.edu/admissions/commitment/nominations/',
  coloradoMajors: 'https://www.usafa.edu/academics/majors-minors/',
  newLondonRequirements: 'https://uscga.edu/admissions/admission-requirements/',
  newLondonApply: 'https://uscga.edu/admissions/apply/',
  newLondonAcademics: 'https://uscga.edu/academics/academic-programs/',
  kingsPointHome: 'https://www.usmma.edu/admissions',
  kingsPointSteps: 'https://www.usmma.edu/admissions/8-steps-admission',
  dodmerb: 'https://www.dha.mil/dodmerb',
  whiteHouseNomination: 'https://www.whitehouse.gov/service-academy-nomination/',
} as const;

const ref = (
  source: string,
  sourceUrl: string,
  status: SourceRef['status'],
  applicableYear: number | null,
  note?: string,
): SourceRef => ({ source, sourceUrl, checkedAt: CHECKED_AT, applicableYear, status, note });

/** A fact re-checked directly on 2026-11-26; the note records that scope. */
const audited = (
  source: string,
  sourceUrl: string,
  status: SourceRef['status'],
  applicableYear: number | null,
  note?: string,
): SourceRef => ({
  ...ref(source, sourceUrl, status, applicableYear, note),
  checkedAt: AUDITED_AT,
  note: note ? `${note} · Re-checked ${AUDITED_AT}` : `Re-checked ${AUDITED_AT}`,
});

export const SRC = {
  westpoint: (note?: string) =>
    ref('U.S. Military Academy (West Point) — Admissions', URLS.westpointHome, 'verified', null, note),
  annapolis: (note?: string) =>
    ref('U.S. Naval Academy (Annapolis) — Admissions', URLS.annapolisHome, 'verified', null, note),
  colorado: (note?: string) =>
    ref('U.S. Air Force Academy — Admissions', URLS.coloradoHome, 'verified', null, note),
  newLondon: (note?: string) =>
    ref('U.S. Coast Guard Academy (New London) — Admissions', URLS.newLondonRequirements, 'verified', null, note),
  kingsPoint: (note?: string) =>
    ref('U.S. Merchant Marine Academy (Kings Point) — Admissions', URLS.kingsPointHome, 'verified', 2027, note),
  dodmerb: (note?: string) =>
    ref('DoDMERB — Department of Defense Medical Examination Review Board', URLS.dodmerb, 'verified', null, note),
  whiteHouse: (note?: string) =>
    ref('The White House — Service Academy Nomination', URLS.whiteHouseNomination, 'verified', null, note),
  annapolisAudited: (note?: string) =>
    audited('U.S. Naval Academy (Annapolis) — Apply', URLS.annapolisApply, 'verified', 2027, note),
  coloradoAudited: (note?: string) =>
    audited('U.S. Air Force Academy — Admissions', URLS.coloradoRequirements, 'verified', null, note),
  newLondonAudited: (note?: string) =>
    audited('U.S. Coast Guard Academy (New London) — Admissions', URLS.newLondonRequirements, 'verified', null, note),
  dodmerbAudited: (note?: string) =>
    audited('DoDMERB — Department of Defense Medical Examination Review Board', URLS.dodmerb, 'verified', null, note),
  none: (note = 'No official source confirmed') => ref('No confirmed source', '', 'needs_review', null, note),
};
