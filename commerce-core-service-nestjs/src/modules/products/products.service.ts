import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

export interface ListProductsQuery {
  search?: string;
  categoryId?: string;
  sellerId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateProductInput {
  sellerId: string;
  categoryId: string;
  title: string;
  slug?: string;
  brand?: string | null;
  description?: string | null;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  specsJson?: Record<string, unknown>;
}

export interface UpdateProductInput {
  sellerId?: string;
  categoryId?: string;
  title?: string;
  slug?: string;
  brand?: string | null;
  description?: string | null;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  specsJson?: Record<string, unknown>;
}

export interface CreateVariantInput {
  sku: string;
  title?: string | null;
  price: number;
  stockQuantity?: number;
  status?: string;
  specsJson?: Record<string, unknown>;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variants: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly images: Repository<ProductImage>,
  ) {}

  async list(query: ListProductsQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.products.createQueryBuilder('product');

    if (query.search) {
      qb.andWhere(
        'product.title ILIKE :search OR product.brand ILIKE :search',
        {
          search: `%${query.search}%`,
        },
      );
    }
    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }
    if (query.sellerId) {
      qb.andWhere('product.sellerId = :sellerId', { sellerId: query.sellerId });
    }
    if (query.status) {
      qb.andWhere('product.status = :status', { status: query.status });
    }

    const [items, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<Product> {
    const product = await this.products.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException({
        code: ApiErrorCode.PRODUCT_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.PRODUCT_NOT_FOUND],
      });
    }
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = this.products.create({
      sellerId: input.sellerId,
      categoryId: input.categoryId,
      title: input.title,
      slug: input.slug ?? slugify(input.title),
      brand: input.brand ?? null,
      description: input.description ?? null,
      status: input.status ?? 'ACTIVE',
      priceMin: String(input.priceMin ?? 0),
      priceMax: String(input.priceMax ?? 0),
      specsJson: input.specsJson ?? {},
    });
    return this.products.save(product);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.get(id);
    if (input.sellerId !== undefined) product.sellerId = input.sellerId;
    if (input.categoryId !== undefined) product.categoryId = input.categoryId;
    if (input.title !== undefined) product.title = input.title;
    if (input.slug !== undefined) product.slug = input.slug;
    if (input.brand !== undefined) product.brand = input.brand;
    if (input.description !== undefined)
      product.description = input.description;
    if (input.status !== undefined) product.status = input.status;
    if (input.priceMin !== undefined) product.priceMin = String(input.priceMin);
    if (input.priceMax !== undefined) product.priceMax = String(input.priceMax);
    if (input.specsJson !== undefined) product.specsJson = input.specsJson;
    return this.products.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.get(id);
    await this.products.remove(product);
  }

  async getDetail(id: string) {
    const product = await this.get(id);
    const [variants, images] = await Promise.all([
      this.variants.find({
        where: { product: { id } },
        order: { createdAt: 'ASC' },
      }),
      this.images.find({
        where: { product: { id } },
        order: { sortOrder: 'ASC' },
      }),
    ]);
    return { ...product, variants, images };
  }

  async listVariants(productId: string): Promise<ProductVariant[]> {
    await this.get(productId);
    return this.variants.find({ where: { product: { id: productId } } });
  }

  async createVariant(
    productId: string,
    input: CreateVariantInput,
  ): Promise<ProductVariant> {
    const product = await this.get(productId);
    const variant = this.variants.create({
      product,
      sku: input.sku,
      title: input.title ?? null,
      price: String(input.price),
      stockQuantity: input.stockQuantity ?? 0,
      status: input.status ?? 'ACTIVE',
      specsJson: input.specsJson ?? {},
    });
    return this.variants.save(variant);
  }

  async addImages(
    productId: string,
    images: Array<{ url: string; sortOrder?: number; altText?: string | null }>,
  ): Promise<ProductImage[]> {
    const product = await this.get(productId);
    const entities = images.map((image, index) =>
      this.images.create({
        product,
        url: image.url,
        sortOrder: image.sortOrder ?? index,
        altText: image.altText ?? null,
      }),
    );
    return this.images.save(entities);
  }

  async listIdsByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    return this.products.find({ where: { id: In(ids) } });
  }
}
