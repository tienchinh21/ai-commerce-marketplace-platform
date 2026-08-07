import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { setAuthToken } from '@/shared/api/http-client';
import type { CurrentUser, PermissionCode } from './auth.types';
import { fetchCurrentUser } from './auth.api';

interface AuthState {
  user: CurrentUser | null;
  token: string | null;
  refreshToken: string | null;
  setSession: (token: string, userOrRefreshToken: CurrentUser | string, user?: CurrentUser) => void;
  clearSession: () => void;
  hasPermission: (permission: PermissionCode) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState<CurrentUser | null>(null);

  const value = useMemo<AuthState>(() => ({
    user,
    token,
    refreshToken,
    setSession(nextToken, userOrRefreshToken, maybeUser) {
      localStorage.setItem('accessToken', nextToken);
      setAuthToken(nextToken);
      setToken(nextToken);

      if (typeof userOrRefreshToken === 'string') {
        localStorage.setItem('refreshToken', userOrRefreshToken);
        setRefreshToken(userOrRefreshToken);
        if (maybeUser) {
          setUser(maybeUser);
        } else {
          fetchCurrentUser().then(setUser).catch(() => {});
        }
      } else {
        setUser(userOrRefreshToken);
      }
    },
    clearSession() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthToken(null);
      setToken(null);
      setRefreshToken(null);
      setUser(null);
    },
    hasPermission(permission) {
      return user?.permissions.includes(permission) ?? false;
    },
  }), [token, refreshToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
