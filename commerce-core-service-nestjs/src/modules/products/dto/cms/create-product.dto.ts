import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  sellerId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Smartphone X' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'smartphone-x' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'TechBrand' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'A flagship smartphone with OLED display.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 499.99 })
  @IsOptional()
  @IsNumber()
  priceMin?: number;

  @ApiPropertyOptional({ example: 799.99 })
  @IsOptional()
  @IsNumber()
  priceMax?: number;

  @ApiPropertyOptional({
    example: { color: 'black', storage: '256GB' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  specsJson?: Record<string, unknown>;
}
