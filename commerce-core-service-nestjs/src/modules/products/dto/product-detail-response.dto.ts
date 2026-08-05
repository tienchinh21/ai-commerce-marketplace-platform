import { ApiProperty } from '@nestjs/swagger';
import { ProductVariant } from '../product-variant.entity';
import { ProductImage } from '../product-image.entity';

export class ProductDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true, type: String })
  brand: string | null;

  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty()
  priceMin: string;

  @ApiProperty()
  priceMax: string;

  @ApiProperty()
  ratingAvg: string;

  @ApiProperty()
  reviewCount: number;

  @ApiProperty({ type: 'object', additionalProperties: true })
  specsJson: Record<string, unknown>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [ProductVariant] })
  variants: ProductVariant[];

  @ApiProperty({ type: [ProductImage] })
  images: ProductImage[];
}
