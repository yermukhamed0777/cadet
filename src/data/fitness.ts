import type { FitnessExercise, FitnessNormSet } from '../types';
import { SRC, URLS } from './sources';

/** Time in seconds: 5:20 → 320 */
const mmss = (m: number, s: number) => m * 60 + s;

const refExercise = (
  id: string,
  gender: FitnessExercise['gender'],
  title: string,
  unit: FitnessExercise['unit'],
  lowerIsBetter: boolean,
  value: number,
): FitnessExercise => ({
  id,
  gender,
  title,
  unit,
  lowerIsBetter,
  excellent: value,
  good: value,
  satisfactory: value,
  referenceOnly: true,
});

/**
 * Official CFA pages publish maximum scores or published averages — not passing
 * thresholds. Every exercise is therefore marked referenceOnly and the UI shows
 * a single reference column instead of pretending to grade the candidate.
 */
export const fitnessNormSets: FitnessNormSet[] = [
  {
    id: 'cfa-maximum',
    title: 'CFA maximum scores — West Point & Annapolis',
    ...SRC.westpoint('Page shows no entry cycle; these are maximum scores, not passing standards'),
    sourceUrl: URLS.westpointCfa,
    exercises: [
      refExercise('max-basketball-m', 'male', 'Basketball throw', 'ft', false, 105),
      refExercise('max-pullup-m', 'male', 'Cadence pull-ups', 'reps', false, 18),
      refExercise('max-shuttle-m', 'male', '40-yard shuttle', 'sec', true, 7.8),
      refExercise('max-situp-m', 'male', 'Modified sit-ups', 'reps', false, 95),
      refExercise('max-pushup-m', 'male', 'Push-ups', 'reps', false, 75),
      refExercise('max-mile-m', 'male', '1-mile run', 'min_sec', true, mmss(5, 20)),
      refExercise('max-basketball-f', 'female', 'Basketball throw', 'ft', false, 68),
      refExercise('max-hang-f', 'female', 'Flexed-arm hang', 'sec', false, 7),
      refExercise('max-shuttle-f', 'female', '40-yard shuttle', 'sec', true, 8.6),
      refExercise('max-situp-f', 'female', 'Modified sit-ups', 'reps', false, 95),
      refExercise('max-pushup-f', 'female', 'Push-ups', 'reps', false, 50),
      refExercise('max-mile-f', 'female', '1-mile run', 'min_sec', true, mmss(6, 0)),
    ],
  },
  {
    id: 'cfa-averages',
    title: 'CFA published averages — Air Force',
    ...SRC.colorado('Published averages, not minimum passing standards; page shows no entry cycle'),
    sourceUrl: URLS.coloradoRequirements,
    exercises: [
      refExercise('avg-basketball-m', 'male', 'Basketball throw', 'ft', false, 69),
      refExercise('avg-pullup-m', 'male', 'Pull-ups', 'reps', false, 12),
      refExercise('avg-shuttle-m', 'male', '40-yard shuttle', 'sec', true, 8.1),
      refExercise('avg-situp-m', 'male', 'Sit-ups', 'reps', false, 81),
      refExercise('avg-pushup-m', 'male', 'Push-ups', 'reps', false, 62),
      refExercise('avg-mile-m', 'male', '1-mile run', 'min_sec', true, mmss(6, 29)),
      refExercise('avg-basketball-f', 'female', 'Basketball throw', 'ft', false, 42),
      refExercise('avg-pullup-f', 'female', 'Pull-ups', 'reps', false, 2),
      refExercise('avg-shuttle-f', 'female', '40-yard shuttle', 'sec', true, 9.4),
      refExercise('avg-situp-f', 'female', 'Sit-ups', 'reps', false, 78),
      refExercise('avg-pushup-f', 'female', 'Push-ups', 'reps', false, 41),
      refExercise('avg-mile-f', 'female', '1-mile run', 'min_sec', true, mmss(7, 30)),
    ],
  },
];

export const fitnessCycleNote = {
  text: 'The Candidate Fitness Assessment is required by the service academies. Published figures are maximum scores or averages — confirm current standards with the admissions office.',
  ...SRC.westpoint('CFA event list and reference scores'),
  sourceUrl: URLS.westpointCfa,
};
