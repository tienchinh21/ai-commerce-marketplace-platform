import { Test } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController response shape', () => {
  let controller: ReviewsController;
  const reviewsService = {
    list: jest.fn(),
    create: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [{ provide: ReviewsService, useValue: reviewsService }],
    }).compile();
    controller = moduleRef.get(ReviewsController);
  });

  it('update returns only success acknowledgement with no review content', async () => {
    reviewsService.update.mockResolvedValue({
      id: 'review-1',
      rating: 5,
      title: 'Excellent product',
      content: 'I love this product. Highly recommended!',
      status: 'ACTIVE',
    });

    await expect(
      controller.update('00000000-0000-0000-0000-000000000001', {
        content: 'Updated content',
      }),
    ).resolves.toEqual({
      success: true,
      message: 'Cập nhật đánh giá thành công.',
    });
  });

  it('create returns only success acknowledgement with no review content', async () => {
    reviewsService.create.mockResolvedValue({
      id: 'review-1',
      productId: 'prod-1',
      buyerId: null,
      sellerId: null,
      rating: 5,
      title: 'Excellent product',
      content: 'I love this product. Highly recommended!',
      status: 'ACTIVE',
      sourceType: 'manual',
      sourceReviewId: null,
    });

    await expect(
      controller.create({
        productId: 'prod-1',
        rating: 5,
        title: 'Excellent product',
        content: 'I love this product. Highly recommended!',
      }),
    ).resolves.toEqual({
      success: true,
      id: 'review-1',
      message: 'Tạo đánh giá thành công.',
    });
  });

  it('list returns reviews mapped to the review response DTO', async () => {
    reviewsService.list.mockResolvedValue({
      items: [
        {
          id: 'review-1',
          productId: 'prod-1',
          buyerId: null,
          sellerId: null,
          rating: 5,
          title: 'Excellent product',
          content: 'I love this product. Highly recommended!',
          status: 'ACTIVE',
          sourceType: 'manual',
          sourceReviewId: null,
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
        id: 'review-1',
        productId: 'prod-1',
        buyerId: null,
        sellerId: null,
        rating: 5,
        title: 'Excellent product',
        content: 'I love this product. Highly recommended!',
        status: 'ACTIVE',
        sourceType: 'manual',
        sourceReviewId: null,
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
  });
});
