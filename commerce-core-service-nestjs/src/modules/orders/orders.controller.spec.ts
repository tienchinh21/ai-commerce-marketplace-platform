import { Test } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController response shape', () => {
  let controller: OrdersController;
  const ordersService = {
    list: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: OrdersService, useValue: ordersService },
      ],
    }).compile();
    controller = moduleRef.get(OrdersController);
  });

  it('create returns only success acknowledgement with no order items', async () => {
    ordersService.create.mockResolvedValue({
      id: 'order-1',
      buyerId: 'buyer-1',
      sellerId: 'seller-1',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: '1399.98',
      currency: 'USD',
      orderedAt: new Date('2026-08-06T00:00:00.000Z'),
      items: [
        {
          productId: 'prod-1',
          variantId: 'variant-1',
          quantity: 2,
          unitPrice: '699.99',
        },
      ],
    });

    await expect(
      controller.create({
        buyerId: 'buyer-1',
        sellerId: 'seller-1',
        items: [
          {
            productId: 'prod-1',
            variantId: 'variant-1',
            quantity: 2,
            unitPrice: 699.99,
          },
        ],
      }),
    ).resolves.toEqual({
      success: true,
      id: 'order-1',
      message: 'Tạo đơn hàng thành công.',
    });
  });

  it('list returns orders without exposing line items', async () => {
    ordersService.list.mockResolvedValue({
      items: [
        {
          id: 'order-1',
          buyerId: 'buyer-1',
          sellerId: 'seller-1',
          status: 'PENDING',
          paymentStatus: 'PENDING',
          totalAmount: '1399.98',
          currency: 'USD',
          orderedAt: new Date('2026-08-06T00:00:00.000Z'),
          createdAt: new Date('2026-08-06T00:00:00.000Z'),
          updatedAt: new Date('2026-08-06T00:00:00.000Z'),
          items: [
            {
              productId: 'prod-1',
              variantId: 'variant-1',
              quantity: 2,
              unitPrice: '699.99',
            },
          ],
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    const result = await controller.list();

    expect(result.items).toEqual([
      {
        id: 'order-1',
        buyerId: 'buyer-1',
        sellerId: 'seller-1',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        totalAmount: '1399.98',
        currency: 'USD',
        orderedAt: new Date('2026-08-06T00:00:00.000Z'),
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
    expect('items' in result.items[0]).toBe(false);
  });
});
