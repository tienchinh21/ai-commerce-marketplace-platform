export type PermissionCode =
  | 'product:read'
  | 'product:write'
  | 'review:read'
  | 'review:moderate'
  | 'seller:read'
  | 'seller:write'
  | 'buyer:read'
  | 'buyer:write'
  | 'category:read'
  | 'category:write'
  | 'source:read'
  | 'source:write'
  | 'source:sync'
  | 'ai:search'
  | 'ai:review:analyze'
  | 'ai:analyst:chat';

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  permissions: PermissionCode[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
