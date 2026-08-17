import { Inject, Injectable } from '@nestjs/common';
import { EMBEDDING_PROVIDER, EmbeddingProvider } from '../providers/embedding-provider.interface';
import { CHAT_PROVIDER, ChatProvider } from '../providers/chat-provider.interface';
import { VectorStoreService } from '../vector-store/vector-store.service';
import {
  SemanticProductSearchItemDto,
  SemanticProductSearchRequestDto,
  SemanticProductSearchResponseDto,
} from './semantic-search.dto';

function detectMatchedFields(query: string, metadata: Record<string, unknown>): string[] {
  const queryLower = query.toLowerCase();
  return ['title', 'brand', 'category', 'seller'].filter((field) => {
    const val = String(metadata[field] ?? '').toLowerCase();
    return val
      .split(/\s+/)
      .some((token) => token.length > 1 && queryLower.includes(token));
  });
}

@Injectable()
export class SemanticSearchService {
  constructor(
    @Inject(EMBEDDING_PROVIDER)
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStoreService,
    @Inject(CHAT_PROVIDER)
    private readonly chatProvider: ChatProvider,
  ) {}

  async searchProducts(
    request: SemanticProductSearchRequestDto,
  ): Promise<SemanticProductSearchResponseDto> {
    const limit = Math.min(Math.max(request.limit ?? 10, 1), 50);
    const embedding = await this.embeddingProvider.embed({ text: request.query });
    const results = await this.vectorStore.searchProducts({
      embedding: embedding.vector,
      limit,
      filters: request.filters,
    });

    const items: SemanticProductSearchItemDto[] = await Promise.all(
      results.map(async (result) => {
        const metadata = result.metadata;
        const matchedFields = detectMatchedFields(request.query, metadata);
        const title = String(metadata.title ?? '');
        const explanation = await this.chatProvider.explainProductMatch({
          query: request.query,
          productTitle: title,
          matchedFields,
          score: result.score,
        });

        return {
          productId: result.productId,
          title,
          slug: metadata.slug ? String(metadata.slug) : undefined,
          brand: metadata.brand ? String(metadata.brand) : null,
          category: metadata.category ? String(metadata.category) : null,
          seller: metadata.seller ? String(metadata.seller) : null,
          priceMin: metadata.priceMin !== undefined ? Number(metadata.priceMin) : null,
          priceMax: metadata.priceMax !== undefined ? Number(metadata.priceMax) : null,
          ratingAvg: metadata.ratingAvg !== undefined ? Number(metadata.ratingAvg) : null,
          reviewCount: metadata.reviewCount !== undefined ? Number(metadata.reviewCount) : null,
          score: Number(result.score.toFixed(4)),
          matchedFields,
          explanation,
        };
      }),
    );

    return {
      query: request.query,
      provider: embedding.model,
      items,
    };
  }
}
