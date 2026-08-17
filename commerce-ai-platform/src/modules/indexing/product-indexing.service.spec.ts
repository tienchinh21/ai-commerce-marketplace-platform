import { ProductIndexingService } from './product-indexing.service';
import { CoreDataService } from '../core-data/core-data.service';
import { EmbeddingProvider } from '../providers/embedding-provider.interface';
import { VectorStoreService } from '../vector-store/vector-store.service';

describe('ProductIndexingService', () => {
  let service: ProductIndexingService;
  let coreData: Partial<CoreDataService>;
  let embeddingProvider: Partial<EmbeddingProvider>;
  let vectorStore: Partial<VectorStoreService>;

  beforeEach(() => {
    coreData = {
      listActiveProducts: jest.fn().mockResolvedValue([
        {
          id: 'product-1',
          title: 'Kem chống nắng SPF50+',
          slug: 'kem-chong-nang',
          brand: 'Anessa',
          description: 'Phù hợp da dầu',
          status: 'ACTIVE',
          priceMin: 200000,
          priceMax: 300000,
          ratingAvg: 4.8,
          reviewCount: 20,
          categoryName: 'Mỹ phẩm',
          categoryPath: 'my-pham',
          sellerName: 'Shop Chính Hãng',
          specsJson: {},
        },
      ]),
    };
    embeddingProvider = {
      embed: jest.fn().mockResolvedValue({
        vector: [0.1, 0.2, 0.3],
        model: 'local-hash-embedding-v1',
        dimension: 3,
      }),
    };
    vectorStore = {
      upsertProductEmbedding: jest.fn().mockResolvedValue(undefined),
    };

    service = new ProductIndexingService(
      coreData as CoreDataService,
      embeddingProvider as EmbeddingProvider,
      vectorStore as VectorStoreService,
    );
  });

  it('indexes active products idempotently by product id', async () => {
    const result = await service.runAll();

    expect(result.totalProducts).toBe(1);
    expect(result.indexedCount).toBe(1);
    expect(vectorStore.upsertProductEmbedding).toHaveBeenCalledWith(
      expect.objectContaining({ productId: 'product-1' }),
    );
  });
});
