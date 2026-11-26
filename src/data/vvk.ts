import type { ChecklistItem, VvkLocation } from '../types';
import { SRC } from './sources';

const D = (note?: string) =>
  SRC.dodmerbAudited(note ?? 'Official DoDMERB page; confirm current procedures with your commissioning program');

export const VVK_VERSION_TITLE = 'Medical screening — DoDMERB process';

/**
 * Medical qualification checklist. This is an administrative tracker, not
 * medical advice and not a prediction of qualification.
 */
export const vvkChecklist: ChecklistItem[] = [
  {
    id: 'med-dodmerb',
    title: 'Complete the DoDMERB examination',
    description: 'DoDMERB determines medical qualification for the five service academies, ROTC and USUHS.',
    ...D(),
  },
  {
    id: 'med-dmacs',
    title: 'Use the DMACS 2.0 / DODMETS process',
    description: 'The official page names DMACS 2.0 and DODMETS as part of the examination process.',
    ...D(),
  },
  {
    id: 'med-status',
    title: 'Check your qualification status',
    description: 'Review the result in the official system, not in a third-party tracker.',
    ...D('The tracker only records your own progress'),
  },
  {
    id: 'med-waiver',
    title: 'Waiver request, if applicable',
    description: 'Waiver authority rests with the commissioning program, not with DoDMERB.',
    ...D(),
  },
  {
    id: 'med-deadline',
    title: 'Confirm the deadline with your academy',
    description: 'Deadlines vary by school and cycle; no universal date is published here.',
    ...SRC.none('Check the admissions office for the current cycle'),
  },
];

/**
 * Exam locations. No verified street addresses are published in the checked
 * sources, so the list stays empty rather than showing invented locations.
 */
export const vvkLocations: VvkLocation[] = [];

export const vvk2026Note = {
  text: 'DoDMERB determines medical qualification for the service academies. This screen tracks your preparation only — it is not a medical assessment or an official result.',
  ...D(),
};
