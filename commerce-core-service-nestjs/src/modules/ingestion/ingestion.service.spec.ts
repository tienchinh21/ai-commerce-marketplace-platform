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

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(DataSourceEntity),
          useValue: {
            findOne: dataSourceFindOne,
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SyncRun),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
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
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
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
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(SourceReview),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn(),
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
});
