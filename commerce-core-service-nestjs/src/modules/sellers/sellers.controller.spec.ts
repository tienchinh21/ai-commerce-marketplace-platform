import { Test } from '@nestjs/testing';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

describe('SellersController response shape', () => {
  let controller: SellersController;
  const sellersService = {
    list: jest.fn(),
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [SellersController],
      providers: [{ provide: SellersService, useValue: sellersService }],
    }).compile();
    controller = moduleRef.get(SellersController);
  });

  it('create returns only success acknowledgement with no metadataJson', async () => {
    sellersService.create.mockResolvedValue({
      id: 'seller-1',
      userId: null,
      name: 'Acme Corp',
      slug: 'acme-corp',
      status: 'ACTIVE',
      metadataJson: { taxId: '123456789' },
    });

    await expect(
      controller.create({
        name: 'Acme Corp',
        metadataJson: { taxId: '123456789' },
      }),
    ).resolves.toEqual({
      success: true,
      id: 'seller-1',
      message: 'Tạo nhà bán hàng thành công.',
    });
  });

  it('update returns only success acknowledgement with no entity fields', async () => {
    sellersService.update.mockResolvedValue({
      id: 'seller-1',
      name: 'Acme Updated',
      metadataJson: { taxId: '987654321' },
    });

    await expect(
      controller.update('00000000-0000-0000-0000-000000000001', {
        name: 'Acme Updated',
      }),
    ).resolves.toEqual({
      success: true,
      message: 'Cập nhật nhà bán hàng thành công.',
    });
  });

  it('list returns sellers mapped to the seller response DTO', async () => {
    sellersService.list.mockResolvedValue({
      items: [
        {
          id: 'seller-1',
          userId: null,
          name: 'Acme Corp',
          slug: 'acme-corp',
          status: 'ACTIVE',
          metadataJson: { taxId: '123456789' },
          createdAt: new Date('2026-08-06T00:00:00.000Z'),
          updatedAt: new Date('2026-08-06T00:00:00.000Z'),
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    const result = await controller.list();

    expect(result.items).toEqual([
      {
        id: 'seller-1',
        userId: null,
        name: 'Acme Corp',
        slug: 'acme-corp',
        status: 'ACTIVE',
        metadataJson: { taxId: '123456789' },
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
  });
});
