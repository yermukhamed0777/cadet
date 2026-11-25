/**
 * Key-value storage abstraction. The frontend does not depend on the concrete
 * implementation: in demo, localStorage (with an in-memory fallback); in
 * production, user data goes through the API (see profileService).
 */
export interface KeyValueStore {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

const PREFIX = 'cadet:';

class BrowserStore implements KeyValueStore {
  private memory = new Map<string, string>();

  get<T>(key: string): T | null {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(PREFIX + key);
    } catch {
      raw = this.memory.get(key) ?? null;
    }
    if (raw == null) raw = this.memory.get(key) ?? null;
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    const raw = JSON.stringify(value);
    this.memory.set(key, raw);
    try {
      window.localStorage.setItem(PREFIX + key, raw);
    } catch {
      /* storage unavailable — the in-memory copy remains */
    }
  }

  remove(key: string): void {
    this.memory.delete(key);
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  }
}

export const storage: KeyValueStore = new BrowserStore();
