import { academies } from '../data/academies';
import { specialties } from '../data/specialties';
import type {
  AcademyId,
  DocStatus,
  FitnessResult,
  Gender,
  ManualStageId,
  NotificationItem,
  NotificationSettings,
  Profile,
  UserState,
} from '../types';
import { emptyUserState } from '../services/profileService';

export const BACKUP_SCHEMA = 1;
export const BACKUP_APP = 'cadet';

export interface BackupFile {
  schema: number;
  app: string;
  exportedAt: string;
  state: UserState;
}

export type ParseBackupResult =
  | { ok: true; state: UserState }
  | { ok: false; error: string };

const ACADEMY_IDS = new Set<string>(academies.map((a) => a.id));
const SPECIALTY_IDS = new Set<string>(specialties.map((s) => s.id));
const DOC_STATUSES: DocStatus[] = ['not_ready', 'in_progress', 'ready'];
const MANUAL_IDS: ManualStageId[] = ['competition', 'enrollment', 'vvkPassed'];
const TOPICS = ['vvk', 'fitness', 'documents', 'news', 'system'];
const GENDERS: Gender[] = ['male', 'female'];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isBoolRecord = (v: unknown): v is Record<string, boolean> =>
  isRecord(v) && Object.values(v).every((x) => typeof x === 'boolean');

function readProfile(value: unknown): Profile | null {
  if (value === null) return null;
  if (!isRecord(value)) throw new Error('profile is malformed');
  const { lastName, firstName, middleName, birthDate, city, gender } = value;
  if (![lastName, firstName, middleName, birthDate, city].every(isStr)) {
    throw new Error('profile fields must be strings');
  }
  if (!GENDERS.includes(gender as Gender)) throw new Error('profile gender is invalid');
  return {
    lastName: lastName as string,
    firstName: firstName as string,
    middleName: middleName as string,
    birthDate: birthDate as string,
    city: city as string,
    gender: gender as Gender,
  };
}

function readDocProgress(value: unknown): Record<string, DocStatus> {
  if (!isRecord(value)) throw new Error('documentsProgress is malformed');
  const out: Record<string, DocStatus> = {};
  for (const [id, status] of Object.entries(value)) {
    if (!DOC_STATUSES.includes(status as DocStatus)) throw new Error(`invalid status for ${id}`);
    out[id] = status as DocStatus;
  }
  return out;
}

function readBoolMap(value: unknown): Record<string, boolean> {
  if (!isBoolRecord(value)) throw new Error('expected a map of booleans');
  return { ...value };
}

function readFitnessResults(value: unknown): FitnessResult[] {
  if (!Array.isArray(value)) throw new Error('fitnessResults is malformed');
  return value.map((raw) => {
    if (!isRecord(raw)) throw new Error('fitness result is malformed');
    const { id, exerciseId, normSetId, value: v, date, createdAt } = raw;
    if (![id, exerciseId, normSetId, date, createdAt].every(isStr) || typeof v !== 'number' || !Number.isFinite(v)) {
      throw new Error('fitness result has invalid fields');
    }
    return { id, exerciseId, normSetId, value: v, date, createdAt } as FitnessResult;
  });
}

function readNotifications(value: unknown): NotificationItem[] {
  if (!Array.isArray(value)) throw new Error('notifications is malformed');
  return value.map((raw) => {
    if (!isRecord(raw)) throw new Error('notification is malformed');
    const { id, title, body, date, link, topic, read } = raw;
    if (![id, title, body, date, link].every(isStr) || typeof read !== 'boolean' || !TOPICS.includes(topic as string)) {
      throw new Error('notification has invalid fields');
    }
    return { id, title, body, date, link, read, topic } as NotificationItem;
  });
}

function readNotificationSettings(value: unknown): NotificationSettings {
  if (!isRecord(value)) throw new Error('notificationSettings is malformed');
  const out = {} as NotificationSettings;
  for (const key of ['vvk', 'fitness', 'documents', 'news'] as const) {
    if (typeof value[key] !== 'boolean') throw new Error(`notification setting ${key} is invalid`);
    out[key] = value[key] as boolean;
  }
  return out;
}

/** Validate and sanitise imported data into a complete UserState. */
export function parseBackup(text: string): ParseBackupResult {
  try {
    const parsed: unknown = JSON.parse(text);
    if (!isRecord(parsed)) return { ok: false, error: 'Backup must be a JSON object.' };
    if (parsed.schema !== BACKUP_SCHEMA) return { ok: false, error: 'Unsupported backup version.' };
    if (parsed.app !== BACKUP_APP) return { ok: false, error: 'This is not a CADET backup.' };
    if (!isStr(parsed.exportedAt) || Number.isNaN(Date.parse(parsed.exportedAt))) {
      return { ok: false, error: 'Backup has no valid export date.' };
    }
    const raw = parsed.state;
    if (!isRecord(raw)) return { ok: false, error: 'Backup has no state object.' };

    const defaultState = emptyUserState();
    const selectedAcademy =
      raw.selectedAcademy === null || ACADEMY_IDS.has(raw.selectedAcademy as string)
        ? (raw.selectedAcademy as AcademyId | null)
        : null;
    const selectedSpecialty =
      raw.selectedSpecialty === null || SPECIALTY_IDS.has(raw.selectedSpecialty as string)
        ? (raw.selectedSpecialty as string | null)
        : null;
    const compare = Array.isArray(raw.compare)
      ? raw.compare.filter((id): id is AcademyId => ACADEMY_IDS.has(id as string)).slice(0, 3)
      : [];
    const path = isRecord(raw.myPathProgress) ? raw.myPathProgress : {};
    const manualRaw = isRecord(path.manual) ? path.manual : {};
    const manual: Partial<Record<ManualStageId, boolean>> = {};
    for (const id of MANUAL_IDS) if (typeof manualRaw[id] === 'boolean') manual[id] = manualRaw[id] as boolean;

    const state: UserState = {
      profile: readProfile(raw.profile ?? null),
      selectedAcademy,
      selectedSpecialty,
      documentsProgress: readDocProgress(raw.documentsProgress ?? {}),
      vvkProgress: readBoolMap(raw.vvkProgress ?? {}),
      fitnessResults: readFitnessResults(raw.fitnessResults ?? []),
      myPathProgress: {
        requirementsViewed: typeof path.requirementsViewed === 'boolean' ? path.requirementsViewed : false,
        manual,
      },
      notifications: readNotifications(raw.notifications ?? defaultState.notifications),
      notificationSettings: readNotificationSettings(raw.notificationSettings ?? defaultState.notificationSettings),
      compare,
    };
    return { ok: true, state };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Backup could not be read.' };
  }
}

/** Produce a human-readable, versioned backup file. */
export function createBackup(state: UserState, now: () => string = () => new Date().toISOString()): string {
  const file: BackupFile = {
    schema: BACKUP_SCHEMA,
    app: BACKUP_APP,
    exportedAt: now(),
    state,
  };
  return JSON.stringify(file, null, 2);
}
