import { describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import {
  createReview,
  fetchReviewDetail,
  fetchReviews,
  updateReview,
} from './review.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('review API', () => {
  it('fetches reviews from the CMS reviews endpoint with list params', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({
      data: { items: [], total: 0, page: 2, pageSize: 20 },
    });

    await expect(fetchReviews({ productId: 'product-id', minRating: 4, page: 2 })).resolves.toEqual({
      items: [],
      total: 0,
      page: 2,
      pageSize: 20,
    });
    expect(coreApi.get).toHaveBeenCalledWith('/cms/reviews', {
      params: { productId: 'product-id', minRating: 4, page: 2 },
    });
  });

  it('fetches review detail from the CMS review endpoint', async () => {
    const review = {
      id: 'review-id',
      productId: 'product-id',
      buyerId: null,
      sellerId: null,
      rating: 5,
      title: 'Tốt',
      content: 'Sản phẩm tốt',
      status: 'ACTIVE',
      sourceType: 'manual',
      sourceReviewId: null,
      createdAt: '2026-08-11T00:00:00.000Z',
      updatedAt: '2026-08-11T00:00:00.000Z',
    };
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: review });

    await expect(fetchReviewDetail('review-id')).resolves.toEqual(review);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/reviews/review-id');
  });

  it('creates review through the CMS reviews endpoint', async () => {
    const payload = { productId: 'product-id', rating: 5, title: 'Tốt' };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'review-id', message: 'Tạo đánh giá thành công.' },
    });

    await expect(createReview(payload)).resolves.toEqual({
      success: true,
      id: 'review-id',
      message: 'Tạo đánh giá thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/reviews', payload);
  });

  it('updates review through the CMS review endpoint', async () => {
    vi.mocked(coreApi.patch).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật đánh giá thành công.' },
    });

    await expect(updateReview('review-id', { status: 'HIDDEN' })).resolves.toEqual({
      success: true,
      message: 'Cập nhật đánh giá thành công.',
    });
    expect(coreApi.patch).toHaveBeenCalledWith('/cms/reviews/review-id', { status: 'HIDDEN' });
  });
});
