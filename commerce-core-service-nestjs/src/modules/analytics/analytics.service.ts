import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  async productPerformance(params: {
    limit?: number;
    from?: string;
    to?: string;
  }): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT
         p.id,
         p.title,
         p.brand,
         c.name AS category_name,
         s.name AS seller_name,
         p.price_min,
         p.price_max,
         p.rating_avg,
         p.review_count,
         COUNT(DISTINCT oi.order_id)::int AS order_count,
         COALESCE(SUM(oi.quantity), 0)::int AS units_sold,
         COALESCE(SUM(oi.total_price), 0) AS revenue
       FROM marketplace.products p
       JOIN marketplace.categories c ON c.id = p.category_id
       JOIN marketplace.sellers s ON s.id = p.seller_id
       LEFT JOIN marketplace.order_items oi ON oi.product_id = p.id
       LEFT JOIN marketplace.orders o ON o.id = oi.order_id
         AND o.status NOT IN ('CANCELLED', 'REFUNDED')
         AND ($2::timestamptz IS NULL OR o.ordered_at >= $2::timestamptz)
         AND ($3::timestamptz IS NULL OR o.ordered_at <= $3::timestamptz)
       GROUP BY p.id, c.name, s.name
       ORDER BY revenue DESC
       LIMIT $1`,
      [params.limit ?? 50, params.from ?? null, params.to ?? null],
    );
  }

  async reviewSentiment(params: {
    categoryId?: string;
    from?: string;
    to?: string;
  }): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT
         r.rating,
         COUNT(*)::int AS review_count,
         COALESCE(ROUND(AVG(r.rating) OVER (), 2), 0)::float AS avg_rating
       FROM marketplace.reviews r
       JOIN marketplace.products p ON p.id = r.product_id
       WHERE r.status = 'APPROVED'
         AND ($1::uuid IS NULL OR p.category_id = $1::uuid)
         AND ($2::timestamptz IS NULL OR r.created_at >= $2::timestamptz)
         AND ($3::timestamptz IS NULL OR r.created_at <= $3::timestamptz)
       GROUP BY r.rating
       ORDER BY r.rating DESC`,
      [params.categoryId ?? null, params.from ?? null, params.to ?? null],
    );
  }

  async sellerPerformance(params: {
    limit?: number;
    from?: string;
    to?: string;
  }): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT
         s.id,
         s.name,
         s.status,
         COUNT(DISTINCT p.id)::int AS product_count,
         COUNT(DISTINCT o.id)::int AS order_count,
         COALESCE(SUM(oi.total_price), 0) AS revenue,
         COALESCE(AVG(r.rating), 0)::float AS avg_rating,
         COUNT(r.id)::int AS review_count
       FROM marketplace.sellers s
       LEFT JOIN marketplace.products p ON p.seller_id = s.id
       LEFT JOIN marketplace.order_items oi ON oi.product_id = p.id
       LEFT JOIN marketplace.orders o ON o.id = oi.order_id
         AND o.status NOT IN ('CANCELLED', 'REFUNDED')
         AND ($2::timestamptz IS NULL OR o.ordered_at >= $2::timestamptz)
         AND ($3::timestamptz IS NULL OR o.ordered_at <= $3::timestamptz)
       LEFT JOIN marketplace.reviews r ON r.seller_id = s.id AND r.status = 'APPROVED'
       GROUP BY s.id
       ORDER BY revenue DESC
       LIMIT $1`,
      [params.limit ?? 50, params.from ?? null, params.to ?? null],
    );
  }

  async categorySummary(params: {
    from?: string;
    to?: string;
  }): Promise<Record<string, unknown>[]> {
    return this.dataSource.query(
      `SELECT
         c.id,
         c.name,
         c.path,
         COUNT(DISTINCT p.id)::int AS product_count,
         COUNT(DISTINCT o.id)::int AS order_count,
         COALESCE(SUM(oi.total_price), 0) AS revenue,
         COUNT(r.id)::int AS review_count,
         COALESCE(AVG(r.rating), 0)::float AS avg_rating
       FROM marketplace.categories c
       LEFT JOIN marketplace.products p ON p.category_id = c.id
       LEFT JOIN marketplace.order_items oi ON oi.product_id = p.id
       LEFT JOIN marketplace.orders o ON o.id = oi.order_id
         AND o.status NOT IN ('CANCELLED', 'REFUNDED')
         AND ($1::timestamptz IS NULL OR o.ordered_at >= $1::timestamptz)
         AND ($2::timestamptz IS NULL OR o.ordered_at <= $2::timestamptz)
       LEFT JOIN marketplace.reviews r ON r.product_id = p.id AND r.status = 'APPROVED'
       GROUP BY c.id
       ORDER BY revenue DESC`,
      [params.from ?? null, params.to ?? null],
    );
  }
}
