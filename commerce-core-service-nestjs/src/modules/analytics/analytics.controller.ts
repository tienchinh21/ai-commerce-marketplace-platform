import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Permissions } from '../auth/permissions.decorator';

@Controller('cms/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Permissions('ai:analyst:chat')
  @Get('product-performance')
  productPerformance(
    @Query('limit') limit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.productPerformance({
      limit: limit ? Number(limit) : undefined,
      from,
      to,
    });
  }

  @Permissions('ai:analyst:chat')
  @Get('review-sentiment')
  reviewSentiment(
    @Query('categoryId') categoryId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.reviewSentiment({ categoryId, from, to });
  }

  @Permissions('ai:analyst:chat')
  @Get('seller-performance')
  sellerPerformance(
    @Query('limit') limit?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.sellerPerformance({
      limit: limit ? Number(limit) : undefined,
      from,
      to,
    });
  }

  @Permissions('ai:analyst:chat')
  @Get('category-summary')
  categorySummary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.analyticsService.categorySummary({ from, to });
  }
}
