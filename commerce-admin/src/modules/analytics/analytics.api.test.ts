import { describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import {
  fetchCategorySummary,
  fetchProductPerformance,
  fetchReviewSentiment,
  fetchSellerPerformance,
} from './analytics.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('analytics API', () => {
  it('fetches product performance from the CMS analytics endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [{ productId: 'product-id' }] });

    await expect(fetchProductPerformance({ limit: 5 })).resolves.toEqual([{ productId: 'product-id' }]);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/analytics/product-performance', {
      params: { limit: 5 },
    });
  });

  it('fetches review sentiment from the CMS analytics endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });

    await expect(fetchReviewSentiment({ categoryId: 'category-id' })).resolves.toEqual([]);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/analytics/review-sentiment', {
      params: { categoryId: 'category-id' },
    });
  });

  it('fetches seller performance from the CMS analytics endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });

    await expect(fetchSellerPerformance({ from: '2026-08-01', to: '2026-08-11' })).resolves.toEqual([]);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/analytics/seller-performance', {
      params: { from: '2026-08-01', to: '2026-08-11' },
    });
  });

  it('fetches category summary from the CMS analytics endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });

    await expect(fetchCategorySummary()).resolves.toEqual([]);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/analytics/category-summary', {
      params: undefined,
    });
  });
});
