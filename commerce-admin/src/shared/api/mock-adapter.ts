import { coreApi } from './http-client';

export function installMockApi() {
  coreApi.interceptors.request.use((config) => config);
  coreApi.interceptors.response.use(undefined, async (error) => {
    const url = error.config?.url;
    const method = error.config?.method;

    if (method === 'post' && url === '/auth/login') {
      return {
        data: {
          accessToken: 'mock-admin-token',
          user: {
            id: 'mock-admin',
            email: 'admin@example.com',
            displayName: 'Admin',
            permissions: [
              'category:read',
              'seller:read',
              'buyer:read',
              'product:read',
              'review:read',
              'source:read',
              'ai:search',
              'ai:review:analyze',
              'ai:analyst:chat',
            ],
          },
        },
        status: 200,
        statusText: 'OK',
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
