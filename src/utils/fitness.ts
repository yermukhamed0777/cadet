import type { FitnessExercise, FitnessGrade } from '../types';

export const gradeLabels: Record<FitnessGrade, string> = {
  excellent: 'Excellent',
  good: 'Good',
  satisfactory: 'Satisfactory',
  below: 'Below standard',
};

/** Compare a result with the reference value. This is not a medical assessment. */
export function gradeResult(ex: FitnessExercise, value: number): FitnessGrade {
  if (ex.referenceOnly) return value >= ex.excellent ? 'excellent' : 'below';
  const better = (a: number, b: number) => (ex.lowerIsBetter ? a <= b : a >= b);
  if (better(value, ex.excellent)) return 'excellent';
  if (better(value, ex.good)) return 'good';
  if (better(value, ex.satisfactory)) return 'satisfactory';
  return 'below';
}

export function formatValue(ex: FitnessExercise, v: number): string {
  if (ex.unit === 'reps') return `${v} reps`;
  if (ex.unit === 'ft') return `${Math.round(v)} ft`;
  if (ex.unit === 'sec') return `${v.toFixed(1)} sec`;
  const m = Math.floor(v / 60);
  const s = Math.round(v - m * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Parse "14.2" (sec), "3:45" (min:sec), "12" (reps), "85" (ft). */
export function parseInput(ex: FitnessExercise, raw: string): number | null {
  const s = raw.trim().replace(',', '.');
  if (!s) return null;
  if (ex.unit === 'min_sec') {
    const m = s.match(/^(\d{1,2}):(\d{1,2})$/);
    if (!m) return null;
    const sec = Number(m[2]);
    if (sec >= 60) return null;
    return Number(m[1]) * 60 + sec;
  }
  if (ex.unit === 'reps' || ex.unit === 'ft') {
    if (!/^\d{1,3}$/.test(s)) return null;
    return Number(s);
  }
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(s)) return null;
  const v = Number(s);
  return v > 0 && v < 60 ? v : null;
}

/** Progress toward the reference value for the on-screen scale, 0..1. */
export function progressToExcellent(ex: FitnessExercise, v: number): number {
  if (ex.referenceOnly) return Math.max(0, Math.min(1, v / ex.excellent));
  const start = ex.lowerIsBetter ? ex.satisfactory * 1.15 : ex.satisfactory * 0.5;
  const span = ex.excellent - start;
  if (span <= 0) return 0;
  const p = (v - start) / span;
  return Math.max(0, Math.min(1, p));
}
