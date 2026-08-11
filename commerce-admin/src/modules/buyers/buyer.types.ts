export interface Buyer {
  id: string;
  userId: string | null;
  email: string;
  displayName: string;
  phone: string | null;
  status: string;
  metadataJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerListParams {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface BuyerPayload {
  email: string;
  displayName: string;
  phone?: string | null;
  status?: string;
  userId?: string | null;
  metadataJson?: Record<string, unknown>;
}

export type UpdateBuyerPayload = Partial<BuyerPayload>;

export interface CreatedResourceResponse {
  success: true;
  id: string;
  message: string;
}

export interface MutationSuccessResponse {
  success: true;
  message: string;
}
