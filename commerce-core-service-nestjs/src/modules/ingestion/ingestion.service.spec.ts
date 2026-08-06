import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
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
  const dataSourceFindOne = jest.fn();
  const dataSourceCreate = jest.fn();
  const dataSourceSave = jest.fn();
  const syncRunFindOne = jest.fn();
  const syncRunCreate = jest.fn();
  const syncRunSave = jest.fn();
  const rawSnapshotFindOne = jest.fn();
  const rawSnapshotCreate = jest.fn();
  const rawSnapshotSave = jest.fn();
  const sourceProductCreate = jest.fn();
  const sourceProductSave = jest.fn();
  const sourceReviewCreate = jest.fn();
  const sourceReviewSave = jest.fn();
  const productsCreate = jest.fn();
  const reviewsCreate = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    syncRunCreate.mockImplementation((data) => data);
    syncRunSave.mockImplementation((run) => Promise.resolve(run));
    rawSnapshotCreate.mockImplementation((data) => data);
    rawSnapshotSave.mockImplementation((snapshot) =>
      Promise.resolve(snapshot),
    );

    const moduleRef = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(DataSourceEntity),
          useValue: {
            findOne: dataSourceFindOne,
            find: jest.fn(),
            create: dataSourceCreate,
            save: dataSourceSave,
          },
        },
        {
          provide: getRepositoryToken(SyncRun),
          useValue: {
            findOne: syncRunFindOne,
            create: syncRunCreate,
            save: syncRunSave,
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            })),
          },
        },
        {
          provide: getRepositoryToken(RawSnapshot),
          useValue: {
            findOne: rawSnapshotFindOne,
            create: rawSnapshotCreate,
            save: rawSnapshotSave,
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            })),
          },
        },
        {
          provide: getRepositoryToken(SourceProduct),
          useValue: {
            create: sourceProductCreate,
            save: sourceProductSave,
          },
        },
        {
          provide: getRepositoryToken(SourceReview),
          useValue: {
            create: sourceReviewCreate,
            save: sourceReviewSave,
          },
        },
        {
          provide: ProductsService,
          useValue: {
            create: productsCreate,
          },
        },
        {
          provide: ReviewsService,
          useValue: {
            create: reviewsCreate,
          },
        },
      ],
    }).compile();

    service = moduleRef.get(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return DATA_SOURCE_NOT_FOUND for missing data source', async () => {
    dataSourceFindOne.mockResolvedValue(null);

    await expect(service.getDataSource('missing')).rejects.toMatchObject({
      response: {
        code: ApiErrorCode.DATA_SOURCE_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.DATA_SOURCE_NOT_FOUND],
      },
    });
  });

  it('should sanitize errorSummary for importProducts and avoid leaking raw exception text', async () => {
    const dataSourceId = 'ds-1';
    const sourceProductId = 'sp-1';
    dataSourceFindOne.mockResolvedValue({ id: dataSourceId });
    productsCreate.mockRejectedValue(
      new Error(
        'insert into products values (...) - duplicate key value violates unique constraint "products_pkey"',
      ),
    );

    const result = await service.importProducts({
      dataSourceId,
      items: [
        {
          sourceProductId,
          title: 'Product title',
          sellerId: 'seller-1',
          categoryId: 'cat-1',
        },
      ],
    });

    expect(result.errorSummary).toContain(
      VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR],
    );
    expect(result.errorSummary).toContain(sourceProductId);
    expect(result.errorSummary).not.toContain('insert into');
    expect(result.errorSummary).not.toContain('products_pkey');
    expect(result.errorSummary).not.toContain('Error:');
    expect(result.errorSummary).not.toContain('duplicate key value');
  });

  it('should sanitize errorSummary for importReviews and avoid leaking raw exception text', async () => {
    const dataSourceId = 'ds-1';
    const sourceReviewId = 'sr-1';
    dataSourceFindOne.mockResolvedValue({ id: dataSourceId });
    reviewsCreate.mockRejectedValue(
      new Error(
        'insert into reviews values (...) - duplicate key value violates unique constraint "reviews_pkey"',
      ),
    );

    const result = await service.importReviews({
      dataSourceId,
      items: [
        {
          sourceReviewId,
          sourceProductId: 'sp-1',
          productId: 'prod-1',
          rating: 5,
        },
      ],
    });

    expect(result.errorSummary).toContain(
      VI_API_MESSAGES.errors[ApiErrorCode.INTERNAL_SERVER_ERROR],
    );
    expect(result.errorSummary).toContain(sourceReviewId);
    expect(result.errorSummary).not.toContain('insert into');
    expect(result.errorSummary).not.toContain('reviews_pkey');
    expect(result.errorSummary).not.toContain('Error:');
    expect(result.errorSummary).not.toContain('duplicate key value');
  });
});
