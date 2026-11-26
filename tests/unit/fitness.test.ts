import { describe, expect, it } from 'vitest';
import { gradeResult, parseInput, progressToExcellent } from '../../src/utils/fitness';
import type { FitnessExercise } from '../../src/types';

const timedReference: FitnessExercise = {
  id: 'max-shuttle-m',
  gender: 'male',
  title: '40-yard shuttle',
  unit: 'sec',
  lowerIsBetter: true,
  excellent: 7.8,
  good: 7.8,
  satisfactory: 7.8,
  referenceOnly: true,
};

const repsReference: FitnessExercise = {
  id: 'max-pullup-m',
  gender: 'male',
  title: 'Cadence pull-ups',
  unit: 'reps',
  lowerIsBetter: false,
  excellent: 18,
  good: 18,
  satisfactory: 18,
  referenceOnly: true,
};

const tiered: FitnessExercise = {
  id: 'tiered',
  gender: 'male',
  title: 'Push-ups',
  unit: 'reps',
  lowerIsBetter: false,
  excellent: 60,
  good: 45,
  satisfactory: 30,
};

describe('CADET-001: reference-only grading respects the direction of the event', () => {
  it('grades a faster-than-reference timed result as excellent, not below', () => {
    expect(gradeResult(timedReference, 7.0)).toBe('excellent');
  });

  it('grades a slower-than-reference timed result as below, not excellent', () => {
    expect(gradeResult(timedReference, 9.0)).toBe('below');
  });

  it('grades a result equal to the reference as excellent', () => {
    expect(gradeResult(timedReference, 7.8)).toBe('excellent');
  });

  it('increases progress as the timed result gets faster', () => {
    expect(progressToExcellent(timedReference, 7.0)).toBeGreaterThan(
      progressToExcellent(timedReference, 9.0),
    );
  });

  it('clamps timed reference progress to 0..1 at both extremes', () => {
    expect(progressToExcellent(timedReference, 3)).toBe(1);
    expect(progressToExcellent(timedReference, 1000)).toBeLessThan(0.01);
    expect(progressToExcellent(timedReference, 1000)).toBeGreaterThanOrEqual(0);
    expect(progressToExcellent(timedReference, 30)).toBeLessThan(0.5);
  });

  it('keeps the original direction for higher-is-better reference events', () => {
    expect(gradeResult(repsReference, 20)).toBe('excellent');
    expect(gradeResult(repsReference, 10)).toBe('below');
    expect(progressToExcellent(repsReference, 20)).toBe(1);
  });

  it('does not change tiered (non reference-only) grading', () => {
    expect(gradeResult(tiered, 61)).toBe('excellent');
    expect(gradeResult(tiered, 50)).toBe('good');
    expect(gradeResult(tiered, 35)).toBe('satisfactory');
    expect(gradeResult(tiered, 12)).toBe('below');
  });
});

describe('input parsing', () => {
  it('parses min:sec, seconds, repetitions and feet', () => {
    expect(parseInput({ ...timedReference, unit: 'min_sec' }, '5:20')).toBe(320);
    expect(parseInput(timedReference, '7.8')).toBe(7.8);
    expect(parseInput(repsReference, '18')).toBe(18);
    expect(parseInput({ ...repsReference, unit: 'ft' }, '105')).toBe(105);
  });

  it('rejects invalid values instead of coercing them', () => {
    expect(parseInput(timedReference, '')).toBeNull();
    expect(parseInput(timedReference, '60')).toBeNull();
    expect(parseInput({ ...timedReference, unit: 'min_sec' }, '5:60')).toBeNull();
    expect(parseInput(repsReference, '-1')).toBeNull();
  });
});
