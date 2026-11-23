import type { DocumentCategory, DocumentItem } from '../types';
import { SRC } from './sources';

export const documentCategories: { id: DocumentCategory; title: string }[] = [
  { id: 'main', title: 'Основные документы' },
  { id: 'education', title: 'Документы об образовании' },
  { id: 'family', title: 'Документы семьи' },
  { id: 'references', title: 'Характеристики' },
  { id: 'medical', title: 'Медицинские документы' },
  { id: 'photos', title: 'Фотографии' },
  { id: 'special', title: 'Специальные документы' },
];

export const NEEDS_REVIEW_TEXT = 'Требует уточнения по актуальным требованиям приёмной комиссии';

const review = SRC.none(NEEDS_REVIEW_TEXT);

/**
 * Чеклист документов. Официальный актуальный перечень документов не найден,
 * поэтому количество копий и нотариальное заверение не указываются (null).
 * Позиции без официального подтверждения помечены needs_review.
 */
export const documents: DocumentItem[] = [
  {
    id: 'doc-id',
    category: 'main',
    title: 'Удостоверение личности',
    description: 'Копия удостоверения входит в архивный список ВВК 2025.',
    copies: null,
    notarized: null,
    ...SRC.userArchive2025('Количество копий и заверение — требует уточнения'),
  },
  {
    id: 'doc-qyzmet',
    category: 'main',
    title: 'Заявка в системе Qyzmet-Police.kz',
    description: 'В 2026 году документы кандидатов подавались через систему Qyzmet-Police.kz.',
    copies: null,
    notarized: null,
    ...SRC.mvd2026Digital(),
  },
  {
    id: 'doc-ent',
    category: 'education',
    title: 'Результаты ЕНТ',
    description:
      'По данным Алматинской академии: не менее 50 баллов, при этом не менее 3 баллов по грамотности чтения и математической грамотности и не менее 5 — по остальным предметам.',
    copies: null,
    notarized: null,
    ...SRC.almatyApplicants(),
  },
  {
    id: 'doc-school',
    category: 'education',
    title: 'Документ об образовании',
    description: NEEDS_REVIEW_TEXT,
    copies: null,
    notarized: null,
    ...review,
  },
  { id: 'doc-family', category: 'family', title: 'Документы семьи', description: NEEDS_REVIEW_TEXT, copies: null, notarized: null, ...review },
  { id: 'doc-refs', category: 'references', title: 'Характеристики', description: NEEDS_REVIEW_TEXT, copies: null, notarized: null, ...review },
  {
    id: 'doc-medical',
    category: 'medical',
    title: 'Медицинские документы для ВВК',
    description: 'См. отдельный чеклист ВВК (архивная версия 2025).',
    copies: null,
    notarized: null,
    ...SRC.userArchive2025(),
  },
  {
    id: 'doc-photo',
    category: 'photos',
    title: 'Фотографии',
    description: 'Фото упоминается в архивном списке ВВК 2025. Формат и количество — требует уточнения.',
    copies: null,
    notarized: null,
    ...SRC.userArchive2025(),
  },
  { id: 'doc-special', category: 'special', title: 'Специальные документы', description: NEEDS_REVIEW_TEXT, copies: null, notarized: null, ...review },
];
