import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductImageResponseDto } from './product-image-response.dto';
import { ProductResponseDto } from './product-response.dto';
import { ProductVariantResponseDto } from './product-variant-response.dto';

export class ProductDetailResponseDto extends ProductResponseDto {
  @Expose()
  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @Expose()
  @ApiProperty({ type: 'object', additionalProperties: true })
  specsJson: Record<string, unknown>;

  @Expose()
  @Type(() => ProductVariantResponseDto)
  @ApiProperty({ type: [ProductVariantResponseDto] })
  variants: ProductVariantResponseDto[];

  @Expose()
  @Type(() => ProductImageResponseDto)
  @ApiProperty({ type: [ProductImageResponseDto] })
  images: ProductImageResponseDto[];
}
