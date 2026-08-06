import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'SKU-12345' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ example: 'Smartphone X - 256GB Black' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 699.99 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: { color: 'black', storage: '256GB' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  specsJson?: Record<string, unknown>;
}
