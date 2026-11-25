import { useContext, useMemo } from 'react';
import { AppStateContext } from '../context/AppStateContext';
import { buildPath, readiness } from '../utils/progress';

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState outside AppStateProvider');
  return ctx;
}

/** Path stages and readiness derived from the actual state */
export function usePath() {
  const { state } = useAppState();
  return useMemo(() => {
    const stages = buildPath(state);
    return { stages, ...readiness(stages) };
  }, [state]);
}

export function useUnreadCount() {
  const { state } = useAppState();
  return state.notifications.filter((n) => !n.read).length;
}
