import type { SourceRef } from '../types';
import { SRC, URLS } from './sources';

export interface RequirementFact extends SourceRef {
  id: string;
  title: string;
  text: string;
}

const entry = (
  id: string,
  title: string,
  text: string,
  ref: SourceRef,
  extra?: Partial<Pick<RequirementFact, 'sourceUrl' | 'applicableYear' | 'status' | 'note'>>,
): RequirementFact => ({ id, title, text, ...ref, ...extra });

/** Eligibility, steps and published deadlines — each item cites an official page. */
export const admissionFacts: RequirementFact[] = [
  entry(
    'req-citizenship',
    'U.S. citizenship',
    'USMA applicants must be U.S. citizens, 17–22 on July 1 of the entry year, unmarried and without a legal obligation to support children.',
    SRC.westpoint(),
    { sourceUrl: URLS.westpointSteps },
  ),
  entry(
    'req-age-annapolis',
    'Eligibility — Naval Academy',
    'USNA requires citizenship by 1 July of the entry year, an age of at least 17 and not past the 23rd birthday on 1 July, unmarried status, not pregnant, no dependents and a valid Social Security number.',
    SRC.annapolisAudited('Published for the Class of 2031 cycle'),
    { sourceUrl: URLS.annapolisApply, applicableYear: 2027 },
  ),
  entry(
    'req-age-kingspoint',
    'Age rules — Merchant Marine Academy',
    'USMMA requires applicants to be at least 17 and not yet 25 on July 1 of the entry year, and to be U.S. citizens.',
    SRC.kingsPoint(),
    { sourceUrl: URLS.kingsPointSteps },
  ),
  entry(
    'req-nomination',
    'Congressional nomination',
    'A nomination is required for USMA. Sources include senators, a representative and the Vice President; most nomination deadlines fall in September–October of the senior year.',
    SRC.westpoint(),
    { sourceUrl: URLS.westpointNominations },
  ),
  entry(
    'req-nomination-exception',
    'Coast Guard: no nomination',
    'USCGA does not require a congressional nomination, unlike the other federal service academies.',
    SRC.newLondonAudited(),
  ),
  entry(
    'req-nomination-deadlines',
    'Nomination deadlines vary',
    'USAFA states a Vice Presidential deadline of January 31, congressional office deadlines as early as September 1 and an international nomination deadline of December 15.',
    SRC.colorado(),
    { sourceUrl: URLS.coloradoNominations },
  ),
  entry(
    'req-tests',
    'Admission tests',
    'USNA lists SAT and ACT results in its application requirements; from the 2027 academic year (Class of 2031) it also accepts the Classic Learning Test.',
    SRC.annapolisAudited('SAT, ACT and CLT are all listed for the Class of 2031 cycle'),
    { sourceUrl: URLS.annapolisApply, applicableYear: 2027 },
  ),
  entry(
    'req-cfa',
    'Candidate Fitness Assessment',
    'The CFA has six events: basketball throw, cadence pull-ups (flexed-arm hang for women), 40-yard shuttle, modified sit-ups, push-ups and a 1-mile run.',
    SRC.westpoint(),
    { sourceUrl: URLS.westpointCfa, note: 'Event list; published maximum scores are shown on the Fitness screen' },
  ),
  entry(
    'req-medical',
    'DoDMERB medical qualification',
    'DoDMERB determines medical qualification for the service academies, ROTC and USUHS. The commissioning program — not DoDMERB — decides on waivers.',
    SRC.dodmerbAudited(),
  ),
  entry(
    'req-apply-annapolis',
    'Application deadline — Naval Academy',
    'For the Class of 2031, applications close on December 31 and must be complete by January 31, 2027. Admission is rolling and most candidates are notified by April 15.',
    SRC.annapolisAudited('Applications close 31 December; complete by 31 January 2027'),
    { sourceUrl: URLS.annapolisApply, applicableYear: 2027 },
  ),
  entry(
    'req-apply-newlondon',
    'Application deadlines — Coast Guard',
    'For the Class of 2031, the portal opens July 15; Early Action closes October 15, regular application closes January 15, decisions arrive by April 1 and acceptance is due May 1. The Physical Fitness Exam is required; the CFA cannot replace it.',
    SRC.newLondonAudited('Deadlines published for the Class of 2031 cycle'),
    { sourceUrl: URLS.newLondonApply, applicableYear: 2027 },
  ),
  entry(
    'req-apply-kingspoint',
    'Application deadline — Merchant Marine',
    'Applications for the Class of 2031 opened May 1, 2026; a completed application is due February 1 and acceptance is due May 1. A nomination from a Representative or Senator is required by January 31.',
    SRC.kingsPoint(),
    { sourceUrl: URLS.kingsPointSteps, applicableYear: 2027 },
  ),
  entry(
    'req-apply-colorado',
    'Application timeline — Air Force',
    'Applications open on March 1 of the junior year; the first step is the Pre-Candidate Questionnaire.',
    SRC.colorado(),
  ),
  entry(
    'req-selection',
    'How West Point evaluates candidates',
    'USMA publishes a candidate score weighting of 55% academics, 30% leadership and character, and 15% physical fitness.',
    SRC.westpoint('Official page blocks automated fetching; re-check this weighting manually before relying on it'),
    { sourceUrl: URLS.westpointSteps },
  ),
];
