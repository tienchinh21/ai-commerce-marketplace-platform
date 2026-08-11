export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserWithPermissions extends AdminUser {
  permissions: string[];
}

export interface Permission {
  id: string;
  code: string;
  description: string | null;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  displayName: string;
  status?: string;
  permissionCodes?: string[];
}

export interface CreatedResourceResponse {
  success: true;
  id: string;
  message: string;
}

export interface MutationSuccessResponse {
  success: true;
  message: string;
}
