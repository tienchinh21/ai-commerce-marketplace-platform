import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDataSourceDto {
  @ApiPropertyOptional({ example: 'Shopee Store A' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'ecommerce_api' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'https://api.shopee.example.com' })
  @IsOptional()
  @IsString()
  baseUrl?: string;

  @ApiPropertyOptional({ example: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    example: { apiKey: 'secret-key', shopId: '12345' },
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  configJson?: Record<string, unknown>;
}
