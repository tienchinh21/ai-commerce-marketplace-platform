import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { DataSourceEntity } from './data-source.entity';
import { SyncRun } from './sync-run.entity';
import { RawSnapshot } from './raw-snapshot.entity';
import { SourceProduct } from './source-product.entity';
import { SourceReview } from './source-review.entity';
import { ProductsService } from '../products/products.service';
import { ReviewsService } from '../reviews/reviews.service';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

describe('IngestionService', () => {
  let service: IngestionService;

  const dataSources = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const syncRuns = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const rawSnapshots = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const sourceProducts = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const sourceReviews = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const productsService = {
    create: jest.fn(),
  };
  const reviewsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(DataSourceEntity),
          useValue: dataSources,
        },
        { provide: getRepositoryToken(SyncRun), useValue: syncRuns },
        {
          provide: getRepositoryToken(RawSnapshot),
          useValue: rawSnapshots,
        },
        {
          provide: getRepositoryToken(SourceProduct),
          useValue: sourceProducts,
        },
        {
          provide: getRepositoryToken(SourceReview),
          useValue: sourceReviews,
        },
        { provide: ProductsService, useValue: productsService },
        { provide: ReviewsService, useValue: reviewsService },
      ],
    }).compile();

    service = moduleRef.get(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws DATA_SOURCE_NOT_FOUND when importing products to a missing source', async () => {
    dataSources.findOne.mockResolvedValue(null);

    await expect(
      service.importProducts({
        dataSourceId: 'missing-source',
        items: [],
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('sanitizes import product errors so errorSummary never contains raw exception text', async () => {
    dataSources.findOne.mockResolvedValue({ id: 'source-1' });
    syncRuns.create.mockImplementation((run: Partial<SyncRun>) => run);
    syncRuns.save
      .mockResolvedValueOnce({ id: 'run-1', dataSourceId: 'source-1' })
      .mockImplementation((run: SyncRun) => Promise.resolve(run));
    rawSnapshots.create.mockImplementation((snapshot: Partial<RawSnapshot>) => snapshot);
    rawSnapshots.save.mockResolvedValue({ id: 'snapshot-1' });

    productsService.create.mockRejectedValue(
      new Error('SQL syntax error near INSERT INTO products; constraint "fk_category"'),
    );

    const result = await service.importProducts({
      dataSourceId: 'source-1',
      items: [
        {
          sourceProductId: 'sp-1',
          title: 'Product 1',
          sellerId: 'seller-1',
          categoryId: 'category-1',
        },
      ],
    });

    const genericMessage =
      VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR];

    expect(result.status).toBe('COMPLETED_WITH_ERRORS');
    expect(result.failedCount).toBe(1);
    expect(result.errorSummary).toContain('sp-1');
    expect(result.errorSummary).toContain(genericMessage);
    expect(result.errorSummary).not.toContain('SQL syntax error');
    expect(result.errorSummary).not.toContain('INSERT INTO products');
    expect(result.errorSummary).not.toContain('fk_category');
  });

  it('sanitizes import review errors so errorSummary never contains raw exception text', async () => {
    dataSources.findOne.mockResolvedValue({ id: 'source-1' });
    syncRuns.create.mockImplementation((run: Partial<SyncRun>) => run);
    syncRuns.save
      .mockResolvedValueOnce({ id: 'run-2', dataSourceId: 'source-1' })
      .mockImplementation((run: SyncRun) => Promise.resolve(run));
    rawSnapshots.create.mockImplementation((snapshot: Partial<RawSnapshot>) => snapshot);
    rawSnapshots.save.mockResolvedValue({ id: 'snapshot-2' });

    reviewsService.create.mockRejectedValue(
      new Error('duplicate key value violates unique constraint "idx_review"'),
    );

    const result = await service.importReviews({
      dataSourceId: 'source-1',
      items: [
        {
          sourceReviewId: 'sr-1',
          sourceProductId: 'sp-1',
          productId: 'product-1',
          rating: 5,
        },
      ],
    });

    const genericMessage =
      VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR];

    expect(result.status).toBe('COMPLETED_WITH_ERRORS');
    expect(result.failedCount).toBe(1);
    expect(result.errorSummary).toContain('sr-1');
    expect(result.errorSummary).toContain(genericMessage);
    expect(result.errorSummary).not.toContain('duplicate key value');
    expect(result.errorSummary).not.toContain('idx_review');
  });
});
