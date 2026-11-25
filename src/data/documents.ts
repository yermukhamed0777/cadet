import type { DocumentCategory, DocumentItem } from '../types';
import { SRC, URLS } from './sources';

export const documentCategories: { id: DocumentCategory; title: string }[] = [
  { id: 'main', title: 'Application' },
  { id: 'education', title: 'Academic records' },
  { id: 'family', title: 'Family & dependents' },
  { id: 'references', title: 'Recommendations' },
  { id: 'medical', title: 'Medical (DoDMERB)' },
  { id: 'photos', title: 'Photos' },
  { id: 'special', title: 'Nomination & other' },
];

export const NEEDS_REVIEW_TEXT = 'Check the current requirements with the admissions office';

const review = SRC.none(NEEDS_REVIEW_TEXT);

/**
 * Application checklist. An item is only marked verified when an official
 * academy page names it; copies and notarization stay null when unconfirmed.
 */
export const documents: DocumentItem[] = [
  {
    id: 'doc-portal',
    category: 'main',
    title: 'Application submitted through the academy portal',
    description: 'Each academy publishes its own application portal; USMA, USNA, USAFA, USCGA and USMMA all accept online applications.',
    copies: null,
    notarized: null,
    ...SRC.westpoint('Portal list is on each academy’s admissions site'),
  },
  {
    id: 'doc-usma-checklist',
    category: 'main',
    title: 'USMA Candidate Checklist',
    description: 'West Point publishes a candidate checklist with a January 31 deadline in the senior year.',
    copies: null,
    notarized: null,
    ...SRC.westpoint(),
    sourceUrl: URLS.westpointSteps,
  },
  {
    id: 'doc-usafa-pcq',
    category: 'main',
    title: 'USAFA Pre-Candidate Questionnaire',
    description: 'The first step published by the Air Force Academy is the Pre-Candidate Questionnaire.',
    copies: null,
    notarized: null,
    ...SRC.colorado(),
  },
  {
    id: 'doc-transcript',
    category: 'education',
    title: 'Official high school transcript',
    description: NEEDS_REVIEW_TEXT,
    copies: null,
    notarized: null,
    ...review,
  },
  {
    id: 'doc-tests',
    category: 'education',
    title: 'SAT, ACT or CLT scores',
    description: 'USNA lists SAT and ACT results and, from the 2027 academic year, the Classic Learning Test.',
    copies: null,
    notarized: null,
    ...SRC.annapolis('Applies to the Class of 2031 cycle'),
    sourceUrl: URLS.annapolisHome,
  },
  {
    id: 'doc-dependents',
    category: 'family',
    title: 'Dependent-status information',
    description: 'The academies require unmarried candidates without dependents; check which form documents this.',
    copies: null,
    notarized: null,
    ...review,
  },
  {
    id: 'doc-recommendations',
    category: 'references',
    title: 'Recommendations / evaluations',
    description: NEEDS_REVIEW_TEXT,
    copies: null,
    notarized: null,
    ...review,
  },
  {
    id: 'doc-dodmerb',
    category: 'medical',
    title: 'DoDMERB medical examination paperwork',
    description: 'DoDMERB determines medical qualification for the academies; the process is run through DMACS and DODMETS.',
    copies: null,
    notarized: null,
    ...SRC.dodmerb(),
  },
  {
    id: 'doc-photo',
    category: 'photos',
    title: 'Photos',
    description: NEEDS_REVIEW_TEXT,
    copies: null,
    notarized: null,
    ...review,
  },
  {
    id: 'doc-nomination',
    category: 'special',
    title: 'Nomination packet',
    description: 'Required at USMA, USNA, USAFA and USMMA; USCGA does not require a congressional nomination.',
    copies: null,
    notarized: null,
    ...SRC.westpoint(),
    sourceUrl: URLS.westpointNominations,
  },
];
