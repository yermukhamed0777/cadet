import { describe, expect, it } from 'vitest';
import { buildPath, documentStats, fitnessStats, readiness, vvkStats } from '../../src/utils/progress';
import { documents } from '../../src/data/documents';
import { fitnessNormSets } from '../../src/data/fitness';
import { vvkChecklist } from '../../src/data/vvk';
import type { FitnessResult, UserState } from '../../src/types';
import { makeState } from '../helpers/state';

const asReady = (): Record<string, 'ready'> =>
  Object.fromEntries(documents.map((d) => [d.id, 'ready' as const]));

const allVvk = (): Record<string, boolean> =>
  Object.fromEntries(vvkChecklist.map((i) => [i.id, true]));

const allFitness = (): FitnessResult[] => {
  const ids = Array.from(
    new Set(fitnessNormSets.flatMap((s) => s.exercises.filter((e) => e.gender === 'male').map((e) => e.id))),
  );
  return ids.map((exerciseId) => ({
    id: exerciseId,
    exerciseId,
    normSetId: 'cfa-maximum',
    value: 1,
    date: '2026-01-01',
    createdAt: '2026-01-01T00:00:00.000Z',
  }));
};

describe('progress is derived from user state', () => {
  it('starts at zero with an empty state', () => {
    const r = readiness(buildPath(makeState()));
    expect(r.done).toBe(0);
    expect(r.total).toBe(9);
    expect(r.percent).toBe(0);
    expect(r.next?.id).toBe('account');
  });

  it('counts documents, medical and fitness from the actual catalogs', () => {
    const state = makeState({
      documentsProgress: Object.fromEntries(documents.map((d, i) => [d.id, i === 0 ? 'ready' : 'not_ready'])),
      vvkProgress: { [vvkChecklist[0].id]: true },
      fitnessResults: allFitness().slice(0, 2),
    });
    expect(documentStats(state)).toEqual({ ready: 1, inProgress: 0, total: documents.length });
    expect(vvkStats(state)).toEqual({ done: 1, total: vvkChecklist.length });
    expect(fitnessStats(state)).toEqual({ logged: 2, total: 12 });
  });

  it('completes stages only at 100 percent and exposes partial progress', () => {
    const partial = makeState({
      documentsProgress: Object.fromEntries(documents.map((d, i) => [d.id, i === 0 ? 'ready' : 'not_ready'])),
    });
    const path = buildPath(partial);
    const docs = path.find((s) => s.id === 'documents')!;
    expect(docs.done).toBe(false);
    expect(docs.partial).toBe(1 / documents.length);

    const complete = makeState({ documentsProgress: asReady() });
    expect(buildPath(complete).find((s) => s.id === 'documents')!.done).toBe(true);
  });

  it('honours manual overrides and the requirements-viewed flag', () => {
    const state = makeState({
      myPathProgress: {
        requirementsViewed: true,
        manual: { vvkPassed: true, competition: true, enrollment: true },
      },
    });
    const path = buildPath(state);
    for (const id of ['requirements', 'vvk', 'competition', 'enrollment'] as const) {
      expect(path.find((s) => s.id === id)!.done).toBe(true);
    }
  });

  it('reaches 100 percent only when every stage is satisfied', () => {
    const state: UserState = makeState({
      profile: {
        lastName: 'Doe',
        firstName: 'Jane',
        middleName: '',
        birthDate: '2008-05-01',
        city: 'Boston',
        gender: 'female',
      },
      selectedAcademy: 'westpoint',
      selectedSpecialty: 'westpoint-majors',
      documentsProgress: asReady(),
      vvkProgress: allVvk(),
      fitnessResults: allFitness().filter((r) => {
        const ex = fitnessNormSets.flatMap((s) => s.exercises).find((e) => e.id === r.exerciseId);
        return ex?.gender === 'male';
      }),
      myPathProgress: {
        requirementsViewed: true,
        manual: { vvkPassed: true, competition: true, enrollment: true },
      },
    });
    // The default profile is female; use a female result set for a clean 100%.
    const femaleIds = Array.from(
      new Set(fitnessNormSets.flatMap((s) => s.exercises.filter((e) => e.gender === 'female').map((e) => e.id))),
    );
    const femaleState = {
      ...state,
      profile: { ...state.profile!, gender: 'female' as const },
      fitnessResults: femaleIds.map((exerciseId) => ({ ...allFitness()[0], exerciseId })),
    };
    const r = readiness(buildPath(femaleState));
    expect(r).toMatchObject({ done: 9, total: 9, percent: 100 });
    expect(r.next).toBeNull();
  });
});
