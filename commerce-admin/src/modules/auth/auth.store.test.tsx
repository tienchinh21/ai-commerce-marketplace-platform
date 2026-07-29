import { describe, beforeEach, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './auth.store';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthProvider', () => {
  beforeEach(() => localStorage.clear());

  it('stores token and checks permissions', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.setSession('token-1', {
        id: 'u1',
        email: 'admin@example.com',
        displayName: 'Admin',
        permissions: ['product:read'],
      });
    });

    expect(result.current.token).toBe('token-1');
    expect(result.current.hasPermission('product:read')).toBe(true);
    expect(result.current.hasPermission('product:write')).toBe(false);
  });

  it('clears session', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.setSession('token-1', {
        id: 'u1',
        email: 'admin@example.com',
        displayName: 'Admin',
        permissions: ['product:read'],
      });
      result.current.clearSession();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
