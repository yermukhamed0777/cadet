// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { webcrypto } from 'node:crypto';

type AuthService = typeof import('../../src/services/authService').authService;
type Store = typeof import('../../src/services/storageService').storage;
type ProfileService = typeof import('../../src/services/profileService').profileService;

let auth: AuthService;
let storage: Store;
let profile: ProfileService;
let support: typeof import('../../src/services/profileService').supportService;

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
  vi.stubEnv('VITE_AUTH_MODE', 'demo');
  vi.stubEnv('VITE_API_URL', '');
  vi.stubGlobal('crypto', webcrypto);
  ({ storage } = await import('../../src/services/storageService'));
  ({ authService: auth } = await import('../../src/services/authService'));
  ({ profileService: profile, supportService: support } = await import('../../src/services/profileService'));
});

describe('storage service', () => {
  it('namespaces keys and round-trips JSON values', () => {
    storage.set('probe', { a: 1 });
    expect(localStorage.getItem('cadet:probe')).toBe('{"a":1}');
    expect(storage.get('probe')).toEqual({ a: 1 });
    storage.remove('probe');
    expect(localStorage.getItem('cadet:probe')).toBeNull();
    expect(storage.get('probe')).toBeNull();
  });

  it('falls back to memory when localStorage throws', () => {
    const getSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const setSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    storage.set('memory-only', { ok: true });
    expect(storage.get('memory-only')).toEqual({ ok: true });
    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  it('treats corrupted JSON as absent rather than throwing', () => {
    localStorage.setItem('cadet:broken', '{');
    expect(storage.get('broken')).toBeNull();
  });
});

describe('demo authentication', () => {
  it('stores only a salted PBKDF2 hash, never the password', async () => {
    const session = await auth.register('  Cadet@Example.COM ', 'cadet2026');
    expect(session.user.email).toBe('cadet@example.com');
    const accounts = storage.get<Record<string, { salt: string; hash: string }>>('demo:accounts')!;
    const stored = accounts['cadet@example.com'];
    expect(stored.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(stored.salt).toMatch(/^[0-9a-f]{32}$/);
    expect(JSON.stringify(accounts)).not.toContain('cadet2026');
  });

  it('rejects a duplicate email and a wrong password', async () => {
    await auth.register('cadet@example.com', 'cadet2026');
    await expect(auth.register('cadet@example.com', 'other1234')).rejects.toThrow('already exists');
    await expect(auth.login('cadet@example.com', 'wrong1234')).rejects.toThrow('Incorrect email or password.');
    await expect(auth.login('missing@example.com', 'cadet2026')).rejects.toThrow('Incorrect email or password.');
  });

  it('restores the session on reload and clears it on logout', async () => {
    const first = await auth.register('cadet@example.com', 'cadet2026');
    vi.resetModules();
    ({ authService: auth } = await import('../../src/services/authService'));
    expect(auth.getSession()?.user.id).toBe(first.user.id);
    await auth.logout();
    expect(auth.getSession()).toBeNull();
  });
});

describe('demo user state and support messages', () => {
  it('isolates state per user id and fills missing defaults', async () => {
    const a = await auth.register('a@example.com', 'cadet2026');
    const b = await auth.register('b@example.com', 'cadet2026');
    const state = await profile.load(a.user.id);
    expect(state.profile).toBeNull();
    expect(state.notificationSettings).toEqual({ vvk: true, fitness: true, documents: true, news: true });
    await profile.save(a.user.id, { ...state, selectedAcademy: 'westpoint' });
    expect((await profile.load(a.user.id)).selectedAcademy).toBe('westpoint');
    expect((await profile.load(b.user.id)).selectedAcademy).toBeNull();
  });

  it('keeps support messages local and labelled as demo', async () => {
    const s = await auth.register('cadet@example.com', 'cadet2026');
    const msg = await support.send(s.user.id, 'Question', 'No backend is connected here.');
    expect(msg.delivery).toBe('local_demo');
    expect(support.list(s.user.id)).toHaveLength(1);
    expect(support.list('other-user')).toHaveLength(0);
  });
});
