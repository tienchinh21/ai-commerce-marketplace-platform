import { describe, expect, it, vi } from 'vitest';
import { fetchProductDetail, fetchProducts } from './product.api';
import { coreApi } from '@/shared/api/http-client';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('product API', () => {
  it('fetches products from the CMS products endpoint with list query params', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({
      data: { items: [], total: 0, page: 2, pageSize: 20 },
    });

    const result = await fetchProducts({
      search: 'anker',
      status: 'ACTIVE',
      page: 2,
      pageSize: 20,
    });

    expect(coreApi.get).toHaveBeenCalledWith('/cms/products', {
      params: { search: 'anker', status: 'ACTIVE', page: 2, pageSize: 20 },
    });
    expect(result).toEqual({ items: [], total: 0, page: 2, pageSize: 20 });
  });

  it('fetches product detail from the CMS product detail endpoint', async () => {
    const product = {
      id: 'product-id',
      sellerId: 'seller-id',
      categoryId: 'category-id',
      title: 'Tai nghe',
      slug: 'tai-nghe',
      brand: 'Anker',
      status: 'ACTIVE',
      priceMin: '100000',
      priceMax: '200000',
      ratingAvg: '4.5',
      reviewCount: 12,
      createdAt: '2026-08-07T00:00:00.000Z',
      updatedAt: '2026-08-07T00:00:00.000Z',
      description: null,
      specsJson: {},
      variants: [],
      images: [],
    };
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: product });

    const result = await fetchProductDetail('product-id');

    expect(coreApi.get).toHaveBeenCalledWith('/cms/products/product-id');
    expect(result).toEqual(product);
  });
});
