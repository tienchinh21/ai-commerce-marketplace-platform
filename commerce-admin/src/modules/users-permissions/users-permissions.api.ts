import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { AdminUser, AdminUserWithPermissions, Permission } from './users-permissions.types';

export async function fetchUsers(): Promise<AdminUser[]> {
  const response = await coreApi.get<AdminUser[]>(cmsPath('/users'));
  return response.data;
}

export async function fetchPermissions(): Promise<Permission[]> {
  const response = await coreApi.get<Permission[]>(cmsPath('/permissions'));
  return response.data;
}

export async function fetchUserPermissions(userId: string): Promise<string[]> {
  const response = await coreApi.get<string[]>(cmsPath(`/users/${userId}/permissions`));
  return response.data;
}

export async function fetchUsersWithPermissions(): Promise<AdminUserWithPermissions[]> {
  const users = await fetchUsers();
  const permissionsByUser = await Promise.all(users.map((user) => fetchUserPermissions(user.id)));
  return users.map((user, index) => ({
    ...user,
    permissions: permissionsByUser[index] ?? [],
  }));
}
