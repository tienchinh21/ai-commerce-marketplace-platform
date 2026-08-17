import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';
import { CoreDataService } from '../core-data/core-data.service';
import { CHAT_PROVIDER, ChatProvider, ReviewAnalysisInput, ReviewAnalysisResult } from '../providers/chat-provider.interface';
import {
  ProductReviewSummaryResponseDto,
  ReviewAnalysisResponseDto,
  ReviewAnalysisRunResponseDto,
} from './review-intelligence.dto';

@Injectable()
export class ReviewIntelligenceService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly coreData: CoreDataService,
    @Inject(CHAT_PROVIDER)
    private readonly chatProvider: ChatProvider,
  ) {}

  async analyzeReviewText(input: ReviewAnalysisInput): Promise<ReviewAnalysisResult> {
    return this.chatProvider.analyzeReview(input);
  }

  async analyzeReview(reviewId: string): Promise<ReviewAnalysisResponseDto> {
    const review = await this.coreData.getReviewById(reviewId);
    if (!review) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID: ${reviewId}`);
    }

    const analysis = await this.chatProvider.analyzeReview({
      title: review.title,
      content: review.content,
      rating: review.rating,
    });

    await this.dataSource.query(
      `
        INSERT INTO ai.review_ai_analysis (
          review_id, product_id, sentiment, sentiment_score,
          topics_json, complaints_json, praises_json, model, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
        ON CONFLICT (review_id) DO UPDATE SET
          sentiment = EXCLUDED.sentiment,
          sentiment_score = EXCLUDED.sentiment_score,
          topics_json = EXCLUDED.topics_json,
          complaints_json = EXCLUDED.complaints_json,
          praises_json = EXCLUDED.praises_json,
          model = EXCLUDED.model,
          updated_at = now()
      `,
      [
        review.id,
        review.productId,
        analysis.sentiment,
        analysis.sentimentScore,
        JSON.stringify(analysis.topics),
        JSON.stringify(analysis.complaints),
        JSON.stringify(analysis.praises),
        'rule-based-v1',
      ],
    );

    return {
      reviewId: review.id,
      productId: review.productId,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      topics: analysis.topics,
      complaints: analysis.complaints,
      praises: analysis.praises,
      model: 'rule-based-v1',
    };
  }

  async analyzeAll(): Promise<ReviewAnalysisRunResponseDto> {
    const runId = randomUUID();
    const reviews = await this.coreData.listApprovedReviews();
    let analyzedCount = 0;
    let failedCount = 0;

    for (const review of reviews) {
      try {
        const analysis = await this.chatProvider.analyzeReview({
          title: review.title,
          content: review.content,
          rating: review.rating,
        });

        await this.dataSource.query(
          `
            INSERT INTO ai.review_ai_analysis (
              review_id, product_id, sentiment, sentiment_score,
              topics_json, complaints_json, praises_json, model, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
            ON CONFLICT (review_id) DO UPDATE SET
              sentiment = EXCLUDED.sentiment,
              sentiment_score = EXCLUDED.sentiment_score,
              topics_json = EXCLUDED.topics_json,
              complaints_json = EXCLUDED.complaints_json,
              praises_json = EXCLUDED.praises_json,
              model = EXCLUDED.model,
              updated_at = now()
          `,
          [
            review.id,
            review.productId,
            analysis.sentiment,
            analysis.sentimentScore,
            JSON.stringify(analysis.topics),
            JSON.stringify(analysis.complaints),
            JSON.stringify(analysis.praises),
            'rule-based-v1',
          ],
        );
        analyzedCount++;
      } catch {
        failedCount++;
      }
    }

    return {
      success: failedCount === 0,
      runId,
      totalReviews: reviews.length,
      analyzedCount,
      failedCount,
      message: `Đã phân tích ${analyzedCount}/${reviews.length} đánh giá.`,
    };
  }

  async getProductSummary(productId: string): Promise<ProductReviewSummaryResponseDto> {
    const rows = await this.dataSource.query(
      `
        SELECT
          sentiment,
          sentiment_score AS "sentimentScore",
          topics_json AS topics,
          complaints_json AS complaints,
          praises_json AS praises
        FROM ai.review_ai_analysis
        WHERE product_id = $1
      `,
      [productId],
    );

    if (rows.length === 0) {
      // Fallback: run on-the-fly for existing approved reviews of this product
      const reviews = await this.coreData.listApprovedReviews(productId);
      if (reviews.length === 0) {
        return {
          productId,
          sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
          topTopics: [],
          commonComplaints: [],
          commonPraises: [],
          sourceReviewCount: 0,
          confidence: 0,
        };
      }

      for (const r of reviews) {
        await this.analyzeReview(r.id);
      }
      return this.getProductSummary(productId);
    }

    let pos = 0;
    let neu = 0;
    let neg = 0;
    const topicCount: Record<string, number> = {};
    const complaintCount: Record<string, number> = {};
    const praiseCount: Record<string, number> = {};

    for (const r of rows) {
      if (r.sentiment === 'positive') pos++;
      else if (r.sentiment === 'negative') neg++;
      else neu++;

      const topics = Array.isArray(r.topics) ? r.topics : [];
      for (const t of topics) topicCount[t] = (topicCount[t] ?? 0) + 1;

      const complaints = Array.isArray(r.complaints) ? r.complaints : [];
      for (const c of complaints) complaintCount[c] = (complaintCount[c] ?? 0) + 1;

      const praises = Array.isArray(r.praises) ? r.praises : [];
      for (const p of praises) praiseCount[p] = (praiseCount[p] ?? 0) + 1;
    }

    const topTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const commonComplaints = Object.entries(complaintCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const commonPraises = Object.entries(praiseCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    return {
      productId,
      sentimentBreakdown: { positive: pos, neutral: neu, negative: neg },
      topTopics,
      commonComplaints,
      commonPraises,
      sourceReviewCount: rows.length,
      confidence: Number((0.85 + Math.min(rows.length * 0.02, 0.14)).toFixed(2)),
    };
  }

  async listAnalysis(): Promise<ReviewAnalysisResponseDto[]> {
    const rows = await this.dataSource.query(`
      SELECT
        review_id AS "reviewId",
        product_id AS "productId",
        sentiment,
        sentiment_score AS "sentimentScore",
        topics_json AS topics,
        complaints_json AS complaints,
        praises_json AS praises,
        model
      FROM ai.review_ai_analysis
      ORDER BY updated_at DESC
      LIMIT 100
    `);

    return rows.map((r: {
      reviewId: string;
      productId: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      sentimentScore: string | number;
      topics: string[];
      complaints: string[];
      praises: string[];
      model: string;
    }) => ({
      reviewId: r.reviewId,
      productId: r.productId,
      sentiment: r.sentiment,
      sentimentScore: Number(r.sentimentScore),
      topics: Array.isArray(r.topics) ? r.topics : [],
      complaints: Array.isArray(r.complaints) ? r.complaints : [],
      praises: Array.isArray(r.praises) ? r.praises : [],
      model: r.model,
    }));
  }
}
