import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

export interface ListReviewsQuery {
  productId?: string;
  buyerId?: string;
  sellerId?: string;
  status?: string;
  minRating?: number;
  page?: number;
  pageSize?: number;
}

export interface CreateReviewInput {
  productId: string;
  buyerId?: string | null;
  sellerId?: string | null;
  rating: number;
  title?: string | null;
  content?: string | null;
  status?: string;
  sourceType?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string | null;
  content?: string | null;
  status?: string;
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
  ) {}

  async list(query: ListReviewsQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const qb = this.reviews.createQueryBuilder('review');

    if (query.productId) {
      qb.andWhere('review.productId = :productId', {
        productId: query.productId,
      });
    }
    if (query.buyerId) {
      qb.andWhere('review.buyerId = :buyerId', { buyerId: query.buyerId });
    }
    if (query.sellerId) {
      qb.andWhere('review.sellerId = :sellerId', { sellerId: query.sellerId });
    }
    if (query.status) {
      qb.andWhere('review.status = :status', { status: query.status });
    }
    if (query.minRating !== undefined) {
      qb.andWhere('review.rating >= :minRating', {
        minRating: query.minRating,
      });
    }

    const [items, total] = await qb
      .orderBy('review.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }

  async get(id: string): Promise<Review> {
    const review = await this.reviews.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException({
        code: ApiErrorCode.REVIEW_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.REVIEW_NOT_FOUND],
      });
    }
    return review;
  }

  async create(input: CreateReviewInput): Promise<Review> {
    const review = this.reviews.create({
      productId: input.productId,
      buyerId: input.buyerId ?? null,
      sellerId: input.sellerId ?? null,
      rating: input.rating,
      title: input.title ?? null,
      content: input.content ?? null,
      status: input.status ?? 'APPROVED',
      sourceType: input.sourceType ?? 'manual',
    });
    return this.reviews.save(review);
  }

  async update(id: string, input: UpdateReviewInput): Promise<Review> {
    const review = await this.get(id);
    if (input.rating !== undefined) review.rating = input.rating;
    if (input.title !== undefined) review.title = input.title;
    if (input.content !== undefined) review.content = input.content;
    if (input.status !== undefined) review.status = input.status;
    return this.reviews.save(review);
  }

  async countByProduct(productId: string): Promise<number> {
    return this.reviews.count({ where: { productId, status: 'APPROVED' } });
  }
}
