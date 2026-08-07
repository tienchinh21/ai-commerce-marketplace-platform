export interface Review {
  id: string;
  productId: string;
  buyerId: string | null;
  sellerId: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  status: string;
  sourceType: string;
  sourceReviewId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListParams {
  productId?: string;
  buyerId?: string;
  sellerId?: string;
  status?: string;
  minRating?: number;
  page?: number;
  pageSize?: number;
}
