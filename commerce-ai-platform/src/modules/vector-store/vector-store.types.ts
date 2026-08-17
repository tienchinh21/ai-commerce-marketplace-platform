export interface UpsertProductEmbeddingInput {
  productId: string;
  sourceText: string;
  sourceTextHash: string;
  embedding: number[];
  embeddingModel: string;
  embeddingVersion: string;
  metadata: Record<string, unknown>;
}

export interface SearchProductEmbeddingsInput {
  embedding: number[];
  limit: number;
  filters?: {
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    ratingMin?: number;
  };
}

export interface ProductEmbeddingSearchResult {
  productId: string;
  score: number;
  sourceText: string;
  metadata: Record<string, unknown>;
}
