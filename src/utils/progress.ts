import { documents } from '../data/documents';
import { fitnessNormSets } from '../data/fitness';
import { vvkChecklist } from '../data/vvk';
import type { Gender, PathStage, UserState } from '../types';
import { pluralRu } from './format';

export const vvkItemsFor = (gender: Gender | undefined) =>
  vvkChecklist.filter((i) => !i.appliesTo || !gender || i.appliesTo === gender);

export function vvkStats(state: UserState) {
  const items = vvkItemsFor(state.profile?.gender);
  const done = items.filter((i) => state.vvkProgress[i.id]).length;
  return { done, total: items.length };
}

export function documentStats(state: UserState) {
  const total = documents.length;
  const ready = documents.filter((d) => state.documentsProgress[d.id] === 'ready').length;
  const inProgress = documents.filter((d) => state.documentsProgress[d.id] === 'in_progress').length;
  return { ready, inProgress, total };
}

/** Exercises for the user's gender with at least one logged result. */
export function fitnessStats(state: UserState) {
  const gender = state.profile?.gender ?? 'male';
  const ids = Array.from(
    new Set(fitnessNormSets.flatMap((s) => s.exercises.filter((e) => e.gender === gender).map((e) => e.id))),
  );
  const logged = ids.filter((id) => state.fitnessResults.some((r) => r.exerciseId === id)).length;
  return { logged, total: ids.length };
}

/**
 * "My Path" stages. Readiness is derived from actual user state —
 * no hard-coded percentages and no admission prediction.
 */
export function buildPath(state: UserState): PathStage[] {
  const vvk = vvkStats(state);
  const docs = documentStats(state);
  const fit = fitnessStats(state);
  const academyLink = state.selectedAcademy ? `/academies/${state.selectedAcademy}` : '/academies';

  return [
    {
      id: 'account',
      title: 'Account created',
      description: 'Register and complete your applicant profile.',
      done: Boolean(state.profile),
      link: '/profile',
      linkLabel: 'Profile',
    },
    {
      id: 'academy',
      title: 'Academy selected',
      description: 'Choose a U.S. service academy or ROTC path.',
      done: Boolean(state.selectedAcademy),
      link: '/academies',
      linkLabel: state.selectedAcademy ? 'Change' : 'Select',
    },
    {
      id: 'specialty',
      title: 'Program selected',
      description: 'Review the academy’s academic programs and confirm your choice.',
      done: Boolean(state.selectedSpecialty),
      link: `${academyLink}/specialties`,
      linkLabel: state.selectedSpecialty ? 'Change' : 'Select',
    },
    {
      id: 'requirements',
      title: 'Eligibility reviewed',
      description: 'Medical screening, documents, fitness test and selection steps.',
      done: state.myPathProgress.requirementsViewed,
      link: '/requirements',
      linkLabel: 'Open',
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Track each item. The stage completes when every item is ready.',
      done: docs.total > 0 && docs.ready === docs.total,
      partial: docs.total ? docs.ready / docs.total : 0,
      partialLabel: `${docs.ready} of ${docs.total} ready`,
      link: '/documents',
      linkLabel: 'Checklist',
    },
    {
      id: 'vvk',
      title: 'Medical exam',
      description: 'Prepare for the DoDMERB / entrance medical exam. Tick every item or mark the exam as passed.',
      done: Boolean(state.myPathProgress.manual.vvkPassed) || (vvk.total > 0 && vvk.done === vvk.total),
      partial: vvk.total ? vvk.done / vvk.total : 0,
      partialLabel: `${vvk.done} of ${vvk.total} items`,
      link: '/vvk',
      linkLabel: 'Checklist',
      manual: 'vvkPassed',
    },
    {
      id: 'fitness',
      title: 'Fitness test',
      description: 'Log a result for every exercise in the Candidate Fitness Assessment.',
      done: fit.total > 0 && fit.logged === fit.total,
      partial: fit.total ? fit.logged / fit.total : 0,
      partialLabel: `${fit.logged} of ${fit.total} ${pluralRu(fit.total, ['exercise', 'exercises'])}`,
      link: '/fitness',
      linkLabel: 'Results',
    },
    {
      id: 'competition',
      title: 'Selection board',
      description: 'Nomination, board review and academic evaluation. Mark the stage when it is complete.',
      done: Boolean(state.myPathProgress.manual.competition),
      link: '/requirements',
      linkLabel: 'About',
      manual: 'competition',
    },
    {
      id: 'enrollment',
      title: 'Appointment',
      description: 'Official appointment decisions come from the academy — mark this only after the official result.',
      done: Boolean(state.myPathProgress.manual.enrollment),
      link: '/news',
      linkLabel: 'Updates',
      manual: 'enrollment',
    },
  ];
}

export function readiness(stages: PathStage[]) {
  const done = stages.filter((s) => s.done).length;
  const total = stages.length;
  return {
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
    next: stages.find((s) => !s.done) ?? null,
  };
}
