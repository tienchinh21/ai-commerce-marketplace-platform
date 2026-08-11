export interface Seller {
  id: string;
  userId: string | null;
  name: string;
  slug: string;
  status: string;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SellerListParams {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface SellerPayload {
  name: string;
  slug?: string;
  status?: string;
  userId?: string | null;
  metadataJson?: Record<string, unknown>;
}

export type UpdateSellerPayload = Partial<SellerPayload>;

export interface CreatedResourceResponse {
  success: true;
  id: string;
  message: string;
}

export interface MutationSuccessResponse {
  success: true;
  message: string;
}
