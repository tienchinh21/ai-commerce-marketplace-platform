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
