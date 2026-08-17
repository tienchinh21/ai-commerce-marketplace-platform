import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductIndexingService } from './product-indexing.service';
import { ProductIndexingRunResponseDto } from './indexing.dto';

@ApiTags('AI Indexing')
@Controller('ai/indexing/products')
export class ProductIndexingController {
  constructor(private readonly indexingService: ProductIndexingService) {}

  @Post('run')
  @ApiOperation({ summary: 'Chạy indexing toàn bộ sản phẩm vào Vector Store' })
  @ApiResponse({ status: 200, type: ProductIndexingRunResponseDto })
  async runAll(): Promise<ProductIndexingRunResponseDto> {
    return this.indexingService.runAll();
  }

  @Post(':productId/run')
  @ApiOperation({ summary: 'Chạy indexing cho 1 sản phẩm cụ thể' })
  @ApiResponse({ status: 200, type: ProductIndexingRunResponseDto })
  async runOne(
    @Param('productId') productId: string,
  ): Promise<ProductIndexingRunResponseDto> {
    return this.indexingService.runOne(productId);
  }

  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Lấy trạng thái job indexing' })
  getJobStatus(@Param('jobId') jobId: string): { jobId: string; status: string } {
    return {
      jobId,
      status: 'COMPLETED',
    };
  }
}
