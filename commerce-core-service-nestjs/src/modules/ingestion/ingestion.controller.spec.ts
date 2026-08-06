import { Test } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController response shape', () => {
  let controller: IngestionController;
  const ingestionService = {
    listDataSources: jest.fn(),
    createDataSource: jest.fn(),
    getDataSource: jest.fn(),
    updateDataSource: jest.fn(),
    listSyncRuns: jest.fn(),
    getSyncRun: jest.fn(),
    listRawSnapshots: jest.fn(),
    getRawSnapshot: jest.fn(),
    importProducts: jest.fn(),
    importReviews: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        { provide: IngestionService, useValue: ingestionService },
      ],
    }).compile();
    controller = moduleRef.get(IngestionController);
  });

  it('does not expose configJson in data source list', async () => {
    ingestionService.listDataSources.mockResolvedValue([
      {
        id: 'source-1',
        name: 'Crawler',
        type: 'crawler',
        baseUrl: 'https://example.com',
        status: 'ACTIVE',
        configJson: { apiKey: 'secret' },
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);

    const result = await controller.listDataSources();
    expect('configJson' in result[0]).toBe(false);
  });

  it('does not expose configJson in data source detail', async () => {
    ingestionService.getDataSource.mockResolvedValue({
      id: 'source-1',
      name: 'Crawler',
      type: 'crawler',
      baseUrl: 'https://example.com',
      status: 'ACTIVE',
      configJson: { apiKey: 'secret' },
      createdAt: new Date('2026-08-06T00:00:00.000Z'),
      updatedAt: new Date('2026-08-06T00:00:00.000Z'),
    });

    const result = await controller.getDataSource(
      '00000000-0000-0000-0000-000000000001',
    );
    expect('configJson' in result).toBe(false);
  });

  it('does not expose rawJson in raw snapshot detail', async () => {
    ingestionService.getRawSnapshot.mockResolvedValue({
      id: 'snapshot-1',
      dataSourceId: 'source-1',
      syncRunId: 'run-1',
      contentType: 'application/json',
      contentHash: 'abc',
      rawJson: { payload: 'large-sensitive-content' },
      objectStorageKey: null,
      parseStatus: 'PARSED',
      errorMessage: null,
      createdAt: new Date('2026-08-06T00:00:00.000Z'),
    });

    const result = await controller.getRawSnapshot(
      '00000000-0000-0000-0000-000000000001',
    );
    expect('rawJson' in result).toBe(false);
  });

  it('returns compact import run response for products', async () => {
    ingestionService.importProducts.mockResolvedValue({
      id: 'run-1',
      status: 'COMPLETED',
      totalRecords: 2,
      successCount: 2,
      failedCount: 0,
    });

    await expect(
      controller.importProducts({ dataSourceId: 'source-1', items: [] }),
    ).resolves.toEqual({
      success: true,
      syncRunId: 'run-1',
      status: 'COMPLETED',
      totalRecords: 2,
      successCount: 2,
      failedCount: 0,
      message: 'Nhập sản phẩm hoàn tất.',
    });
  });

  it('returns compact import run response for reviews', async () => {
    ingestionService.importReviews.mockResolvedValue({
      id: 'run-2',
      status: 'COMPLETED_WITH_ERRORS',
      totalRecords: 2,
      successCount: 1,
      failedCount: 1,
    });

    await expect(
      controller.importReviews({ dataSourceId: 'source-1', items: [] }),
    ).resolves.toEqual({
      success: false,
      syncRunId: 'run-2',
      status: 'COMPLETED_WITH_ERRORS',
      totalRecords: 2,
      successCount: 1,
      failedCount: 1,
      message: 'Nhập đánh giá hoàn tất nhưng có lỗi.',
    });
  });

  it('returns success acknowledgement when creating a data source', async () => {
    ingestionService.createDataSource.mockResolvedValue({
      id: 'source-2',
      name: 'Manual',
      type: 'manual_import',
    });

    await expect(
      controller.createDataSource({
        name: 'Manual',
        type: 'manual_import',
      }),
    ).resolves.toEqual({
      success: true,
      id: 'source-2',
      message: 'Tạo nguồn dữ liệu thành công.',
    });
  });

  it('returns success acknowledgement when updating a data source', async () => {
    ingestionService.updateDataSource.mockResolvedValue({
      id: 'source-1',
      name: 'Updated',
    });

    await expect(
      controller.updateDataSource(
        '00000000-0000-0000-0000-000000000001',
        { name: 'Updated' },
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Cập nhật nguồn dữ liệu thành công.',
    });
  });
});
