import { Test } from '@nestjs/testing';
import { BuyersController } from './buyers.controller';
import { BuyersService } from './buyers.service';

describe('BuyersController response shape', () => {
  let controller: BuyersController;
  const buyersService = {
    list: jest.fn(),
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [BuyersController],
      providers: [
        { provide: BuyersService, useValue: buyersService },
      ],
    }).compile();
    controller = moduleRef.get(BuyersController);
  });

  it('create returns only success acknowledgement with no metadataJson', async () => {
    buyersService.create.mockResolvedValue({
      id: 'buyer-1',
      userId: null,
      email: 'buyer@example.com',
      displayName: 'Jane Doe',
      phone: '+84901234567',
      status: 'ACTIVE',
      metadataJson: { address: '123 Main St' },
    });

    await expect(
      controller.create({
        email: 'buyer@example.com',
        displayName: 'Jane Doe',
        metadataJson: { address: '123 Main St' },
      }),
    ).resolves.toEqual({
      success: true,
      id: 'buyer-1',
      message: 'Buyer created successfully',
    });
  });

  it('update returns only success acknowledgement with no entity fields', async () => {
    buyersService.update.mockResolvedValue({
      id: 'buyer-1',
      displayName: 'Jane Updated',
      metadataJson: { address: '456 New St' },
    });

    await expect(
      controller.update(
        '00000000-0000-0000-0000-000000000001',
        { displayName: 'Jane Updated' },
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Buyer updated successfully',
    });
  });

  it('list returns buyers mapped to the buyer response DTO', async () => {
    buyersService.list.mockResolvedValue({
      items: [
        {
          id: 'buyer-1',
          userId: null,
          email: 'buyer@example.com',
          displayName: 'Jane Doe',
          phone: '+84901234567',
          status: 'ACTIVE',
          metadataJson: { address: '123 Main St' },
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
        id: 'buyer-1',
        userId: null,
        email: 'buyer@example.com',
        displayName: 'Jane Doe',
        phone: '+84901234567',
        status: 'ACTIVE',
        metadataJson: { address: '123 Main St' },
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
  });
});
