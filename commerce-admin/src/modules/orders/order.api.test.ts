import { describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import { createOrder, fetchOrderDetail, fetchOrders } from './order.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('order API', () => {
  it('fetches orders from the CMS orders endpoint with list params', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, pageSize: 20 },
    });

    await expect(fetchOrders({ sellerId: 'seller-id', status: 'PENDING' })).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    expect(coreApi.get).toHaveBeenCalledWith('/cms/orders', {
      params: { sellerId: 'seller-id', status: 'PENDING' },
    });
  });

  it('fetches order detail from the CMS order endpoint', async () => {
    const order = {
      id: 'order-id',
      buyerId: 'buyer-id',
      sellerId: 'seller-id',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: '120000',
      currency: 'VND',
      orderedAt: '2026-08-11T00:00:00.000Z',
      createdAt: '2026-08-11T00:00:00.000Z',
      updatedAt: '2026-08-11T00:00:00.000Z',
      items: [],
    };
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: order });

    await expect(fetchOrderDetail('order-id')).resolves.toEqual(order);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/orders/order-id');
  });

  it('creates order through the CMS orders endpoint', async () => {
    const payload = {
      buyerId: 'buyer-id',
      sellerId: 'seller-id',
      items: [{ productId: 'product-id', quantity: 1, unitPrice: 120000 }],
    };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'order-id', message: 'Tạo đơn hàng thành công.' },
    });

    await expect(createOrder(payload)).resolves.toEqual({
      success: true,
      id: 'order-id',
      message: 'Tạo đơn hàng thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/orders', payload);
  });
});
