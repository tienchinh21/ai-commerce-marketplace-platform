import { beforeEach, describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import {
  createDataSource,
  fetchDataSourceDetail,
  fetchDataSources,
  fetchRawSnapshotDetail,
  fetchRawSnapshots,
  fetchSyncRunDetail,
  fetchSyncRuns,
  importProducts,
  importReviews,
  updateDataSource,
} from './ingestion.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('ingestion API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data sources from the CMS endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });

    await expect(fetchDataSources()).resolves.toEqual([]);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/data-sources');
  });

  it('creates data source through the CMS endpoint', async () => {
    const payload = { name: 'Shopee', type: 'marketplace', status: 'ACTIVE' };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'source-id', message: 'Tạo nguồn dữ liệu thành công.' },
    });

    await expect(createDataSource(payload)).resolves.toEqual({
      success: true,
      id: 'source-id',
      message: 'Tạo nguồn dữ liệu thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/data-sources', payload);
  });

  it('fetches and updates data source detail through the CMS endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: { id: 'source-id' } });
    vi.mocked(coreApi.patch).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật nguồn dữ liệu thành công.' },
    });

    await expect(fetchDataSourceDetail('source-id')).resolves.toEqual({ id: 'source-id' });
    await expect(updateDataSource('source-id', { status: 'INACTIVE' })).resolves.toEqual({
      success: true,
      message: 'Cập nhật nguồn dữ liệu thành công.',
    });
    expect(coreApi.get).toHaveBeenCalledWith('/cms/data-sources/source-id');
    expect(coreApi.patch).toHaveBeenCalledWith('/cms/data-sources/source-id', { status: 'INACTIVE' });
  });

  it('fetches sync runs and sync run detail through the CMS endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, pageSize: 20 },
    });
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: { id: 'sync-run-id' } });

    await expect(fetchSyncRuns({ dataSourceId: 'source-id' })).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    await expect(fetchSyncRunDetail('sync-run-id')).resolves.toEqual({ id: 'sync-run-id' });
    expect(coreApi.get).toHaveBeenNthCalledWith(1, '/cms/sync-runs', {
      params: { dataSourceId: 'source-id' },
    });
    expect(coreApi.get).toHaveBeenNthCalledWith(2, '/cms/sync-runs/sync-run-id');
  });

  it('fetches raw snapshots and raw snapshot detail through the CMS endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, pageSize: 20 },
    });
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: { id: 'snapshot-id' } });

    await expect(fetchRawSnapshots({ syncRunId: 'sync-run-id' })).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    await expect(fetchRawSnapshotDetail('snapshot-id')).resolves.toEqual({ id: 'snapshot-id' });
    expect(coreApi.get).toHaveBeenNthCalledWith(1, '/cms/raw-snapshots', {
      params: { syncRunId: 'sync-run-id' },
    });
    expect(coreApi.get).toHaveBeenNthCalledWith(2, '/cms/raw-snapshots/snapshot-id');
  });

  it('imports products and reviews through the CMS endpoints', async () => {
    vi.mocked(coreApi.post).mockResolvedValue({
      data: {
        success: true,
        syncRunId: 'sync-run-id',
        status: 'COMPLETED',
        totalRecords: 1,
        successCount: 1,
        failedCount: 0,
        message: 'Hoàn tất.',
      },
    });

    await importProducts({
      dataSourceId: 'source-id',
      items: [{ sourceProductId: 'SRC-1', title: 'Sản phẩm', sellerId: 'seller-id', categoryId: 'category-id' }],
    });
    await importReviews({
      dataSourceId: 'source-id',
      items: [{ sourceReviewId: 'REV-1', sourceProductId: 'SRC-1', productId: 'product-id', rating: 5 }],
    });

    expect(coreApi.post).toHaveBeenNthCalledWith(1, '/cms/imports/products', {
      dataSourceId: 'source-id',
      items: [{ sourceProductId: 'SRC-1', title: 'Sản phẩm', sellerId: 'seller-id', categoryId: 'category-id' }],
    });
    expect(coreApi.post).toHaveBeenNthCalledWith(2, '/cms/imports/reviews', {
      dataSourceId: 'source-id',
      items: [{ sourceReviewId: 'REV-1', sourceProductId: 'SRC-1', productId: 'product-id', rating: 5 }],
    });
  });
});
