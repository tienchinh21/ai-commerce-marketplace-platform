import { describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import {
  createSeller,
  fetchSellerDetail,
  fetchSellers,
  updateSeller,
} from './seller.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('seller API', () => {
  it('fetches sellers from the CMS sellers endpoint with list params', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, pageSize: 20 },
    });

    await expect(fetchSellers({ search: 'store', status: 'ACTIVE' })).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    expect(coreApi.get).toHaveBeenCalledWith('/cms/sellers', {
      params: { search: 'store', status: 'ACTIVE' },
    });
  });

  it('fetches seller detail from the CMS seller endpoint', async () => {
    const seller = {
      id: 'seller-id',
      userId: null,
      name: 'Official Store',
      slug: 'official-store',
      status: 'ACTIVE',
      metadataJson: {},
      createdAt: '2026-08-11T00:00:00.000Z',
      updatedAt: '2026-08-11T00:00:00.000Z',
    };
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: seller });

    await expect(fetchSellerDetail('seller-id')).resolves.toEqual(seller);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/sellers/seller-id');
  });

  it('creates seller through the CMS sellers endpoint', async () => {
    const payload = { name: 'Official Store', status: 'ACTIVE' };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'seller-id', message: 'Tạo nhà bán hàng thành công.' },
    });

    await expect(createSeller(payload)).resolves.toEqual({
      success: true,
      id: 'seller-id',
      message: 'Tạo nhà bán hàng thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/sellers', payload);
  });

  it('updates seller through the CMS seller endpoint', async () => {
    vi.mocked(coreApi.patch).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật nhà bán hàng thành công.' },
    });

    await expect(updateSeller('seller-id', { status: 'INACTIVE' })).resolves.toEqual({
      success: true,
      message: 'Cập nhật nhà bán hàng thành công.',
    });
    expect(coreApi.patch).toHaveBeenCalledWith('/cms/sellers/seller-id', { status: 'INACTIVE' });
  });
});
