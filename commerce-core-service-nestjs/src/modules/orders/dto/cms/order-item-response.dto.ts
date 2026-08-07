import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrderItemResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  productId: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  variantId: string | null;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty()
  unitPrice: string;

  @Expose()
  @ApiProperty()
  totalPrice: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
