/** Конфигурация из переменных окружения (только публичные значения). */
const env = import.meta.env;

export type AuthMode = 'demo' | 'production';

export const config = {
  authMode: (env.VITE_AUTH_MODE === 'production' ? 'production' : 'demo') as AuthMode,
  apiUrl: (env.VITE_API_URL ?? '').replace(/\/$/, ''),
  googleClientId: env.VITE_GOOGLE_CLIENT_ID ?? '',
  oauthRedirectPath: env.VITE_OAUTH_REDIRECT_PATH || '/auth/callback',
};

/** Google OAuth доступен только при наличии backend и Client ID */
export const isGoogleConfigured = () =>
  config.authMode === 'production' && Boolean(config.apiUrl) && Boolean(config.googleClientId);

export const isDemoMode = () => config.authMode !== 'production' || !config.apiUrl;
