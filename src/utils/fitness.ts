import type { FitnessExercise, FitnessGrade } from '../types';

export const gradeLabels: Record<FitnessGrade, string> = {
  excellent: 'Отлично',
  good: 'Хорошо',
  satisfactory: 'Удовлетворительно',
  below: 'Ниже норматива',
};

/** Сравнение результата с нормативом. Не является медицинской оценкой. */
export function gradeResult(ex: FitnessExercise, value: number): FitnessGrade {
  const better = (a: number, b: number) => (ex.lowerIsBetter ? a <= b : a >= b);
  if (better(value, ex.excellent)) return 'excellent';
  if (better(value, ex.good)) return 'good';
  if (better(value, ex.satisfactory)) return 'satisfactory';
  return 'below';
}

export function formatValue(ex: FitnessExercise, v: number): string {
  if (ex.unit === 'reps') return `${v} раз`;
  if (ex.unit === 'sec') return `${v.toFixed(1).replace('.', ',')} сек`;
  const m = Math.floor(v / 60);
  const s = Math.round(v - m * 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Разбор ввода: "14.2" / "14,2" сек, "3:45" мин:сек, "12" раз. null — неверный ввод */
export function parseInput(ex: FitnessExercise, raw: string): number | null {
  const s = raw.trim().replace(',', '.');
  if (!s) return null;
  if (ex.unit === 'min_sec') {
    const m = s.match(/^(\d{1,2})[:.](\d{1,2})$/);
    if (!m) return null;
    const sec = Number(m[2]);
    if (sec >= 60) return null;
    return Number(m[1]) * 60 + sec;
  }
  if (ex.unit === 'reps') {
    if (!/^\d{1,3}$/.test(s)) return null;
    return Number(s);
  }
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(s)) return null;
  const v = Number(s);
  return v > 5 && v < 60 ? v : null;
}

/** Доля до «удовлетворительно»→«отлично» для шкалы прогресса, 0..1 */
export function progressToExcellent(ex: FitnessExercise, v: number): number {
  const start = ex.lowerIsBetter ? ex.satisfactory * 1.15 : ex.satisfactory * 0.5;
  const span = ex.excellent - start;
  const p = (v - start) / span;
  return Math.max(0, Math.min(1, p));
}
