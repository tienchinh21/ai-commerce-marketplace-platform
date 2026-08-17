import { ApiProperty } from '@nestjs/swagger';

export class ProductIndexingRunResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'run-123' })
  runId: string;

  @ApiProperty({ enum: ['COMPLETED', 'FAILED'], example: 'COMPLETED' })
  status: 'COMPLETED' | 'FAILED';

  @ApiProperty({ example: 10 })
  totalProducts: number;

  @ApiProperty({ example: 10 })
  indexedCount: number;

  @ApiProperty({ example: 0 })
  skippedCount: number;

  @ApiProperty({ example: 0 })
  failedCount: number;

  @ApiProperty({ example: 'Đã hoàn tất index sản phẩm vào Vector Store' })
  message: string;
}
