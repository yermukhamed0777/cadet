import { describe, expect, it } from 'vitest';
import { callbackPath, hasTokenInQuery } from '../../src/utils/oauth';

describe('CADET-007: OAuth callback URL hygiene', () => {
  it('drops the token and error query from the callback path', () => {
    const url = 'https://app.example.com/auth/callback?token=secret123&state=abc';
    expect(callbackPath(url)).toBe('/auth/callback');
    expect(hasTokenInQuery(url)).toBe(true);
  });

  it('keeps the hash-router pathname intact', () => {
    const url = 'https://app.example.com/cadet/#/auth/callback?token=secret123';
    // In hash mode the token is after the fragment; the pathname is still the
    // base path, so no token is exposed in the network request path either.
    expect(callbackPath(url)).toBe('/cadet/');
    expect(hasTokenInQuery(url)).toBe(false);
  });

  it('does not throw on a malformed URL', () => {
    expect(callbackPath('not a url')).toBe('not a url');
    expect(hasTokenInQuery('not a url')).toBe(false);
  });
});
