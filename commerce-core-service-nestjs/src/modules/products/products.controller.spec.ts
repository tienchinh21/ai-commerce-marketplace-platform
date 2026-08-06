import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController response shape', () => {
  let controller: ProductsController;
  const productsService = {
    list: jest.fn(),
    create: jest.fn(),
    getDetail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    listVariants: jest.fn(),
    createVariant: jest.fn(),
    addImages: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: productsService },
      ],
    }).compile();
    controller = moduleRef.get(ProductsController);
  });

  it('create returns only success acknowledgement with no title/specsJson', async () => {
    productsService.create.mockResolvedValue({
      id: 'prod-1',
      sellerId: 'seller-1',
      categoryId: 'cat-1',
      title: 'Smartphone X',
      slug: 'smartphone-x',
      brand: 'TechBrand',
      description: 'A flagship smartphone',
      status: 'ACTIVE',
      priceMin: '499.99',
      priceMax: '799.99',
      ratingAvg: '0',
      reviewCount: 0,
      specsJson: { color: 'black' },
    });

    await expect(
      controller.create({
        sellerId: 'seller-1',
        categoryId: 'cat-1',
        title: 'Smartphone X',
        specsJson: { color: 'black' },
      }),
    ).resolves.toEqual({
      success: true,
      id: 'prod-1',
      message: 'Tạo sản phẩm thành công.',
    });
  });

  it('update returns only success acknowledgement with no product entity fields', async () => {
    productsService.update.mockResolvedValue({
      id: 'prod-1',
      title: 'Updated Smartphone',
      specsJson: { color: 'white' },
    });

    await expect(
      controller.update(
        '00000000-0000-0000-0000-000000000001',
        { title: 'Updated Smartphone' },
      ),
    ).resolves.toEqual({
      success: true,
      message: 'Cập nhật sản phẩm thành công.',
    });
  });

  it('addImages returns only bulk acknowledgement with no image url/altText', async () => {
    productsService.addImages.mockResolvedValue([
      {
        id: 'img-1',
        url: 'https://example.com/image.jpg',
        altText: 'Product image',
        sortOrder: 0,
      },
      {
        id: 'img-2',
        url: 'https://example.com/image2.jpg',
        altText: 'Product image 2',
        sortOrder: 1,
      },
    ]);

    await expect(
      controller.addImages(
        '00000000-0000-0000-0000-000000000001',
        {
          images: [
            { url: 'https://example.com/image.jpg', altText: 'Product image' },
            { url: 'https://example.com/image2.jpg', altText: 'Product image 2' },
          ],
        },
      ),
    ).resolves.toEqual({
      success: true,
      ids: ['img-1', 'img-2'],
      count: 2,
      message: 'Thêm hình ảnh sản phẩm thành công.',
    });
  });

  it('list returns products without heavy internal fields', async () => {
    productsService.list.mockResolvedValue({
      items: [
        {
          id: 'prod-1',
          sellerId: 'seller-1',
          categoryId: 'cat-1',
          title: 'Smartphone X',
          slug: 'smartphone-x',
          brand: 'TechBrand',
          status: 'ACTIVE',
          priceMin: '499.99',
          priceMax: '799.99',
          ratingAvg: '4.5',
          reviewCount: 10,
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
        id: 'prod-1',
        sellerId: 'seller-1',
        categoryId: 'cat-1',
        title: 'Smartphone X',
        slug: 'smartphone-x',
        brand: 'TechBrand',
        status: 'ACTIVE',
        priceMin: '499.99',
        priceMax: '799.99',
        ratingAvg: '4.5',
        reviewCount: 10,
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
    expect('description' in result.items[0]).toBe(false);
    expect('specsJson' in result.items[0]).toBe(false);
  });
});
