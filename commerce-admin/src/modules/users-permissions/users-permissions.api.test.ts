import { describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import {
  createUser,
  fetchPermissions,
  fetchUserPermissions,
  fetchUsers,
  setUserPermissions,
} from './users-permissions.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('users and permissions API', () => {
  it('fetches users and permissions through CMS endpoints', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: ['product:read'] });

    await expect(fetchUsers()).resolves.toEqual([]);
    await expect(fetchPermissions()).resolves.toEqual([]);
    await expect(fetchUserPermissions('user-id')).resolves.toEqual(['product:read']);
    expect(coreApi.get).toHaveBeenNthCalledWith(1, '/cms/users');
    expect(coreApi.get).toHaveBeenNthCalledWith(2, '/cms/permissions');
    expect(coreApi.get).toHaveBeenNthCalledWith(3, '/cms/users/user-id/permissions');
  });

  it('creates user through the CMS users endpoint', async () => {
    const payload = {
      email: 'admin@example.com',
      password: 'password123',
      displayName: 'Admin',
      permissionCodes: ['product:read'],
    };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'user-id', message: 'Tạo người dùng thành công.' },
    });

    await expect(createUser(payload)).resolves.toEqual({
      success: true,
      id: 'user-id',
      message: 'Tạo người dùng thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/users', payload);
  });

  it('sets user permissions through the CMS permissions endpoint', async () => {
    vi.mocked(coreApi.put).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật quyền người dùng thành công.' },
    });

    await expect(setUserPermissions('user-id', ['product:read'])).resolves.toEqual({
      success: true,
      message: 'Cập nhật quyền người dùng thành công.',
    });
    expect(coreApi.put).toHaveBeenCalledWith('/cms/users/user-id/permissions', {
      codes: ['product:read'],
    });
  });
});
