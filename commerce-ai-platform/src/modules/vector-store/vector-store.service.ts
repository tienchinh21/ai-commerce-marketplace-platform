import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ProductEmbeddingSearchResult,
  SearchProductEmbeddingsInput,
  UpsertProductEmbeddingInput,
} from './vector-store.types';

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) {
    return 0;
  }
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denominator = Math.sqrt(magA) * Math.sqrt(magB);
  if (denominator === 0) {
    return 0;
  }
  return Math.max(-1, Math.min(1, dot / denominator));
}

@Injectable()
export class VectorStoreService implements OnModuleInit {
  private pgVectorAvailable = false;

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.ensureSchema();
    }
  }

  async ensureSchema(): Promise<void> {
    try {
      await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    } catch {
      // ignore
    }

    try {
      await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
      this.pgVectorAvailable = true;
    } catch {
      this.pgVectorAvailable = false;
    }

    await this.dataSource.query('CREATE SCHEMA IF NOT EXISTS ai');
    await this.dataSource.query('CREATE SCHEMA IF NOT EXISTS analytics');

    try {
      await this.dataSource.query(`
        CREATE OR REPLACE VIEW analytics.product_performance AS
        SELECT
          p.id AS product_id,
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
          COALESCE(SUM(oi.total_price), 0) AS total_revenue
        FROM marketplace.products p
        JOIN marketplace.categories c ON c.id = p.category_id
        JOIN marketplace.sellers s ON s.id = p.seller_id
        LEFT JOIN marketplace.order_items oi ON oi.product_id = p.id
        LEFT JOIN marketplace.orders o ON o.id = oi.order_id AND o.status NOT IN ('CANCELLED', 'REFUNDED')
        GROUP BY p.id, c.name, s.name;

        CREATE OR REPLACE VIEW analytics.review_sentiment AS
        SELECT
          p.id AS product_id,
          p.title,
          COUNT(r.id)::int AS total_reviews,
          COUNT(CASE WHEN r.rating >= 4 THEN 1 END)::int AS positive_count,
          COUNT(CASE WHEN r.rating = 3 THEN 1 END)::int AS neutral_count,
          COUNT(CASE WHEN r.rating <= 2 THEN 1 END)::int AS negative_count,
          COALESCE(ROUND(AVG(r.rating), 2), 0)::float AS avg_rating
        FROM marketplace.products p
        LEFT JOIN marketplace.reviews r ON r.product_id = p.id AND r.status = 'APPROVED'
        GROUP BY p.id;

        CREATE OR REPLACE VIEW analytics.seller_performance AS
        SELECT
          s.id AS seller_id,
          s.name AS seller_name,
          s.status,
          COUNT(DISTINCT p.id)::int AS product_count,
          COUNT(DISTINCT o.id)::int AS total_orders,
          COALESCE(SUM(oi.total_price), 0) AS total_revenue,
          COALESCE(ROUND(AVG(r.rating), 2), 0)::float AS avg_rating,
          COUNT(r.id)::int AS review_count
        FROM marketplace.sellers s
        LEFT JOIN marketplace.products p ON p.seller_id = s.id
        LEFT JOIN marketplace.order_items oi ON oi.product_id = p.id
        LEFT JOIN marketplace.orders o ON o.id = oi.order_id AND o.status NOT IN ('CANCELLED', 'REFUNDED')
        LEFT JOIN marketplace.reviews r ON r.seller_id = s.id AND r.status = 'APPROVED'
        GROUP BY s.id;

        CREATE OR REPLACE VIEW analytics.category_summary AS
        SELECT
          c.id AS category_id,
          c.name AS category_name,
          c.path,
          COUNT(DISTINCT p.id)::int AS total_products,
          COUNT(DISTINCT o.id)::int AS total_orders,
          COALESCE(SUM(oi.total_price), 0) AS total_revenue,
          COUNT(r.id)::int AS review_count,
          COALESCE(ROUND(AVG(r.rating), 2), 0)::float AS avg_rating
        FROM marketplace.categories c
        LEFT JOIN marketplace.products p ON p.category_id = c.id
        LEFT JOIN marketplace.order_items oi ON oi.product_id = p.id
        LEFT JOIN marketplace.orders o ON o.id = oi.order_id AND o.status NOT IN ('CANCELLED', 'REFUNDED')
        LEFT JOIN marketplace.reviews r ON r.product_id = p.id AND r.status = 'APPROVED'
        GROUP BY c.id;
      `);
    } catch {
      // Views will be created when marketplace tables exist
    }

    if (this.pgVectorAvailable) {
      await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS ai.product_embeddings (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id uuid NOT NULL UNIQUE,
          source_text text NOT NULL,
          source_text_hash varchar(64) NOT NULL,
          embedding vector(64) NOT NULL,
          embedding_model varchar(120) NOT NULL,
          embedding_version varchar(80) NOT NULL,
          metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
    } else {
      await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS ai.product_embeddings (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id uuid NOT NULL UNIQUE,
          source_text text NOT NULL,
          source_text_hash varchar(64) NOT NULL,
          embedding jsonb NOT NULL DEFAULT '[]'::jsonb,
          embedding_model varchar(120) NOT NULL,
          embedding_version varchar(80) NOT NULL,
          metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
    }

    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ai.review_ai_analysis (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        review_id uuid NOT NULL UNIQUE,
        product_id uuid NOT NULL,
        sentiment varchar(20) NOT NULL,
        sentiment_score numeric(5,4) NOT NULL,
        topics_json jsonb NOT NULL DEFAULT '[]'::jsonb,
        complaints_json jsonb NOT NULL DEFAULT '[]'::jsonb,
        praises_json jsonb NOT NULL DEFAULT '[]'::jsonb,
        model varchar(120) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ai.ai_query_logs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NULL,
        question text NOT NULL,
        generated_sql text NULL,
        safety_status varchar(80) NOT NULL,
        execution_status varchar(80) NOT NULL,
        row_count int NOT NULL DEFAULT 0,
        duration_ms int NOT NULL DEFAULT 0,
        error_message text NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  async upsertProductEmbedding(input: UpsertProductEmbeddingInput): Promise<void> {
    const vectorLiteral = `[${input.embedding.join(',')}]`;
    const embeddingValue = this.pgVectorAvailable ? vectorLiteral : JSON.stringify(input.embedding);

    const query = this.pgVectorAvailable
      ? `
        INSERT INTO ai.product_embeddings (
          product_id, source_text, source_text_hash, embedding,
          embedding_model, embedding_version, metadata_json, updated_at
        )
        VALUES ($1, $2, $3, $4::vector, $5, $6, $7, now())
        ON CONFLICT (product_id) DO UPDATE SET
          source_text = EXCLUDED.source_text,
          source_text_hash = EXCLUDED.source_text_hash,
          embedding = EXCLUDED.embedding,
          embedding_model = EXCLUDED.embedding_model,
          embedding_version = EXCLUDED.embedding_version,
          metadata_json = EXCLUDED.metadata_json,
          updated_at = now()
      `
      : `
        INSERT INTO ai.product_embeddings (
          product_id, source_text, source_text_hash, embedding,
          embedding_model, embedding_version, metadata_json, updated_at
        )
        VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, now())
        ON CONFLICT (product_id) DO UPDATE SET
          source_text = EXCLUDED.source_text,
          source_text_hash = EXCLUDED.source_text_hash,
          embedding = EXCLUDED.embedding,
          embedding_model = EXCLUDED.embedding_model,
          embedding_version = EXCLUDED.embedding_version,
          metadata_json = EXCLUDED.metadata_json,
          updated_at = now()
      `;

    await this.dataSource.query(query, [
      input.productId,
      input.sourceText,
      input.sourceTextHash,
      embeddingValue,
      input.embeddingModel,
      input.embeddingVersion,
      JSON.stringify(input.metadata),
    ]);
  }

  async searchProducts(
    input: SearchProductEmbeddingsInput,
  ): Promise<ProductEmbeddingSearchResult[]> {
    if (this.pgVectorAvailable) {
      try {
        const vectorLiteral = `[${input.embedding.join(',')}]`;
        const conditions: string[] = [];
        const params: unknown[] = [vectorLiteral];

        if (input.filters?.category && input.filters.category !== 'all') {
          params.push(`%${input.filters.category.toLowerCase()}%`);
          conditions.push(`LOWER(metadata_json->>'category') LIKE $${params.length}`);
        }
        if (input.filters?.brand) {
          params.push(`%${input.filters.brand.toLowerCase()}%`);
          conditions.push(`LOWER(metadata_json->>'brand') LIKE $${params.length}`);
        }
        if (input.filters?.priceMin !== undefined) {
          params.push(input.filters.priceMin);
          conditions.push(`(metadata_json->>'priceMin')::numeric >= $${params.length}`);
        }
        if (input.filters?.priceMax !== undefined) {
          params.push(input.filters.priceMax);
          conditions.push(`(metadata_json->>'priceMax')::numeric <= $${params.length}`);
        }
        if (input.filters?.ratingMin !== undefined) {
          params.push(input.filters.ratingMin);
          conditions.push(`(metadata_json->>'ratingAvg')::numeric >= $${params.length}`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        params.push(input.limit);

        const sql = `
          SELECT
            product_id AS "productId",
            source_text AS "sourceText",
            metadata_json AS metadata,
            1 - (embedding <=> $1::vector) AS score
          FROM ai.product_embeddings
          ${whereClause}
          ORDER BY embedding <=> $1::vector
          LIMIT $${params.length}
        `;

        const rows = await this.dataSource.query(sql, params);
        return rows.map((r: { productId: string; sourceText: string; metadata: Record<string, unknown>; score: string | number }) => ({
          productId: r.productId,
          sourceText: r.sourceText,
          metadata: r.metadata ?? {},
          score: Number(r.score),
        }));
      } catch {
        // fallback to memory search if query fails
      }
    }

    // Fallback in-memory search
    const rows = await this.dataSource.query(`
      SELECT
        product_id AS "productId",
        source_text AS "sourceText",
        embedding,
        metadata_json AS metadata
      FROM ai.product_embeddings
    `);

    const scored: ProductEmbeddingSearchResult[] = [];
    for (const row of rows) {
      const metadata = row.metadata ?? {};
      if (input.filters?.category && input.filters.category !== 'all') {
        const cat = String(metadata.category ?? '').toLowerCase();
        if (!cat.includes(input.filters.category.toLowerCase())) continue;
      }
      if (input.filters?.brand) {
        const br = String(metadata.brand ?? '').toLowerCase();
        if (!br.includes(input.filters.brand.toLowerCase())) continue;
      }
      if (input.filters?.priceMin !== undefined) {
        const p = Number(metadata.priceMin ?? 0);
        if (p < input.filters.priceMin) continue;
      }
      if (input.filters?.priceMax !== undefined) {
        const p = Number(metadata.priceMax ?? 0);
        if (p > input.filters.priceMax) continue;
      }
      if (input.filters?.ratingMin !== undefined) {
        const r = Number(metadata.ratingAvg ?? 0);
        if (r < input.filters.ratingMin) continue;
      }

      let rowVector: number[] = [];
      if (Array.isArray(row.embedding)) {
        rowVector = row.embedding;
      } else if (typeof row.embedding === 'string') {
        try {
          rowVector = JSON.parse(row.embedding);
        } catch {
          // parse '[1,2,3]'
          rowVector = row.embedding
            .replace(/[\[\]]/g, '')
            .split(',')
            .map((v: string) => Number(v.trim()))
            .filter((v: number) => !isNaN(v));
        }
      }

      const score = cosineSimilarity(input.embedding, rowVector);
      scored.push({
        productId: row.productId,
        sourceText: row.sourceText,
        metadata,
        score,
      });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, input.limit);
  }
}
