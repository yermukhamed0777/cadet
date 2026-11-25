import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks/useAppState';
import { ErrorState, LoadingState } from './ui';

/** Authenticated users only. Unauthenticated users are sent to /login */
export function RequireAuth() {
  const { session, ready } = useAuth();
  const { status, error, reload } = useAppState();
  const location = useLocation();
  if (!ready) return <LoadingState />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (status === 'loading') return <LoadingState text="Loading your profile…" />;
  if (status === 'error')
    return (
      <div className="p-4">
        <ErrorState text={error ?? 'Failed to load'} onRetry={reload} />
      </div>
    );
  return <Outlet />;
}

/** Requires a completed profile */
export function RequireProfile() {
  const { state } = useAppState();
  if (!state.profile) return <Navigate to="/profile/setup" replace />;
  return <Outlet />;
}

export function GuestOnly() {
  const { session, ready } = useAuth();
  if (!ready) return <LoadingState />;
  if (session) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function RootRedirect() {
  const { session, ready } = useAuth();
  const { state, status } = useAppState();
  if (!ready || (session && status === 'loading')) return <LoadingState />;
  if (!session) return <Navigate to="/login" replace />;
  if (!state.profile) return <Navigate to="/profile/setup" replace />;
  if (!state.selectedAcademy) return <Navigate to="/onboarding/academies" replace />;
  return <Navigate to="/home" replace />;
}
