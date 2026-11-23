import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { Session } from '../types';

interface AuthContextValue {
  session: Session | null;
  ready: boolean;
  register: (email: string, password: string) => Promise<Session>;
  login: (email: string, password: string) => Promise<Session>;
  logout: () => Promise<void>;
  setSession: (s: Session) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(authService.getSession());
    setReady(true);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const s = await authService.register(email, password);
    setSession(s);
    return s;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const s = await authService.login(email, password);
    setSession(s);
    return s;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, ready, register, login, logout, setSession }),
    [session, ready, register, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
