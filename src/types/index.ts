// ─── Верификация данных ─────────────────────────────────────────────
// verified     — подтверждено официальным источником
// archive      — архивная информация (прошлый год), не выдаётся за актуальную
// needs_review — не удалось подтвердить, требует уточнения
export type VerificationStatus = 'verified' | 'archive' | 'needs_review';

export interface SourceRef {
  /** Название источника, например «Официальный сайт Алматинской академии МВД РК» */
  source: string;
  sourceUrl: string;
  /** Дата проверки, ISO (YYYY-MM-DD) */
  checkedAt: string;
  /** Год, к которому относится информация; null — год в источнике не указан */
  applicableYear: number | null;
  status: VerificationStatus;
  /** Пояснение: расхождения, ограничения проверки */
  note?: string;
}

/** Значение-факт с источником. value = null → «Нет подтверждённых данных» */
export interface Fact<T = string> extends SourceRef {
  value: T | null;
}

export type AcademyId = 'almaty' | 'karaganda' | 'kostanay' | 'aktobe';

export interface Contact {
  label: string;
  value: string;
  kind: 'phone' | 'email' | 'web';
  ref: SourceRef;
}

export interface Academy {
  id: AcademyId;
  title: string;
  shortTitle: string;
  nameNote?: string;
  city: string;
  website: string;
  address: Fact;
  founded: Fact;
  history: Fact;
  directions: Fact<string[]>;
  studyConditions: Fact;
  dormitory: Fact;
  meals: Fact;
  stipend: Fact;
  employment: Fact;
  contacts: Contact[];
  nameRef: SourceRef;
}

export interface Specialty extends SourceRef {
  id: string;
  academyId: AcademyId;
  title: string;
  /** Код программы; null — код в источнике не указан */
  code: string | null;
  level: string;
  duration: string | null;
  qualification: string | null;
  summary: string | null;
  studyAreas: string[];
  careers: string[];
  /** Расхождения названий между источниками */
  discrepancy?: string;
}

export interface ChecklistItem extends SourceRef {
  id: string;
  title: string;
  description: string;
  details?: string;
  appliesTo?: 'female' | 'male';
}

export type DocStatus = 'not_ready' | 'in_progress' | 'ready';

export interface DocumentItem extends SourceRef {
  id: string;
  category: DocumentCategory;
  title: string;
  description: string;
  copies: string | null;
  notarized: string | null;
}

export type DocumentCategory =
  | 'main'
  | 'education'
  | 'family'
  | 'references'
  | 'medical'
  | 'photos'
  | 'special';

export type Gender = 'male' | 'female';

export type FitnessGrade = 'excellent' | 'good' | 'satisfactory' | 'below';

export interface FitnessExercise {
  id: string;
  gender: Gender;
  title: string;
  unit: 'sec' | 'min_sec' | 'reps';
  /** true — меньше = лучше (бег) */
  lowerIsBetter: boolean;
  excellent: number;
  good: number;
  satisfactory: number;
}

export interface FitnessNormSet extends SourceRef {
  id: string;
  title: string;
  exercises: FitnessExercise[];
}

export interface FitnessResult {
  id: string;
  exerciseId: string;
  normSetId: string;
  value: number;
  date: string;
  createdAt: string;
}

export interface NewsItem extends SourceRef {
  id: string;
  title: string;
  date: string;
  summary: string;
  publisher: string;
  secondaryUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  link?: { to: string; label: string };
}

export interface VvkLocation extends SourceRef {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
}

// ─── Пользователь ──────────────────────────────────────────────────
export type AuthProvider = 'demo' | 'google' | 'backend';

export interface User {
  id: string;
  email: string;
  provider: AuthProvider;
  createdAt: string;
}

export interface Session {
  user: User;
  token: string;
  isDemo: boolean;
}

export interface Profile {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  city: string;
  gender: Gender;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  link: string;
  topic: 'vvk' | 'fitness' | 'documents' | 'news' | 'system';
}

export interface NotificationSettings {
  vvk: boolean;
  fitness: boolean;
  documents: boolean;
  news: boolean;
}

export type ManualStageId = 'competition' | 'enrollment' | 'vvkPassed';

export interface UserState {
  profile: Profile | null;
  selectedAcademy: AcademyId | null;
  selectedSpecialty: string | null;
  documentsProgress: Record<string, DocStatus>;
  vvkProgress: Record<string, boolean>;
  fitnessResults: FitnessResult[];
  myPathProgress: {
    requirementsViewed: boolean;
    manual: Partial<Record<ManualStageId, boolean>>;
  };
  notifications: NotificationItem[];
  notificationSettings: NotificationSettings;
  compare: AcademyId[];
}

export interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  createdAt: string;
  delivery: 'local_demo' | 'sent';
}

export type PathStageId =
  | 'account'
  | 'academy'
  | 'specialty'
  | 'requirements'
  | 'documents'
  | 'vvk'
  | 'fitness'
  | 'competition'
  | 'enrollment';

export interface PathStage {
  id: PathStageId;
  title: string;
  description: string;
  done: boolean;
  /** Прогресс внутри этапа (для чеклистов), 0..1 */
  partial?: number;
  partialLabel?: string;
  link: string;
  linkLabel: string;
  manual?: ManualStageId;
}
