import { describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import {
  createBuyer,
  fetchBuyerDetail,
  fetchBuyers,
  updateBuyer,
} from './buyer.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('buyer API', () => {
  it('fetches buyers from the CMS buyers endpoint with list params', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, pageSize: 20 },
    });

    await expect(fetchBuyers({ search: 'linh', status: 'ACTIVE' })).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    expect(coreApi.get).toHaveBeenCalledWith('/cms/buyers', {
      params: { search: 'linh', status: 'ACTIVE' },
    });
  });

  it('fetches buyer detail from the CMS buyer endpoint', async () => {
    const buyer = {
      id: 'buyer-id',
      userId: null,
      email: 'buyer@example.com',
      displayName: 'Buyer',
      phone: null,
      status: 'ACTIVE',
      metadataJson: {},
      createdAt: '2026-08-11T00:00:00.000Z',
      updatedAt: '2026-08-11T00:00:00.000Z',
    };
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: buyer });

    await expect(fetchBuyerDetail('buyer-id')).resolves.toEqual(buyer);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/buyers/buyer-id');
  });

  it('creates buyer through the CMS buyers endpoint', async () => {
    const payload = { email: 'buyer@example.com', displayName: 'Buyer', status: 'ACTIVE' };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'buyer-id', message: 'Tạo người mua thành công.' },
    });

    await expect(createBuyer(payload)).resolves.toEqual({
      success: true,
      id: 'buyer-id',
      message: 'Tạo người mua thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/buyers', payload);
  });

  it('updates buyer through the CMS buyer endpoint', async () => {
    vi.mocked(coreApi.patch).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật người mua thành công.' },
    });

    await expect(updateBuyer('buyer-id', { status: 'INACTIVE' })).resolves.toEqual({
      success: true,
      message: 'Cập nhật người mua thành công.',
    });
    expect(coreApi.patch).toHaveBeenCalledWith('/cms/buyers/buyer-id', { status: 'INACTIVE' });
  });
});
