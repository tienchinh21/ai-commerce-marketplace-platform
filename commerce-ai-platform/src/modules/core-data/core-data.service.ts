import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CoreProductRecord, CoreReviewRecord } from './core-data.types';

export function buildProductSourceText(product: CoreProductRecord): string {
  const specs = Object.entries(product.specsJson ?? {})
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join('; ');

  return [
    `title: ${product.title}`,
    product.brand ? `brand: ${product.brand}` : '',
    product.categoryName ? `category: ${product.categoryName}` : '',
    product.categoryPath ? `category_path: ${product.categoryPath}` : '',
    product.sellerName ? `seller: ${product.sellerName}` : '',
    product.description ? `description: ${product.description}` : '',
    specs ? `specs: ${specs}` : '',
    `rating: ${product.ratingAvg ?? 0}`,
    `reviews: ${product.reviewCount ?? 0}`,
  ]
    .filter(Boolean)
    .join('\n');
}

@Injectable()
export class CoreDataService {
  constructor(private readonly dataSource: DataSource) {}

  async listActiveProducts(): Promise<CoreProductRecord[]> {
    const query = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.brand,
        p.description,
        p.status,
        p.price_min AS "priceMin",
        p.price_max AS "priceMax",
        p.rating_avg AS "ratingAvg",
        p.review_count AS "reviewCount",
        c.name AS "categoryName",
        c.path AS "categoryPath",
        s.name AS "sellerName",
        p.specs_json AS "specsJson"
      FROM marketplace.products p
      LEFT JOIN marketplace.categories c ON c.id = p.category_id
      LEFT JOIN marketplace.sellers s ON s.id = p.seller_id
      WHERE p.status = 'ACTIVE'
      ORDER BY p.created_at DESC
    `;
    return this.dataSource.query(query);
  }

  async getProductById(id: string): Promise<CoreProductRecord | null> {
    const query = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.brand,
        p.description,
        p.status,
        p.price_min AS "priceMin",
        p.price_max AS "priceMax",
        p.rating_avg AS "ratingAvg",
        p.review_count AS "reviewCount",
        c.name AS "categoryName",
        c.path AS "categoryPath",
        s.name AS "sellerName",
        p.specs_json AS "specsJson"
      FROM marketplace.products p
      LEFT JOIN marketplace.categories c ON c.id = p.category_id
      LEFT JOIN marketplace.sellers s ON s.id = p.seller_id
      WHERE p.id = $1
      LIMIT 1
    `;
    const rows = await this.dataSource.query(query, [id]);
    return rows[0] ?? null;
  }

  async listApprovedReviews(productId?: string): Promise<CoreReviewRecord[]> {
    let query = `
      SELECT
        r.id,
        r.product_id AS "productId",
        r.rating,
        r.title,
        r.content,
        r.status
      FROM marketplace.reviews r
      WHERE r.status = 'APPROVED'
    `;
    const params: unknown[] = [];
    if (productId) {
      params.push(productId);
      query += ` AND r.product_id = $1`;
    }
    query += ` ORDER BY r.created_at DESC`;
    return this.dataSource.query(query, params);
  }

  async getReviewById(id: string): Promise<CoreReviewRecord | null> {
    const query = `
      SELECT
        r.id,
        r.product_id AS "productId",
        r.rating,
        r.title,
        r.content,
        r.status
      FROM marketplace.reviews r
      WHERE r.id = $1
      LIMIT 1
    `;
    const rows = await this.dataSource.query(query, [id]);
    return rows[0] ?? null;
  }
}
