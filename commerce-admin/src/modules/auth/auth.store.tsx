import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { setAuthToken } from '@/shared/api/http-client';
import type { CurrentUser, PermissionCode } from './auth.types';

interface AuthState {
  user: CurrentUser | null;
  token: string | null;
  setSession: (token: string, user: CurrentUser) => void;
  clearSession: () => void;
  hasPermission: (permission: PermissionCode) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<CurrentUser | null>(null);

  const value = useMemo<AuthState>(() => ({
    user,
    token,
    setSession(nextToken, nextUser) {
      localStorage.setItem('accessToken', nextToken);
      setAuthToken(nextToken);
      setToken(nextToken);
      setUser(nextUser);
    },
    clearSession() {
      localStorage.removeItem('accessToken');
      setAuthToken(null);
      setToken(null);
      setUser(null);
    },
    hasPermission(permission) {
      return user?.permissions.includes(permission) ?? false;
    },
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
