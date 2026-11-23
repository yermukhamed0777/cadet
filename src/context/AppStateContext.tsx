import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { emptyUserState, profileService } from '../services/profileService';
import type {
  AcademyId,
  DocStatus,
  FitnessResult,
  ManualStageId,
  NotificationSettings,
  Profile,
  UserState,
} from '../types';
import { academyService } from '../services/academyService';
import { randomId } from '../utils/crypto';

type Status = 'loading' | 'ready' | 'error';

interface AppStateValue {
  state: UserState;
  status: Status;
  error: string | null;
  saveError: string | null;
  reload: () => void;
  saveProfile: (p: Profile) => void;
  selectAcademy: (id: AcademyId) => void;
  selectSpecialty: (id: string | null) => void;
  setDocStatus: (id: string, s: DocStatus) => void;
  toggleVvk: (id: string) => void;
  addFitnessResult: (r: Omit<FitnessResult, 'id' | 'createdAt'>) => void;
  removeFitnessResult: (id: string) => void;
  markRequirementsViewed: () => void;
  setManualStage: (id: ManualStageId, v: boolean) => void;
  markNotificationRead: (id: string, read?: boolean) => void;
  markAllNotificationsRead: () => void;
  setNotificationSettings: (s: NotificationSettings) => void;
  toggleCompare: (id: AcademyId) => boolean;
  clearCompare: () => void;
}

export const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const userId = auth?.session?.user.id ?? null;
  const [state, setState] = useState<UserState>(emptyUserState);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const loadedFor = useRef<string | null>(null);
  const [loadedUser, setLoadedUser] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      loadedFor.current = null;
      setLoadedUser(null);
      setState(emptyUserState());
      setStatus('ready');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    setError(null);
    profileService
      .load(userId)
      .then((s) => {
        if (cancelled) return;
        setState(s);
        loadedFor.current = userId;
        setLoadedUser(userId);
        setStatus('ready');
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message || 'Не удалось загрузить данные');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [userId, nonce]);

  // Сохранение при каждом изменении состояния (после загрузки)
  useEffect(() => {
    if (!userId || loadedFor.current !== userId || status !== 'ready') return;
    profileService
      .save(userId, state)
      .then(() => setSaveError(null))
      .catch((e: Error) => setSaveError(e.message || 'Не удалось сохранить изменения'));
  }, [state, userId, status]);

  const update = useCallback((fn: (s: UserState) => UserState) => setState((s) => fn(s)), []);

  // Пока данные текущего пользователя не загружены — всегда 'loading' (защита от гонки при старте)
  const effectiveStatus: Status = userId && loadedUser !== userId && status !== 'error' ? 'loading' : status;

  const value = useMemo<AppStateValue>(
    () => ({
      state,
      status: effectiveStatus,
      error,
      saveError,
      reload: () => setNonce((n) => n + 1),
      saveProfile: (p) => update((s) => ({ ...s, profile: p })),
      selectAcademy: (id) =>
        update((s) => {
          const spec = academyService.specialty(s.selectedSpecialty);
          return { ...s, selectedAcademy: id, selectedSpecialty: spec && spec.academyId === id ? s.selectedSpecialty : null };
        }),
      selectSpecialty: (id) =>
        update((s) => {
          const spec = academyService.specialty(id);
          return { ...s, selectedSpecialty: id, selectedAcademy: spec ? spec.academyId : s.selectedAcademy };
        }),
      setDocStatus: (id, st) => update((s) => ({ ...s, documentsProgress: { ...s.documentsProgress, [id]: st } })),
      toggleVvk: (id) => update((s) => ({ ...s, vvkProgress: { ...s.vvkProgress, [id]: !s.vvkProgress[id] } })),
      addFitnessResult: (r) =>
        update((s) => ({
          ...s,
          fitnessResults: [{ ...r, id: randomId(), createdAt: new Date().toISOString() }, ...s.fitnessResults],
        })),
      removeFitnessResult: (id) => update((s) => ({ ...s, fitnessResults: s.fitnessResults.filter((r) => r.id !== id) })),
      markRequirementsViewed: () =>
        update((s) =>
          s.myPathProgress.requirementsViewed ? s : { ...s, myPathProgress: { ...s.myPathProgress, requirementsViewed: true } },
        ),
      setManualStage: (id, v) =>
        update((s) => ({ ...s, myPathProgress: { ...s.myPathProgress, manual: { ...s.myPathProgress.manual, [id]: v } } })),
      markNotificationRead: (id, read = true) =>
        update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read } : n)) })),
      markAllNotificationsRead: () => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      setNotificationSettings: (ns) => update((s) => ({ ...s, notificationSettings: ns })),
      toggleCompare: (id) => {
        if (!state.compare.includes(id) && state.compare.length >= 3) return false;
        update((s) =>
          s.compare.includes(id) ? { ...s, compare: s.compare.filter((c) => c !== id) } : { ...s, compare: [...s.compare, id].slice(0, 3) },
        );
        return true;
      },
      clearCompare: () => update((s) => ({ ...s, compare: [] })),
    }),
    [state, effectiveStatus, error, saveError, update],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
