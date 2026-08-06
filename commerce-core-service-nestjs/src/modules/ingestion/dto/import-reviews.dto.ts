import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class ImportReviewItemDto {
  @ApiProperty({ example: 'SRC-REV-001' })
  @IsString()
  sourceReviewId: string;

  @ApiProperty({ example: 'SRC-PROD-001' })
  @IsString()
  sourceProductId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  productId: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsOptional()
  @IsString()
  buyerId?: string;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsOptional()
  @IsString()
  sellerId?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Excellent product' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'I love this product. Highly recommended!' })
  @IsOptional()
  @IsString()
  content?: string;
}

export class ImportReviewsDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  dataSourceId: string;

  @ApiProperty({
    type: () => [ImportReviewItemDto],
    example: [
      {
        sourceReviewId: 'SRC-REV-001',
        sourceProductId: 'SRC-PROD-001',
        productId: '550e8400-e29b-41d4-a716-446655440000',
        buyerId: '550e8400-e29b-41d4-a716-446655440001',
        sellerId: '550e8400-e29b-41d4-a716-446655440002',
        rating: 5,
        title: 'Excellent product',
        content: 'I love this product. Highly recommended!',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportReviewItemDto)
  items: ImportReviewItemDto[];
}
