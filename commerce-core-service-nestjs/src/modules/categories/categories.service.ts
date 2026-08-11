import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryAttribute } from './category-attribute.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface CreateCategoryInput {
  parentId?: string | null;
  name: string;
  slug?: string;
  status?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  status?: string;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(CategoryAttribute)
    private readonly attributes: Repository<CategoryAttribute>,
  ) {}

  async list(): Promise<Category[]> {
    return this.categories.find({ order: { level: 'ASC', name: 'ASC' } });
  }

  async get(id: string): Promise<Category> {
    const category = await this.categories.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException({
        code: ApiErrorCode.CATEGORY_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.CATEGORY_NOT_FOUND],
      });
    }
    return category;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const parentId = input.parentId ?? null;
    const slug = input.slug ?? slugify(input.name);
    let path = `/${slug}`;
    let level = 0;

    if (parentId) {
      const parent = await this.get(parentId);
      const parentPath = parent.path || `/${parent.slug}`;
      path = `${parentPath}/${slug}`;
      level = parent.level + 1;
    }

    const category = this.categories.create({
      parentId,
      name: input.name,
      slug,
      path,
      level,
      status: input.status ?? 'ACTIVE',
    });
    return this.categories.save(category);
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const category = await this.get(id);
    if (input.name !== undefined) category.name = input.name;
    if (input.slug !== undefined) category.slug = input.slug;
    if (input.status !== undefined) category.status = input.status;
    return this.categories.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.get(id);
    await this.categories.remove(category);
  }

  async listAttributes(categoryId: string): Promise<CategoryAttribute[]> {
    await this.get(categoryId);
    return this.attributes.find({
      where: { category: { id: categoryId } },
      order: { code: 'ASC' },
    });
  }

  async createAttribute(
    categoryId: string,
    input: Partial<CategoryAttribute>,
  ): Promise<CategoryAttribute> {
    const category = await this.get(categoryId);
    const attribute = this.attributes.create({ ...input, category });
    return this.attributes.save(attribute);
  }

  async updateAttribute(
    id: string,
    input: Partial<CategoryAttribute>,
  ): Promise<CategoryAttribute> {
    const attribute = await this.attributes.findOne({ where: { id } });
    if (!attribute) {
      throw new NotFoundException({
        code: ApiErrorCode.CATEGORY_ATTRIBUTE_NOT_FOUND,
        message:
          VI_API_MESSAGES.errors[ApiErrorCode.CATEGORY_ATTRIBUTE_NOT_FOUND],
      });
    }
    Object.assign(attribute, input);
    return this.attributes.save(attribute);
  }

  async removeAttribute(id: string): Promise<void> {
    const attribute = await this.attributes.findOne({ where: { id } });
    if (!attribute) {
      throw new NotFoundException({
        code: ApiErrorCode.CATEGORY_ATTRIBUTE_NOT_FOUND,
        message:
          VI_API_MESSAGES.errors[ApiErrorCode.CATEGORY_ATTRIBUTE_NOT_FOUND],
      });
    }
    await this.attributes.remove(attribute);
  }
}
