/**
 * Helpers for the OAuth return leg. The backend delivers the session token in
 * the query string; we must consume it and remove it from the address bar so it
 * is not left in browser history, copied URLs or Referer headers.
 */

/** Return only the pathname of a callback URL, dropping token/error query data. */
export function callbackPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/** True when a callback URL carries a token in its query string. */
export function hasTokenInQuery(url: string): boolean {
  try {
    return new URL(url).searchParams.has('token');
  } catch {
    return false;
  }
}
