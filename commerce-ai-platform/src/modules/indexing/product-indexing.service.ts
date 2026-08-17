import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { CoreDataService, buildProductSourceText } from '../core-data/core-data.service';
import { EMBEDDING_PROVIDER, EmbeddingProvider } from '../providers/embedding-provider.interface';
import { VectorStoreService } from '../vector-store/vector-store.service';
import { ProductIndexingRunResponseDto } from './indexing.dto';

function hashSourceText(sourceText: string): string {
  return createHash('sha256').update(sourceText).digest('hex');
}

@Injectable()
export class ProductIndexingService {
  constructor(
    private readonly coreData: CoreDataService,
    @Inject(EMBEDDING_PROVIDER)
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStoreService,
  ) {}

  async runAll(): Promise<ProductIndexingRunResponseDto> {
    const runId = randomUUID();
    const products = await this.coreData.listActiveProducts();
    let indexedCount = 0;
    let failedCount = 0;

    for (const product of products) {
      try {
        const sourceText = buildProductSourceText(product);
        const embedding = await this.embeddingProvider.embed({ text: sourceText });
        await this.vectorStore.upsertProductEmbedding({
          productId: product.id,
          sourceText,
          sourceTextHash: hashSourceText(sourceText),
          embedding: embedding.vector,
          embeddingModel: embedding.model,
          embeddingVersion: 'v1',
          metadata: {
            title: product.title,
            slug: product.slug,
            brand: product.brand,
            category: product.categoryName,
            categoryPath: product.categoryPath,
            seller: product.sellerName,
            priceMin: product.priceMin,
            priceMax: product.priceMax,
            ratingAvg: product.ratingAvg,
            reviewCount: product.reviewCount,
          },
        });
        indexedCount++;
      } catch (err) {
        failedCount++;
      }
    }

    return {
      success: failedCount === 0,
      runId,
      status: failedCount === 0 ? 'COMPLETED' : 'FAILED',
      totalProducts: products.length,
      indexedCount,
      skippedCount: 0,
      failedCount,
      message: `Đã hoàn tất index ${indexedCount}/${products.length} sản phẩm.`,
    };
  }

  async runOne(productId: string): Promise<ProductIndexingRunResponseDto> {
    const runId = randomUUID();
    const product = await this.coreData.getProductById(productId);
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID: ${productId}`);
    }

    const sourceText = buildProductSourceText(product);
    const embedding = await this.embeddingProvider.embed({ text: sourceText });
    await this.vectorStore.upsertProductEmbedding({
      productId: product.id,
      sourceText,
      sourceTextHash: hashSourceText(sourceText),
      embedding: embedding.vector,
      embeddingModel: embedding.model,
      embeddingVersion: 'v1',
      metadata: {
        title: product.title,
        slug: product.slug,
        brand: product.brand,
        category: product.categoryName,
        categoryPath: product.categoryPath,
        seller: product.sellerName,
        priceMin: product.priceMin,
        priceMax: product.priceMax,
        ratingAvg: product.ratingAvg,
        reviewCount: product.reviewCount,
      },
    });

    return {
      success: true,
      runId,
      status: 'COMPLETED',
      totalProducts: 1,
      indexedCount: 1,
      skippedCount: 0,
      failedCount: 0,
      message: `Đã index thành công sản phẩm: ${product.title}`,
    };
  }
}
