import { SemanticSearchService } from './semantic-search.service';
import { EmbeddingProvider } from '../providers/embedding-provider.interface';
import { ChatProvider } from '../providers/chat-provider.interface';
import { VectorStoreService } from '../vector-store/vector-store.service';

describe('SemanticSearchService', () => {
  let service: SemanticSearchService;
  let embeddingProvider: Partial<EmbeddingProvider>;
  let vectorStore: Partial<VectorStoreService>;
  let chatProvider: Partial<ChatProvider>;

  beforeEach(() => {
    embeddingProvider = {
      embed: jest.fn().mockResolvedValue({
        vector: [0.1, 0.2, 0.3],
        model: 'local-hash-embedding-v1',
        dimension: 3,
      }),
    };
    vectorStore = {
      searchProducts: jest.fn().mockResolvedValue([
        {
          productId: 'product-1',
          sourceText: 'title: Kem chống nắng SPF50+',
          metadata: {
            title: 'Kem chống nắng SPF50+',
            slug: 'kem-chong-nang',
            brand: 'Anessa',
            category: 'Mỹ phẩm',
            seller: 'Shop A',
            priceMin: 200000,
            priceMax: 300000,
            ratingAvg: 4.8,
            reviewCount: 15,
          },
          score: 0.89,
        },
      ]),
    };
    chatProvider = {
      explainProductMatch: jest.fn().mockResolvedValue('Sản phẩm rất phù hợp với tìm kiếm.'),
    };

    service = new SemanticSearchService(
      embeddingProvider as EmbeddingProvider,
      vectorStore as VectorStoreService,
      chatProvider as ChatProvider,
    );
  });

  it('returns ranked semantic product results with explanations', async () => {
    const result = await service.searchProducts({
      query: 'kem chống nắng cho da dầu',
      limit: 5,
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      productId: 'product-1',
      title: 'Kem chống nắng SPF50+',
    });
    expect(result.items[0].score).toBeGreaterThan(0);
    expect(result.items[0].explanation).toContain('phù hợp');
  });
});
