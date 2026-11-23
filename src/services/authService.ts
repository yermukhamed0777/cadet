import type { Session, User } from '../types';
import { api, setApiToken } from './apiClient';
import { config, isDemoMode, isGoogleConfigured } from './config';
import { storage } from './storageService';
import { hashPassword, randomId, verifyPassword } from '../utils/crypto';

interface DemoAccount {
  user: User;
  salt: string;
  hash: string;
}

const ACCOUNTS_KEY = 'demo:accounts';
const SESSION_KEY = 'session';

export class AuthError extends Error {}

const accounts = () => storage.get<Record<string, DemoAccount>>(ACCOUNTS_KEY) ?? {};

/**
 * Сервис авторизации.
 * demo       — аккаунты на этом устройстве, пароль хранится только как PBKDF2-хэш с солью.
 * production — все операции через backend (/auth/*), токен/куки выдаёт сервер.
 */
export const authService = {
  isDemo: isDemoMode,

  getSession(): Session | null {
    const s = storage.get<Session>(SESSION_KEY);
    if (s) setApiToken(s.isDemo ? null : s.token);
    return s;
  },

  async register(email: string, password: string): Promise<Session> {
    const normalized = email.trim().toLowerCase();
    if (!isDemoMode()) {
      const s = await api<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: normalized, password }),
      });
      return this.persist({ ...s, isDemo: false });
    }
    const all = accounts();
    if (all[normalized]) throw new AuthError('Аккаунт с таким email уже существует. Войдите.');
    const { salt, hash } = await hashPassword(password);
    const user: User = { id: randomId(), email: normalized, provider: 'demo', createdAt: new Date().toISOString() };
    storage.set(ACCOUNTS_KEY, { ...all, [normalized]: { user, salt, hash } });
    return this.persist({ user, token: randomId(), isDemo: true });
  },

  async login(email: string, password: string): Promise<Session> {
    const normalized = email.trim().toLowerCase();
    if (!isDemoMode()) {
      const s = await api<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: normalized, password }),
      });
      return this.persist({ ...s, isDemo: false });
    }
    const acc = accounts()[normalized];
    if (!acc || !(await verifyPassword(password, acc.salt, acc.hash))) {
      throw new AuthError('Неверный email или пароль.');
    }
    return this.persist({ user: acc.user, token: randomId(), isDemo: true });
  },

  /** Запуск Google OAuth: переход на backend, который хранит Client Secret. */
  startGoogleLogin() {
    if (!isGoogleConfigured()) throw new AuthError('Вход через Google не настроен.');
    const redirect = `${window.location.origin}${config.oauthRedirectPath}`;
    window.location.assign(`${config.apiUrl}/auth/google?redirect_uri=${encodeURIComponent(redirect)}`);
  },

  /** Обработка возврата с backend после OAuth: ?token=... */
  async completeOAuth(token: string): Promise<Session> {
    setApiToken(token);
    const user = await api<User>('/auth/me');
    return this.persist({ user, token, isDemo: false });
  },

  async logout() {
    const s = storage.get<Session>(SESSION_KEY);
    if (s && !s.isDemo) {
      try {
        await api('/auth/logout', { method: 'POST' });
      } catch {
        /* всё равно завершаем локальную сессию */
      }
    }
    setApiToken(null);
    storage.remove(SESSION_KEY);
  },

  persist(session: Session): Session {
    storage.set(SESSION_KEY, session);
    setApiToken(session.isDemo ? null : session.token);
    return session;
  },
};
