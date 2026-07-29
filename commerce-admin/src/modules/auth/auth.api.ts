import { coreApi } from '../../shared/api/http-client';
import type { CurrentUser, LoginResponse } from './auth.types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await coreApi.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await coreApi.get<CurrentUser>('/auth/me');
  return response.data;
}
