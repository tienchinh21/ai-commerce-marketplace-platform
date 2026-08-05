import { cmsPath, coreApi } from '../../shared/api/http-client';
import type { CurrentUser, LoginResponse } from './auth.types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await coreApi.post<LoginResponse>(cmsPath('/auth/login'), { email, password });
  return response.data;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await coreApi.get<CurrentUser>(cmsPath('/auth/me'));
  return response.data;
}
