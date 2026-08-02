import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSourceEntity } from './data-source.entity';
import { SyncRun } from './sync-run.entity';
import { RawSnapshot } from './raw-snapshot.entity';
import { SourceProduct } from './source-product.entity';
import { SourceReview } from './source-review.entity';
import { ProductsService } from '../products/products.service';
import { ReviewsService } from '../reviews/reviews.service';

export interface ImportProductsInput {
  dataSourceId: string;
  items: Array<{
    sourceProductId: string;
    title: string;
    sellerId: string;
    categoryId: string;
    priceMin?: number;
    priceMax?: number;
    brand?: string;
    description?: string;
    specs?: Record<string, unknown>;
  }>;
}

export interface ImportReviewsInput {
  dataSourceId: string;
  items: Array<{
    sourceReviewId: string;
    sourceProductId: string;
    productId: string;
    buyerId?: string;
    sellerId?: string;
    rating: number;
    title?: string;
    content?: string;
  }>;
}

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(DataSourceEntity)
    private readonly dataSources: Repository<DataSourceEntity>,
    @InjectRepository(SyncRun) private readonly syncRuns: Repository<SyncRun>,
    @InjectRepository(RawSnapshot)
    private readonly rawSnapshots: Repository<RawSnapshot>,
    @InjectRepository(SourceProduct)
    private readonly sourceProducts: Repository<SourceProduct>,
    @InjectRepository(SourceReview)
    private readonly sourceReviews: Repository<SourceReview>,
    private readonly productsService: ProductsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async listDataSources(): Promise<DataSourceEntity[]> {
    return this.dataSources.find({ order: { name: 'ASC' } });
  }

  async getDataSource(id: string): Promise<DataSourceEntity> {
    const source = await this.dataSources.findOne({ where: { id } });
    if (!source) {
      throw new NotFoundException('Data source not found');
    }
    return source;
  }

  async createDataSource(
    input: Partial<
      Pick<
        DataSourceEntity,
        'name' | 'type' | 'baseUrl' | 'status' | 'configJson'
      >
    >,
  ): Promise<DataSourceEntity> {
    const source = this.dataSources.create({
      name: input.name ?? '',
      type: input.type ?? 'manual_import',
      baseUrl: input.baseUrl ?? null,
      status: input.status ?? 'ACTIVE',
      configJson: input.configJson ?? {},
    });
    return this.dataSources.save(source);
  }

  async updateDataSource(
    id: string,
    input: Partial<
      Pick<
        DataSourceEntity,
        'name' | 'type' | 'baseUrl' | 'status' | 'configJson'
      >
    >,
  ): Promise<DataSourceEntity> {
    const source = await this.getDataSource(id);
    Object.assign(source, input);
    return this.dataSources.save(source);
  }

  async listSyncRuns(query: {
    dataSourceId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.syncRuns.createQueryBuilder('syncRun');

    if (query.dataSourceId) {
      qb.andWhere('syncRun.dataSourceId = :dataSourceId', {
        dataSourceId: query.dataSourceId,
      });
    }

    const [items, total] = await qb
      .orderBy('syncRun.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }

  async getSyncRun(id: string): Promise<SyncRun> {
    const run = await this.syncRuns.findOne({ where: { id } });
    if (!run) {
      throw new NotFoundException('Sync run not found');
    }
    return run;
  }

  async listRawSnapshots(query: {
    dataSourceId?: string;
    syncRunId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.rawSnapshots.createQueryBuilder('snapshot');

    if (query.dataSourceId) {
      qb.andWhere('snapshot.dataSourceId = :dataSourceId', {
        dataSourceId: query.dataSourceId,
      });
    }
    if (query.syncRunId) {
      qb.andWhere('snapshot.syncRunId = :syncRunId', {
        syncRunId: query.syncRunId,
      });
    }

    const [items, total] = await qb
      .orderBy('snapshot.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }

  async getRawSnapshot(id: string): Promise<RawSnapshot> {
    const snapshot = await this.rawSnapshots.findOne({ where: { id } });
    if (!snapshot) {
      throw new NotFoundException('Raw snapshot not found');
    }
    return snapshot;
  }

  async importProducts(input: ImportProductsInput): Promise<SyncRun> {
    await this.getDataSource(input.dataSourceId);
    const run = await this.startSyncRun(input.dataSourceId, input.items.length);
    const snapshot = await this.saveSnapshot(run);

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of input.items) {
      try {
        const product = await this.productsService.create({
          sellerId: item.sellerId,
          categoryId: item.categoryId,
          title: item.title,
          brand: item.brand ?? null,
          description: item.description ?? null,
          priceMin: item.priceMin ?? 0,
          priceMax: item.priceMax ?? item.priceMin ?? 0,
          specsJson: item.specs ?? {},
        });
        await this.sourceProducts.save(
          this.sourceProducts.create({
            dataSourceId: input.dataSourceId,
            syncRunId: run.id,
            rawSnapshotId: snapshot.id,
            canonicalProductId: product.id,
            sourceProductId: item.sourceProductId,
            rawDataJson: item as unknown as Record<string, unknown>,
            normalizedDataJson: {
              title: item.title,
              brand: item.brand ?? null,
              categoryId: item.categoryId,
              sellerId: item.sellerId,
              priceMin: item.priceMin ?? 0,
              priceMax: item.priceMax ?? item.priceMin ?? 0,
            },
            mappingStatus: 'MAPPED',
          }),
        );
        success += 1;
      } catch (error) {
        failed += 1;
        errors.push(`${item.sourceProductId}: ${String(error)}`);
      }
    }

    return this.finishSyncRun(run, success, failed, errors);
  }

  async importReviews(input: ImportReviewsInput): Promise<SyncRun> {
    await this.getDataSource(input.dataSourceId);
    const run = await this.startSyncRun(input.dataSourceId, input.items.length);
    const snapshot = await this.saveSnapshot(run);

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const item of input.items) {
      try {
        const review = await this.reviewsService.create({
          productId: item.productId,
          buyerId: item.buyerId ?? null,
          sellerId: item.sellerId ?? null,
          rating: item.rating,
          title: item.title ?? null,
          content: item.content ?? null,
          sourceType: 'import',
        });
        await this.sourceReviews.save(
          this.sourceReviews.create({
            dataSourceId: input.dataSourceId,
            syncRunId: run.id,
            rawSnapshotId: snapshot.id,
            canonicalReviewId: review.id,
            sourceReviewId: item.sourceReviewId,
            sourceProductId: item.sourceProductId,
            rawDataJson: item as unknown as Record<string, unknown>,
            normalizedDataJson: {
              productId: item.productId,
              rating: item.rating,
              title: item.title ?? null,
            },
            mappingStatus: 'MAPPED',
          }),
        );
        success += 1;
      } catch (error) {
        failed += 1;
        errors.push(`${item.sourceReviewId}: ${String(error)}`);
      }
    }

    return this.finishSyncRun(run, success, failed, errors);
  }

  private async startSyncRun(
    dataSourceId: string,
    totalRecords: number,
  ): Promise<SyncRun> {
    return this.syncRuns.save(
      this.syncRuns.create({
        dataSourceId,
        status: 'RUNNING',
        startedAt: new Date(),
        totalRecords,
      }),
    );
  }

  private async saveSnapshot(run: SyncRun): Promise<RawSnapshot> {
    return this.rawSnapshots.save(
      this.rawSnapshots.create({
        dataSourceId: run.dataSourceId,
        syncRunId: run.id,
        contentType: 'application/json',
        parseStatus: 'PARSED',
      }),
    );
  }

  private async finishSyncRun(
    run: SyncRun,
    success: number,
    failed: number,
    errors: string[],
  ): Promise<SyncRun> {
    run.status = failed === 0 ? 'COMPLETED' : 'COMPLETED_WITH_ERRORS';
    run.finishedAt = new Date();
    run.successCount = success;
    run.failedCount = failed;
    run.errorSummary =
      errors.length > 0 ? errors.join('\n').slice(0, 2000) : null;
    return this.syncRuns.save(run);
  }
}
