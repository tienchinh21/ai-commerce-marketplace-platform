import axios from 'axios';
import { env } from '@/shared/config/env';

import { ROUTES } from '@/shared/constants/routes.constants';

export const coreApi = axios.create({ baseURL: env.coreApiBaseUrl });
export const aiApi = axios.create({ baseURL: env.aiApiBaseUrl });

// Interceptor xử lý lỗi chung (Ví dụ: khi token hết hạn -> 401)
for (const client of [coreApi, aiApi]) {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && window.location.pathname !== ROUTES.LOGIN) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        window.location.href = ROUTES.LOGIN;
      }
      return Promise.reject(error);
    }
  );
}

export function setAuthToken(token: string | null) {
  for (const client of [coreApi, aiApi]) {
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  }
}

export const cmsPath = (path: string) =>
  path.startsWith('/') ? `/cms${path}` : `/cms/${path}`;

export const aiPath = (path: string) =>
  path.startsWith('/') ? `/ai${path}` : `/ai/${path}`;
