import type { FaqItem } from '../types';

export const faq: FaqItem[] = [
  {
    id: 'f-docs',
    question: 'Which documents do I need?',
    answer:
      'This tracker lists only items named on official academy pages. Unconfirmed items are marked "Needs review" — check the current checklist with the admissions office.',
    link: { to: '/documents', label: 'Open documents' },
  },
  {
    id: 'f-medical',
    question: 'Where is the medical exam?',
    answer:
      'DoDMERB handles medical qualification for the service academies. No verified exam-site addresses are published here, so the map stays empty rather than showing guesses.',
    link: { to: '/vvk/map', label: 'Exam locations' },
  },
  {
    id: 'f-program',
    question: 'How do I choose a program?',
    answer: 'Open an academy → Programs → View details, then select the program. You can change it later in your profile.',
    link: { to: '/academies', label: 'Academies' },
  },
  {
    id: 'f-change-school',
    question: 'How do I change schools?',
    answer: 'Profile → Change academy. The selected program is cleared if it belongs to another academy.',
    link: { to: '/profile', label: 'Open profile' },
  },
  {
    id: 'f-fitness',
    question: 'Where are the fitness standards?',
    answer:
      'Open the Fitness test screen. It shows CFA reference scores published by West Point, Annapolis and the Air Force Academy. Official pages publish maximum scores or averages, not passing thresholds.',
    link: { to: '/fitness', label: 'Fitness test' },
  },
  {
    id: 'f-prediction',
    question: 'Does this predict whether I will be appointed?',
    answer:
      'No. Readiness here is the share of your own checklist steps completed. It is not an admission chance estimate and not an official decision.',
    link: { to: '/my-path', label: 'My Path' },
  },
  {
    id: 'f-contacts',
    question: 'Where do I find official contacts?',
    answer: 'Every school page links to its official admissions site. Only official links are shown.',
  },
];
