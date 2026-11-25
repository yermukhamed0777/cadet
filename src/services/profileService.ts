import type { SupportMessage, UserState } from '../types';
import { api } from './apiClient';
import { isDemoMode } from './config';
import { storage } from './storageService';
import { initialNotifications } from '../data/notifications';
import { randomId } from '../utils/crypto';

export const emptyUserState = (): UserState => ({
  profile: null,
  selectedAcademy: null,
  selectedSpecialty: null,
  documentsProgress: {},
  vvkProgress: {},
  fitnessResults: [],
  myPathProgress: { requirementsViewed: false, manual: {} },
  notifications: initialNotifications(),
  notificationSettings: { vvk: true, fitness: true, documents: true, news: true },
  compare: [],
});

const key = (userId: string) => `user:${userId}:state`;

/**
 * User state storage.
 * demo — local on the device; production — GET/PUT /me/state on the backend.
 */
export const profileService = {
  async load(userId: string): Promise<UserState> {
    if (!isDemoMode()) {
      const remote = await api<Partial<UserState> | null>('/me/state');
      return { ...emptyUserState(), ...(remote ?? {}) };
    }
    const saved = storage.get<Partial<UserState>>(key(userId));
    return { ...emptyUserState(), ...(saved ?? {}) };
  },

  async save(userId: string, state: UserState): Promise<void> {
    if (!isDemoMode()) {
      await api('/me/state', { method: 'PUT', body: JSON.stringify(state) });
      return;
    }
    storage.set(key(userId), state);
  },
};

export const supportService = {
  async send(userId: string, subject: string, message: string): Promise<SupportMessage> {
    const base = { id: randomId(), subject, message, createdAt: new Date().toISOString() };
    if (!isDemoMode()) {
      await api('/support/messages', { method: 'POST', body: JSON.stringify({ subject, message }) });
      return { ...base, delivery: 'sent' };
    }
    const k = `user:${userId}:support`;
    const list = storage.get<SupportMessage[]>(k) ?? [];
    const item: SupportMessage = { ...base, delivery: 'local_demo' };
    storage.set(k, [item, ...list]);
    return item;
  },
  list(userId: string): SupportMessage[] {
    return storage.get<SupportMessage[]>(`user:${userId}:support`) ?? [];
  },
};
