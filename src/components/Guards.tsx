import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks/useAppState';
import { ErrorState, LoadingState } from './ui';

/** Только для авторизованных. Неавторизованный пользователь уходит на /login */
export function RequireAuth() {
  const { session, ready } = useAuth();
  const { status, error, reload } = useAppState();
  const location = useLocation();
  if (!ready) return <LoadingState />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (status === 'loading') return <LoadingState text="Загружаем ваш профиль…" />;
  if (status === 'error')
    return (
      <div className="p-4">
        <ErrorState text={error ?? 'Ошибка загрузки'} onRetry={reload} />
      </div>
    );
  return <Outlet />;
}

/** Требует заполненного профиля */
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
