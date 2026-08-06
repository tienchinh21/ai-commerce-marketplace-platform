import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  sellerId: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  brand: string | null;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  priceMin: string;

  @Expose()
  @ApiProperty()
  priceMax: string;

  @Expose()
  @ApiProperty()
  ratingAvg: string;

  @Expose()
  @ApiProperty()
  reviewCount: number;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
