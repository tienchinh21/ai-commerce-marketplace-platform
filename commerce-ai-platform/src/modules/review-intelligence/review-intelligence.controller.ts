import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewIntelligenceService } from './review-intelligence.service';
import {
  ProductReviewSummaryResponseDto,
  ReviewAnalysisResponseDto,
  ReviewAnalysisRunResponseDto,
} from './review-intelligence.dto';

@ApiTags('AI Review Intelligence')
@Controller('ai')
export class ReviewIntelligenceController {
  constructor(private readonly reviewService: ReviewIntelligenceService) {}

  @Post('reviews/analyze/run')
  @ApiOperation({ summary: 'Chạy phân tích AI cho tất cả đánh giá' })
  @ApiResponse({ status: 200, type: ReviewAnalysisRunResponseDto })
  async runAll(): Promise<ReviewAnalysisRunResponseDto> {
    return this.reviewService.analyzeAll();
  }

  @Post('reviews/:reviewId/analyze')
  @ApiOperation({ summary: 'Phân tích AI cho 1 đánh giá' })
  @ApiResponse({ status: 200, type: ReviewAnalysisResponseDto })
  async analyzeOne(
    @Param('reviewId') reviewId: string,
  ): Promise<ReviewAnalysisResponseDto> {
    return this.reviewService.analyzeReview(reviewId);
  }

  @Get('products/:productId/review-summary')
  @ApiOperation({ summary: 'Lấy tổng hợp phân tích đánh giá của sản phẩm' })
  @ApiResponse({ status: 200, type: ProductReviewSummaryResponseDto })
  async getProductSummary(
    @Param('productId') productId: string,
  ): Promise<ProductReviewSummaryResponseDto> {
    return this.reviewService.getProductSummary(productId);
  }

  @Get('reviews/analysis')
  @ApiOperation({ summary: 'Lấy danh sách các đánh giá đã được phân tích' })
  @ApiResponse({ status: 200, type: [ReviewAnalysisResponseDto] })
  async listAnalysis(): Promise<ReviewAnalysisResponseDto[]> {
    return this.reviewService.listAnalysis();
  }
}
