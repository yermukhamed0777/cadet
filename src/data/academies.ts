import type { Academy, Fact, SourceRef } from '../types';
import { SRC, URLS } from './sources';

const fact = <T>(value: T | null, ref: SourceRef): Fact<T> => ({ value, ...ref });
const unknown = <T = string>(note?: string): Fact<T> => fact<T>(null, SRC.none(note));

/**
 * Five U.S. federal service academies. Every claim carries a source, a check
 * date, an applicable year and a verification status. null is rendered by the
 * UI as "No confirmed data" — never replaced with a guess.
 */
export const academies: Academy[] = [
  {
    id: 'westpoint',
    title: 'U.S. Military Academy (West Point)',
    shortTitle: 'West Point',
    nameNote: 'USMA — United States Military Academy, West Point, New York.',
    nameRef: SRC.westpoint(),
    city: 'West Point, NY',
    website: URLS.westpointHome,
    address: fact('606 Thayer Rd, West Point, NY 10996', SRC.westpoint('Address shown on the official admissions page')),
    founded: unknown('Founding year not confirmed on the admissions pages checked'),
    history: unknown('No dated history statement confirmed on the admissions pages checked'),
    directions: fact(
      ['Academic majors and minors (full catalog on the official academics page)'],
      { ...SRC.westpoint('The page lists majors and minors; no single authoritative list is reproduced here'), sourceUrl: URLS.westpointMajors },
    ),
    studyConditions: fact(
      'U.S. citizen; 17–22 on July 1 of the entry year; unmarried; no legal obligation to support children.',
      { ...SRC.westpoint(), sourceUrl: URLS.westpointSteps },
    ),
    dormitory: unknown(),
    meals: unknown(),
    stipend: unknown(),
    employment: unknown('Commissioning outcomes not confirmed on the admissions pages checked'),
    contacts: [
      { label: 'Admissions', value: 'westpoint.edu/admissions', kind: 'web', ref: SRC.westpoint() },
      { label: 'Candidate portal', value: 'apply.westpoint.edu', kind: 'web', ref: SRC.westpoint() },
    ],
  },
  {
    id: 'annapolis',
    title: 'U.S. Naval Academy (Annapolis)',
    shortTitle: 'Annapolis',
    nameNote: 'USNA — United States Naval Academy, Annapolis, Maryland.',
    nameRef: SRC.annapolis(),
    city: 'Annapolis, MD',
    website: URLS.annapolisHome,
    address: unknown('Street address not confirmed on the checked admissions pages; city is shown in the catalog'),
    founded: unknown('Founding year not stated on the checked admissions pages'),
    history: fact(
      'The academy marked 180 years in a November 2025 News Center item.',
      { ...SRC.annapolis('History statement from USNA News Center, not an admissions rule'), sourceUrl: URLS.annapolisNews },
    ),
    directions: fact(
      ['Aerospace Engineering', 'Cyber Science', 'Ocean Engineering'],
      {
        ...SRC.annapolis('Examples from the official majors page; 23 majors are listed there'),
        sourceUrl: URLS.annapolisAcademics,
      },
    ),
    studyConditions: fact(
      'U.S. citizen by July 1 of the entry year; at least 17 and not past the 23rd birthday on July 1; unmarried with no dependents.',
      { ...SRC.annapolis('Applies to the Class of 2031 cycle'), sourceUrl: URLS.annapolisApply },
    ),
    dormitory: unknown(),
    meals: unknown(),
    stipend: unknown(),
    employment: unknown(),
    contacts: [
      { label: 'Admissions', value: 'usna.edu/Admissions', kind: 'web', ref: SRC.annapolis() },
      { label: 'Apply', value: 'usna.edu/Admissions/Apply', kind: 'web', ref: SRC.annapolis() },
    ],
  },
  {
    id: 'coloradosprings',
    title: 'U.S. Air Force Academy (Colorado Springs)',
    shortTitle: 'Air Force',
    nameNote: 'USAFA — United States Air Force Academy, Colorado Springs, Colorado.',
    nameRef: SRC.colorado(),
    city: 'Colorado Springs, CO',
    website: URLS.coloradoHome,
    address: unknown('Street address not confirmed on the checked admissions pages; city is shown in the catalog'),
    founded: unknown('Founding year not stated on the checked admissions pages'),
    history: unknown(),
    directions: fact(
      ['26 disciplinary majors', '4 divisional majors', '22 minors'],
      { ...SRC.colorado('Counts from the official majors page; individual names are listed there'), sourceUrl: URLS.coloradoMajors },
    ),
    studyConditions: fact(
      'U.S. citizen; 17 to before the 23rd birthday on July 1 of the entry year; unmarried with no dependents.',
      { ...SRC.colorado(), sourceUrl: URLS.coloradoRequirements },
    ),
    dormitory: unknown(),
    meals: unknown(),
    stipend: unknown(),
    employment: unknown(),
    contacts: [
      { label: 'Admissions', value: 'usafa.edu/admissions', kind: 'web', ref: SRC.colorado() },
      { label: 'Pre-Candidate Questionnaire', value: 'usafa.edu/admissions/register', kind: 'web', ref: SRC.colorado() },
    ],
  },
  {
    id: 'newlondon',
    title: 'U.S. Coast Guard Academy (New London)',
    shortTitle: 'Coast Guard',
    nameNote: 'USCGA — United States Coast Guard Academy, New London, Connecticut.',
    nameRef: SRC.newLondon(),
    city: 'New London, CT',
    website: URLS.newLondonRequirements,
    address: unknown('Street address not confirmed on the checked admissions pages; city is shown in the catalog'),
    founded: unknown('Founding year not stated on the checked admissions pages'),
    history: unknown(),
    directions: fact(
      ['Four-year program', 'Science and technology', 'Liberal arts', 'In-depth major study'],
      { ...SRC.newLondon(), sourceUrl: URLS.newLondonAcademics },
    ),
    studyConditions: fact(
      'U.S. citizen; unmarried with no dependents or debt; 17–22 on the last Monday in June; high school graduate or GED.',
      SRC.newLondon(),
    ),
    dormitory: unknown(),
    meals: unknown(),
    stipend: unknown(),
    employment: unknown(),
    contacts: [
      { label: 'Admissions', value: 'uscga.edu/admissions', kind: 'web', ref: SRC.newLondon() },
      { label: 'Application portal', value: 'uscga.edu/admissions/apply', kind: 'web', ref: SRC.newLondon('Class of 2031 portal') },
    ],
  },
  {
    id: 'kingspoint',
    title: 'U.S. Merchant Marine Academy (Kings Point)',
    shortTitle: 'Kings Point',
    nameNote: 'USMMA — United States Merchant Marine Academy, Kings Point, New York.',
    nameRef: SRC.kingsPoint(),
    city: 'Kings Point, NY',
    website: URLS.kingsPointHome,
    address: fact('Kings Point, NY 11024', SRC.kingsPoint('City and ZIP shown on the official admissions page')),
    founded: unknown('Founding year not stated on the checked admissions pages'),
    history: unknown(),
    directions: unknown('Academic program list not confirmed on the checked admissions pages'),
    studyConditions: fact(
      'U.S. citizen; at least 17 and not yet 25 on July 1 of the entry year.',
      { ...SRC.kingsPoint(), sourceUrl: URLS.kingsPointSteps },
    ),
    dormitory: unknown(),
    meals: unknown(),
    stipend: unknown(),
    employment: unknown(),
    contacts: [
      { label: 'Admissions', value: 'usmma.edu/admissions', kind: 'web', ref: SRC.kingsPoint() },
      { label: 'Steps to admission', value: 'usmma.edu/admissions/8-steps-admission', kind: 'web', ref: SRC.kingsPoint() },
    ],
  },
];
