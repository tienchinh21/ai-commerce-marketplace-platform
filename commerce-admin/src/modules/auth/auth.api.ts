import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { CurrentUser, LoginResponse, LogoutResponse, RefreshTokenResponse } from './auth.types';

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await coreApi.post<LoginResponse>(cmsPath('/auth/login'), { email, password });
  return response.data;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await coreApi.get<CurrentUser>(cmsPath('/auth/me'));
  return response.data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await coreApi.post<LogoutResponse>(cmsPath('/auth/logout'));
  return response.data;
}

export async function refreshAuthToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await coreApi.post<RefreshTokenResponse>(cmsPath('/auth/refresh'), { refreshToken });
  return response.data;
}
