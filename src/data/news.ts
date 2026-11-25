import type { NewsItem } from '../types';
import { CHECKED_AT, URLS } from './sources';

/** Only official publications — summaries link to the original item. */
export const news: NewsItem[] = [
  {
    id: 'n-2027-clt',
    title: 'Naval Academy adds the Classic Learning Test',
    date: '2026-11-25',
    summary:
      'From the 2027 academic year (Class of 2031), USNA accepts the Classic Learning Test alongside the SAT and ACT. The official admissions page does not show a publication date; 25 November 2026 is the date this item was checked.',
    publisher: 'U.S. Naval Academy — Admissions',
    source: 'U.S. Naval Academy (usna.edu)',
    sourceUrl: URLS.annapolisHome,
    checkedAt: CHECKED_AT,
    applicableYear: 2027,
    status: 'verified',
  },
  {
    id: 'n-2031-kingspoint-open',
    title: 'Kings Point opens Class of 2031 applications',
    date: '2026-05-01',
    summary:
      'The Merchant Marine Academy admissions page states that Class of 2031 applications opened on 1 May 2026, with a completed application due 1 February and acceptance due 1 May.',
    publisher: 'U.S. Merchant Marine Academy — Admissions',
    source: 'U.S. Merchant Marine Academy (usmma.edu)',
    sourceUrl: URLS.kingsPointSteps,
    checkedAt: CHECKED_AT,
    applicableYear: 2027,
    status: 'verified',
  },
];
