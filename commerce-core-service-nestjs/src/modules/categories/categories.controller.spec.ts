import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController response shape', () => {
  let controller: CategoriesController;
  const categoriesService = {
    list: jest.fn(),
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    listAttributes: jest.fn(),
    createAttribute: jest.fn(),
    updateAttribute: jest.fn(),
    removeAttribute: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: categoriesService },
      ],
    }).compile();
    controller = moduleRef.get(CategoriesController);
  });

  it('create returns only success acknowledgement with no category fields', async () => {
    categoriesService.create.mockResolvedValue({
      id: 'cat-1',
      name: 'Electronics',
      slug: 'electronics',
      path: '',
      level: 0,
      status: 'ACTIVE',
    });

    await expect(
      controller.create({
        name: 'Electronics',
        slug: 'electronics',
      }),
    ).resolves.toEqual({
      success: true,
      id: 'cat-1',
      message: 'Tạo danh mục thành công.',
    });
  });

  it('update returns only success acknowledgement with no category fields', async () => {
    categoriesService.update.mockResolvedValue({
      id: 'cat-1',
      name: 'Updated Electronics',
      slug: 'updated-electronics',
    });

    await expect(
      controller.update(
        '00000000-0000-0000-0000-000000000001',
        { name: 'Updated Electronics' },
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Cập nhật danh mục thành công.',
    });
  });

  it('list returns categories without internal fields', async () => {
    categoriesService.list.mockResolvedValue([
      {
        id: 'cat-1',
        parentId: null,
        name: 'Electronics',
        slug: 'electronics',
        path: '',
        level: 0,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);

    const result = await controller.list();

    expect(result).toEqual([
      {
        id: 'cat-1',
        parentId: null,
        name: 'Electronics',
        slug: 'electronics',
        path: '',
        level: 0,
        status: 'ACTIVE',
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
  });
});
