import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { DeepPartial } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CategoryAttribute } from './category-attribute.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

describe('CategoriesService', () => {
  let service: CategoriesService;
  const findOne = jest.fn();
  const find = jest.fn();
  const create = jest.fn();
  const save = jest.fn();
  const remove = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: { findOne, find, create, save, remove },
        },
        {
          provide: getRepositoryToken(CategoryAttribute),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException for missing category', async () => {
    findOne.mockResolvedValue(null);
    await expect(service.get('missing')).rejects.toMatchObject({
      response: {
        code: ApiErrorCode.CATEGORY_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.CATEGORY_NOT_FOUND],
      },
    });
  });

  it('should create a root category with level 0 and empty path', async () => {
    create.mockImplementation((category: DeepPartial<Category>) => ({
      ...category,
    }));
    save.mockImplementation((category: DeepPartial<Category>) =>
      Promise.resolve({ id: 'c1', ...category }),
    );

    const result = await service.create({ name: 'Electronics' });

    expect(result.level).toBe(0);
    expect(result.path).toBe('');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ parentId: null }),
    );
  });

  it('should create a child category with incremented level and parent path', async () => {
    findOne.mockResolvedValue({ id: 'p1', path: '/p0', level: 0 });
    create.mockImplementation((category: DeepPartial<Category>) => ({
      ...category,
    }));
    save.mockImplementation((category: DeepPartial<Category>) =>
      Promise.resolve({ id: 'c2', ...category }),
    );

    const result = await service.create({ name: 'Phones', parentId: 'p1' });

    expect(result.level).toBe(1);
    expect(result.path).toBe('/p0/p1');
  });
});
