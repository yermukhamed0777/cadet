import type { FitnessNormSet } from '../types';
import { SRC } from './sources';

/** Время в секундах: 3:40 → 220 */
const mmss = (m: number, s: number) => m * 60 + s;

export const fitnessNormSets: FitnessNormSet[] = [
  {
    id: 'archive-2025',
    title: 'Нормативы 2025 — архив',
    ...SRC.userArchive2025('Архивная информация — 2025. Не являются подтверждёнными нормативами 2026.'),
    exercises: [
      { id: 'm-100', gender: 'male', title: 'Бег 100 м', unit: 'sec', lowerIsBetter: true, excellent: 14.0, good: 14.5, satisfactory: 15.0 },
      { id: 'm-1000', gender: 'male', title: 'Бег 1000 м', unit: 'min_sec', lowerIsBetter: true, excellent: mmss(3, 40), good: mmss(3, 50), satisfactory: mmss(4, 0) },
      { id: 'm-pullup', gender: 'male', title: 'Подтягивания', unit: 'reps', lowerIsBetter: false, excellent: 11, good: 9, satisfactory: 7 },
      { id: 'f-100', gender: 'female', title: 'Бег 100 м', unit: 'sec', lowerIsBetter: true, excellent: 16.0, good: 16.5, satisfactory: 17.0 },
      { id: 'f-1000', gender: 'female', title: 'Бег 1000 м', unit: 'min_sec', lowerIsBetter: true, excellent: mmss(4, 40), good: mmss(5, 0), satisfactory: mmss(5, 20) },
      { id: 'f-situp', gender: 'female', title: 'Подъём туловища за 1 минуту', unit: 'reps', lowerIsBetter: false, excellent: 35, good: 30, satisfactory: 25 },
    ],
  },
  {
    id: 'almaty-site',
    title: 'Таблица с сайта Алматинской академии',
    ...SRC.almatyApplicants(),
    applicableYear: null,
    status: 'needs_review',
    note: 'Опубликовано на странице «Поступающим» (обновлена 26.02.2026). Год применимости на странице не указан. Значения отличаются от архивных 2025.',
    exercises: [
      { id: 'm-100', gender: 'male', title: 'Бег 100 м', unit: 'sec', lowerIsBetter: true, excellent: 13.2, good: 13.8, satisfactory: 14.4 },
      { id: 'm-1000', gender: 'male', title: 'Бег 1000 м', unit: 'min_sec', lowerIsBetter: true, excellent: mmss(3, 20), good: mmss(3, 30), satisfactory: mmss(3, 45) },
      { id: 'm-pullup', gender: 'male', title: 'Подтягивания', unit: 'reps', lowerIsBetter: false, excellent: 13, good: 11, satisfactory: 9 },
      { id: 'f-100', gender: 'female', title: 'Бег 100 м', unit: 'sec', lowerIsBetter: true, excellent: 15.6, good: 16.2, satisfactory: 16.8 },
      { id: 'f-1000', gender: 'female', title: 'Бег 1000 м', unit: 'min_sec', lowerIsBetter: true, excellent: mmss(4, 20), good: mmss(4, 30), satisfactory: mmss(4, 40) },
      { id: 'f-situp', gender: 'female', title: 'Подъём туловища (1 мин)', unit: 'reps', lowerIsBetter: false, excellent: 30, good: 25, satisfactory: 20 },
    ],
  },
];

export const fitness2026Note = {
  text: 'В 2026 году сдача нормативов по физической подготовке началась 15 июля в территориальных департаментах полиции по месту жительства кандидатов, с видеозаписью и прямой трансляцией.',
  ...SRC.mvd2026Digital(),
};
