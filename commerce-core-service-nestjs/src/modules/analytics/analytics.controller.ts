import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Permissions } from '../auth/permissions.decorator';
import { AnalyticsResponseDto } from './dto/analytics-response.dto';

@Controller('cms/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Permissions('ai:analyst:chat')
  @ApiOkResponse({ type: [AnalyticsResponseDto] })
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
  @ApiOkResponse({ type: [AnalyticsResponseDto] })
  @Get('review-sentiment')
  reviewSentiment(
    @Query('categoryId') categoryId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.reviewSentiment({ categoryId, from, to });
  }

  @Permissions('ai:analyst:chat')
  @ApiOkResponse({ type: [AnalyticsResponseDto] })
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
  @ApiOkResponse({ type: [AnalyticsResponseDto] })
  @Get('category-summary')
  categorySummary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.analyticsService.categorySummary({ from, to });
  }
}
