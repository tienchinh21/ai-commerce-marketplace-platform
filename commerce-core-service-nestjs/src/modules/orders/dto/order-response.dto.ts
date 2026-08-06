import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { OrderItemResponseDto } from './order-item-response.dto';

export class OrderResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  buyerId: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  sellerId: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty()
  paymentStatus: string;

  @Expose()
  @ApiProperty()
  totalAmount: string;

  @Expose()
  @ApiProperty()
  currency: string;

  @Expose()
  @ApiProperty({ type: Date })
  orderedAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class OrderDetailResponseDto extends OrderResponseDto {
  @Expose()
  @Type(() => OrderItemResponseDto)
  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];
}
