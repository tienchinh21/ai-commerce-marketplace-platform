import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { Seller } from '../sellers/seller.entity';
import { Category } from '../categories/category.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

describe('ProductsService', () => {
  let service: ProductsService;
  const productFindOne = jest.fn();
  const variantFind = jest.fn();
  const imageFind = jest.fn();
  const sellerFindOne = jest.fn();
  const categoryFindOne = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOne: productFindOne,
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            })),
          },
        },
        {
          provide: getRepositoryToken(ProductVariant),
          useValue: {
            find: variantFind,
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProductImage),
          useValue: {
            find: imageFind,
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Seller),
          useValue: {
            findOne: sellerFindOne,
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: categoryFindOne,
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return PRODUCT_NOT_FOUND for missing product', async () => {
    productFindOne.mockResolvedValue(null);

    await expect(service.get('missing')).rejects.toMatchObject({
      response: {
        code: ApiErrorCode.PRODUCT_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.PRODUCT_NOT_FOUND],
      },
    });
  });

  it('getDetail returns seller and category summaries with variants and images', async () => {
    productFindOne.mockResolvedValue({
      id: 'prod-1',
      sellerId: 'seller-1',
      categoryId: 'cat-1',
      title: 'Tai nghe Anker',
    });
    variantFind.mockResolvedValue([{ id: 'variant-1' }]);
    imageFind.mockResolvedValue([{ id: 'image-1' }]);
    sellerFindOne.mockResolvedValue({
      id: 'seller-1',
      name: 'Anker Official Store',
    });
    categoryFindOne.mockResolvedValue({ id: 'cat-1', name: 'Tai nghe' });

    await expect(service.getDetail('prod-1')).resolves.toMatchObject({
      id: 'prod-1',
      seller: {
        id: 'seller-1',
        name: 'Anker Official Store',
      },
      category: {
        id: 'cat-1',
        name: 'Tai nghe',
      },
      variants: [{ id: 'variant-1' }],
      images: [{ id: 'image-1' }],
    });
    expect(sellerFindOne).toHaveBeenCalledWith({
      where: { id: 'seller-1' },
      select: { id: true, name: true },
    });
    expect(categoryFindOne).toHaveBeenCalledWith({
      where: { id: 'cat-1' },
      select: { id: true, name: true },
    });
  });
});
