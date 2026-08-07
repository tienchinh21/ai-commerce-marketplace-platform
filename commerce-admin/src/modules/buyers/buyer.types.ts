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
