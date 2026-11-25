// ─── Data verification ───────────────────────────────────────────────
// verified     — confirmed by an official source
// archive      — information from a previous cycle, never presented as current
// needs_review — could not be confirmed; requires manual verification
export type VerificationStatus = 'verified' | 'archive' | 'needs_review';

export interface SourceRef {
  /** Source name, e.g. "U.S. Military Academy — Admissions" */
  source: string;
  sourceUrl: string;
  /** Date of last manual check, ISO (YYYY-MM-DD) */
  checkedAt: string;
  /** Cycle the information applies to; null — no year stated in the source */
  applicableYear: number | null;
  status: VerificationStatus;
  /** Discrepancies and verification limits */
  note?: string;
}

/** A fact with a source. value = null renders as "No confirmed data". */
export interface Fact<T = string> extends SourceRef {
  value: T | null;
}

export type AcademyId = 'westpoint' | 'annapolis' | 'coloradosprings' | 'newlondon' | 'kingspoint';

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
  /** Program code; null — no code given in the source */
  code: string | null;
  level: string;
  duration: string | null;
  qualification: string | null;
  summary: string | null;
  studyAreas: string[];
  careers: string[];
  /** Name differences between sources */
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
  unit: 'sec' | 'min_sec' | 'reps' | 'ft';
  /** true — lower is better (runs) */
  lowerIsBetter: boolean;
  excellent: number;
  good: number;
  satisfactory: number;
  /** Official source publishes one reference value, not tier cutoffs */
  referenceOnly?: boolean;
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

// ─── User ────────────────────────────────────────────────────────────
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
  /** Progress within the stage (for checklists), 0..1 */
  partial?: number;
  partialLabel?: string;
  link: string;
  linkLabel: string;
  manual?: ManualStageId;
}
