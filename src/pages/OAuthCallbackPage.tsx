import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { ErrorState, LoadingState } from '../components/ui';

/** Return from the backend after Google OAuth: /auth/callback?token=... */
export function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get('token');
    const err = params.get('error');
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
      <div className="mx-auto max-w-md p-6">
        <ErrorState text={error} />
        <Link to="/login" className="mt-4 block text-center font-semibold text-navy">
          Back to sign in
        </Link>
      </div>
    );
  return <LoadingState text="Completing Google sign-in…" />;
}
