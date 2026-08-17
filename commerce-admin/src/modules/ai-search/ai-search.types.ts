export interface SemanticProductSearchFilters {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
}

export interface SemanticProductSearchRequest {
  query: string;
  filters?: SemanticProductSearchFilters;
  limit?: number;
}

export interface SemanticProductSearchItem {
  productId: string;
  title: string;
  slug?: string;
  brand?: string | null;
  category?: string | null;
  seller?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  ratingAvg?: number | null;
  reviewCount?: number | null;
  score: number;
  matchedFields: string[];
  explanation: string;
}

export interface SemanticProductSearchResponse {
  query: string;
  provider: string;
  items: SemanticProductSearchItem[];
}
