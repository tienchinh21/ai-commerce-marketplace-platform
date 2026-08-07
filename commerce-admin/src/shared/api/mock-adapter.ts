import { coreApi } from './http-client';

function normalizeMockPath(url: string | undefined) {
  if (!url) return url;
  return url.startsWith('/cms/') ? url.slice('/cms'.length) : url;
}

export function installMockApi() {
  coreApi.interceptors.request.use((config) => config);
  coreApi.interceptors.response.use(undefined, async (error) => {
    const url = normalizeMockPath(error.config?.url);
    const method = error.config?.method;

    if (method === 'post' && url === '/auth/login') {
      return {
        data: {
          success: true,
          message: 'Đăng nhập thành công.',
          accessToken: 'mock-admin-access-token',
          refreshToken: 'mock-admin-refresh-token',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      };
    }

    if (method === 'get' && url === '/auth/me') {
      return {
        data: {
          id: 'd13e4e29-431f-4a9d-acbc-62c29a2f4645',
          email: 'admin@example.com',
          displayName: 'Admin',
          permissions: [
            'ai:analyst:chat',
            'ai:review:analyze',
            'ai:search',
            'buyer:read',
            'buyer:write',
            'category:read',
            'category:write',
            'product:read',
            'product:write',
            'review:moderate',
            'review:read',
            'seller:read',
            'seller:write',
            'source:read',
            'source:sync',
            'source:write',
          ],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      };
    }

    if (method === 'post' && url === '/auth/logout') {
      return {
        data: {
          success: true,
          message: 'Đăng xuất thành công.',
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: error.config,
      };
    }

    if (method === 'post' && url === '/auth/refresh') {
      return {
        data: {
          accessToken: 'mock-new-access-token',
          refreshToken: 'mock-new-refresh-token',
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: error.config,
      };
    }

    if (method === 'get' && url === '/categories') {
      return {
        data: [
          {
            id: 'cat-1',
            parentId: null,
            name: 'Electronics',
            slug: 'electronics',
            path: 'electronics',
            level: 1,
            status: 'ACTIVE',
          },
          {
            id: 'cat-2',
            parentId: null,
            name: 'Fashion',
            slug: 'fashion',
            path: 'fashion',
            level: 1,
            status: 'ACTIVE',
          },
          {
            id: 'cat-3',
            parentId: null,
            name: 'Beauty',
            slug: 'beauty',
            path: 'beauty',
            level: 1,
            status: 'ACTIVE',
          },
        ],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config,
      };
    }

    return Promise.reject(error);
  });
}
