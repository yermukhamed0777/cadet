/**
 * Абстракция key-value хранилища. Frontend не зависит от конкретной
 * реализации: в demo — localStorage (с резервом в памяти), в production
 * пользовательские данные идут через API (см. profileService).
 */
export interface KeyValueStore {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

const PREFIX = 'bk:';

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
      /* хранилище недоступно — остаётся копия в памяти */
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
