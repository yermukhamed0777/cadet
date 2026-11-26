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
 * Authentication service.
 * demo       — accounts live on this device; only a salted PBKDF2 hash is stored.
 * production — all operations go through the backend (/auth/*), which issues the token/cookie.
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
    if (all[normalized]) throw new AuthError('An account with this email already exists. Sign in.');
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
      throw new AuthError('Incorrect email or password.');
    }
    return this.persist({ user: acc.user, token: randomId(), isDemo: true });
  },

  /** Start Google OAuth by redirecting to the backend, which holds the Client Secret. */
  startGoogleLogin() {
    if (!isGoogleConfigured()) throw new AuthError('Google sign-in is not configured.');
    const redirect = `${window.location.origin}${config.oauthRedirectPath}`;
    window.location.assign(`${config.apiUrl}/auth/google?redirect_uri=${encodeURIComponent(redirect)}`);
  },

  /** Handle the return from the backend after OAuth: ?token=... */
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
        /* still end the local session */
      }
    }
    setApiToken(null);
    storage.remove(SESSION_KEY);
  },

  /**
   * Demo only: remove the signed-in account and all of its local data.
   * Production accounts must be deleted by the backend; this client does not
   * pretend to have that capability.
   */
  async deleteAccount() {
    const s = storage.get<Session>(SESSION_KEY);
    if (!s) throw new AuthError('Sign in before deleting an account.');
    if (!s.isDemo)
      throw new AuthError(
        'Account deletion requires the backend. Ask the site owner to remove your account.',
      );
    const all = accounts();
    delete all[s.user.email];
    storage.set(ACCOUNTS_KEY, all);
    storage.remove(`user:${s.user.id}:state`);
    storage.remove(`user:${s.user.id}:support`);
    setApiToken(null);
    storage.remove(SESSION_KEY);
  },

  persist(session: Session): Session {
    storage.set(SESSION_KEY, session);
    setApiToken(session.isDemo ? null : session.token);
    return session;
  },
};
