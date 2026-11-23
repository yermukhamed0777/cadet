/// <reference types="vite/client" />
declare const __ROUTER_MODE__: 'hash' | 'browser';

interface ImportMetaEnv {
  readonly VITE_AUTH_MODE?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_OAUTH_REDIRECT_PATH?: string;
}
