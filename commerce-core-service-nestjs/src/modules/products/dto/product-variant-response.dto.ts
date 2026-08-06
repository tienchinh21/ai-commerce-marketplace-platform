import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductVariantResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  sku: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  title: string | null;

  @Expose()
  @ApiProperty()
  price: string;

  @Expose()
  @ApiProperty()
  stockQuantity: number;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: 'object', additionalProperties: true })
  specsJson: Record<string, unknown>;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
