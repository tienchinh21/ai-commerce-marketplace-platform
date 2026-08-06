import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  productId: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  buyerId: string | null;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  sellerId: string | null;

  @Expose()
  @ApiProperty()
  rating: number;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  title: string | null;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  content: string | null;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  sourceType: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  sourceReviewId: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
