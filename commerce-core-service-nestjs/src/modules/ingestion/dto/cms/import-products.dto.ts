import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class ImportProductItemDto {
  @ApiProperty({ example: 'SRC-PROD-001' })
  @IsString()
  sourceProductId: string;

  @ApiProperty({ example: 'Imported Smartphone X' })
  @IsString()
  title: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  sellerId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ example: 499.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional({ example: 799.99 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @ApiPropertyOptional({ example: 'TechBrand' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'Imported flagship smartphone.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: { color: 'black', storage: '256GB' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  specs?: Record<string, unknown>;
}

export class ImportProductsDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  dataSourceId: string;

  @ApiProperty({
    type: () => [ImportProductItemDto],
    example: [
      {
        sourceProductId: 'SRC-PROD-001',
        title: 'Imported Smartphone X',
        sellerId: '550e8400-e29b-41d4-a716-446655440000',
        categoryId: '550e8400-e29b-41d4-a716-446655440001',
        priceMin: 499.99,
        priceMax: 799.99,
        brand: 'TechBrand',
        description: 'Imported flagship smartphone.',
        specs: { color: 'black', storage: '256GB' },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportProductItemDto)
  items: ImportProductItemDto[];
}
