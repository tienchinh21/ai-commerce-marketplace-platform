import { cmsPath, coreApi } from '@/shared/api/http-client';
import type {
  AdminUser,
  AdminUserWithPermissions,
  CreatedResourceResponse,
  CreateUserPayload,
  MutationSuccessResponse,
  Permission,
} from './users-permissions.types';

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

export async function createUser(payload: CreateUserPayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/users'), payload);
  return response.data;
}

export async function setUserPermissions(
  userId: string,
  codes: string[],
): Promise<MutationSuccessResponse> {
  const response = await coreApi.put<MutationSuccessResponse>(cmsPath(`/users/${userId}/permissions`), { codes });
  return response.data;
}
