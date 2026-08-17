export interface CoreProductRecord {
  id: string;
  title: string;
  slug: string;
  brand?: string | null;
  description?: string | null;
  status: string;
  priceMin?: number | null;
  priceMax?: number | null;
  ratingAvg?: number | null;
  reviewCount?: number | null;
  categoryName?: string | null;
  categoryPath?: string | null;
  sellerName?: string | null;
  specsJson?: Record<string, unknown> | null;
}

export interface CoreReviewRecord {
  id: string;
  productId: string;
  rating: number;
  title?: string | null;
  content: string;
  status: string;
}
