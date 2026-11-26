import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { ErrorState, LoadingState } from '../components/ui';
import { callbackPath } from '../utils/oauth';

/** Return from the backend after Google OAuth: /auth/callback?token=... */
export function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get('token');
    const err = params.get('error');
    // Consume the token and scrub it from the address bar. Preserve the
    // router's own history state object while changing only the URL.
    if (token || err) {
      window.history.replaceState(window.history.state, '', callbackPath(window.location.href));
    }
    if (err || !token) {
      setError(err ? `Google: ${err}` : 'No authorization token received.');
      return;
    }
    authService
      .completeOAuth(token)
      .then((s) => {
        setSession(s);
        navigate('/', { replace: true });
      })
      .catch((e: Error) => setError(e.message));
  }, [params, navigate, setSession]);

  if (error)
    return (
      <div id="main-content" tabIndex={-1} className="mx-auto max-w-md p-6">
        <ErrorState text={error} />
        <Link to="/login" className="mt-4 block text-center font-semibold text-navy">
          Back to sign in
        </Link>
      </div>
    );
  return <LoadingState text="Completing Google sign-in…" />;
}
