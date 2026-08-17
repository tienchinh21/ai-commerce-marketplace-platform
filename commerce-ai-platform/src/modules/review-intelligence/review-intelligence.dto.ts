import { ApiProperty } from '@nestjs/swagger';

export class ReviewAnalysisResponseDto {
  @ApiProperty({ example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' })
  reviewId: string;

  @ApiProperty({ example: '6ba7b810-9dad-11d1-80b4-00c04fd430c9' })
  productId: string;

  @ApiProperty({ enum: ['positive', 'neutral', 'negative'], example: 'positive' })
  sentiment: 'positive' | 'neutral' | 'negative';

  @ApiProperty({ example: 0.95 })
  sentimentScore: number;

  @ApiProperty({ example: ['Chất lượng sản phẩm', 'Giao hàng'] })
  topics: string[];

  @ApiProperty({ example: [] })
  complaints: string[];

  @ApiProperty({ example: ['quality', 'delivery'] })
  praises: string[];

  @ApiProperty({ example: 'rule-based-v1' })
  model: string;
}

export class ReviewAnalysisRunResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'run-123' })
  runId: string;

  @ApiProperty({ example: 50 })
  totalReviews: number;

  @ApiProperty({ example: 50 })
  analyzedCount: number;

  @ApiProperty({ example: 0 })
  failedCount: number;

  @ApiProperty({ example: 'Đã phân tích 50 đánh giá thành công' })
  message: string;
}

export class SentimentBreakdownDto {
  @ApiProperty({ example: 80 })
  positive: number;

  @ApiProperty({ example: 15 })
  neutral: number;

  @ApiProperty({ example: 5 })
  negative: number;
}

export class ProductReviewSummaryResponseDto {
  @ApiProperty({ example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' })
  productId: string;

  @ApiProperty({ type: () => SentimentBreakdownDto })
  sentimentBreakdown: SentimentBreakdownDto;

  @ApiProperty({ example: ['Chất lượng sản phẩm', 'Giao hàng'] })
  topTopics: string[];

  @ApiProperty({ example: ['Đóng gói móp méo'] })
  commonComplaints: string[];

  @ApiProperty({ example: ['Chất lượng xịn', 'Giao siêu nhanh'] })
  commonPraises: string[];

  @ApiProperty({ example: 100 })
  sourceReviewCount: number;

  @ApiProperty({ example: 0.92 })
  confidence: number;
}
