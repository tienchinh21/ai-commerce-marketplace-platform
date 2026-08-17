import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AnalystChatRequestDto {
  @ApiProperty({ example: 'Top 10 sản phẩm có doanh thu cao nhất' })
  @IsString()
  @IsNotEmpty({ message: 'Câu hỏi không được để trống' })
  question: string;

  @ApiProperty({ required: false, example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class AnalystChatResponseDto {
  @ApiProperty({ example: 'Dưới đây là danh sách top sản phẩm theo doanh thu' })
  answer: string;

  @ApiProperty({ required: false, example: 'SELECT product_id, title, total_revenue FROM analytics.product_performance LIMIT 10' })
  generatedSql?: string;

  @ApiProperty({ example: 'ALLOWED' })
  safetyStatus: string;

  @ApiProperty({ enum: ['NOT_EXECUTED', 'SUCCESS', 'FAILED'], example: 'SUCCESS' })
  executionStatus: 'NOT_EXECUTED' | 'SUCCESS' | 'FAILED';

  @ApiProperty({ example: ['product_id', 'title', 'total_revenue'] })
  columns: string[];

  @ApiProperty({ example: [{ product_id: '1', title: 'Áo thun', total_revenue: 5000000 }] })
  rows: Record<string, unknown>[];

  @ApiProperty({ required: false, example: 'log-123' })
  queryLogId?: string;
}
