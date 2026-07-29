import axios from 'axios';
import { env } from '../config/env';

export const coreApi = axios.create({ baseURL: env.coreApiBaseUrl });
export const aiApi = axios.create({ baseURL: env.aiApiBaseUrl });

export function setAuthToken(token: string | null) {
  for (const client of [coreApi, aiApi]) {
    if (token) {
      client.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  }
}
