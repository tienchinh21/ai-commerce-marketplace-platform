import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
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

function getInitialUser(): CurrentUser | null {
  try {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem('refreshToken'));
  const [user, setUser] = useState<CurrentUser | null>(getInitialUser);

  const clearSession = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    setAuthToken(null);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const setSession = useCallback((nextToken: string, userOrRefreshToken: CurrentUser | string, maybeUser?: CurrentUser) => {
    localStorage.setItem('accessToken', nextToken);
    setAuthToken(nextToken);
    setToken(nextToken);

    if (typeof userOrRefreshToken === 'string') {
      localStorage.setItem('refreshToken', userOrRefreshToken);
      setRefreshToken(userOrRefreshToken);

      if (maybeUser) {
        localStorage.setItem('currentUser', JSON.stringify(maybeUser));
        setUser(maybeUser);
      } else {
        fetchCurrentUser()
          .then((u) => {
            localStorage.setItem('currentUser', JSON.stringify(u));
            setUser(u);
          })
          .catch(() => {});
      }
    } else {
      localStorage.setItem('currentUser', JSON.stringify(userOrRefreshToken));
      setUser(userOrRefreshToken);
    }
  }, []);

  // Rehydrate auth header and sync current user profile on app startup / reload
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAuthToken(storedToken);
      fetchCurrentUser()
        .then((u) => {
          localStorage.setItem('currentUser', JSON.stringify(u));
          setUser(u);
        })
        .catch((err: any) => {
          if (err.response?.status === 401) {
            clearSession();
          }
        });
    }
  }, [clearSession]);

  const hasPermission = useCallback((permission: PermissionCode) => {
    return user?.permissions?.includes(permission) ?? false;
  }, [user]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      refreshToken,
      setSession,
      clearSession,
      hasPermission,
    }),
    [user, token, refreshToken, setSession, clearSession, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
