import { describe, expect, it, vi } from 'vitest';
import {
  addProductImages,
  createProduct,
  createProductVariant,
  deleteProduct,
  fetchProductDetail,
  fetchProducts,
  updateProduct,
} from './product.api';
import { coreApi } from '@/shared/api/http-client';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
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
      seller: { id: 'seller-id', name: 'Anker Official Store' },
      category: { id: 'category-id', name: 'Tai nghe' },
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

  it('creates product through the CMS products endpoint', async () => {
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'product-id', message: 'Tạo sản phẩm thành công.' },
    });

    const payload = {
      sellerId: 'seller-id',
      categoryId: 'category-id',
      title: 'Tai nghe',
      priceMin: 100000,
      priceMax: 200000,
    };

    await expect(createProduct(payload)).resolves.toEqual({
      success: true,
      id: 'product-id',
      message: 'Tạo sản phẩm thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/products', payload);
  });

  it('updates product through the CMS product endpoint', async () => {
    vi.mocked(coreApi.patch).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật sản phẩm thành công.' },
    });

    await expect(updateProduct('product-id', { status: 'INACTIVE' })).resolves.toEqual({
      success: true,
      message: 'Cập nhật sản phẩm thành công.',
    });
    expect(coreApi.patch).toHaveBeenCalledWith('/cms/products/product-id', { status: 'INACTIVE' });
  });

  it('creates product variant through the CMS variant endpoint', async () => {
    const payload = { sku: 'SKU-1', price: 120000, stockQuantity: 5 };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'variant-id', message: 'Tạo biến thể sản phẩm thành công.' },
    });

    await expect(createProductVariant('product-id', payload)).resolves.toEqual({
      success: true,
      id: 'variant-id',
      message: 'Tạo biến thể sản phẩm thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/products/product-id/variants', payload);
  });

  it('adds product images through the CMS images endpoint', async () => {
    const payload = {
      images: [{ url: 'https://example.com/image.jpg', altText: 'Ảnh sản phẩm' }],
    };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: {
        success: true,
        ids: ['image-id'],
        count: 1,
        message: 'Thêm hình ảnh sản phẩm thành công.',
      },
    });

    await expect(addProductImages('product-id', payload)).resolves.toEqual({
      success: true,
      ids: ['image-id'],
      count: 1,
      message: 'Thêm hình ảnh sản phẩm thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/products/product-id/images', payload);
  });

  it('deletes product through the CMS product endpoint', async () => {
    vi.mocked(coreApi.delete).mockResolvedValueOnce({ data: undefined });

    await expect(deleteProduct('product-id')).resolves.toBeUndefined();
    expect(coreApi.delete).toHaveBeenCalledWith('/cms/products/product-id');
  });
});
