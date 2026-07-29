import type { ReactNode } from 'react';
import { useAuth } from '../../modules/auth/auth.store';
import type { PermissionCode } from '../../modules/auth/auth.types';

export function PermissionGate({ permission, children }: { permission: PermissionCode | null; children: ReactNode }) {
  const auth = useAuth();

  if (!permission || auth.hasPermission(permission)) {
    return <>{children}</>;
  }

  return null;
}
