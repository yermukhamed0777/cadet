import { config } from './config';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

let authToken: string | null = null;
export const setApiToken = (t: string | null) => {
  authToken = t;
};

/** Thin fetch wrapper for the production backend */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!config.apiUrl) throw new ApiError(0, 'Backend is not configured (VITE_API_URL).');
  const res = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    let msg = `Server error (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, msg);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}
