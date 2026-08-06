import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from './order-item.entity';

@Entity({ schema: 'marketplace', name: 'orders' })
export class Order {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Buyer identifier' })
  @Index()
  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @ApiProperty({ description: 'Seller identifier' })
  @Index()
  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @ApiProperty({ description: 'Order status' })
  @Column({ type: 'varchar', length: 32, default: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'Payment status' })
  @Column({
    type: 'varchar',
    name: 'payment_status',
    length: 32,
    default: 'UNPAID',
  })
  paymentStatus: string;

  @ApiProperty({ description: 'Total order amount', type: Number })
  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalAmount: string;

  @ApiProperty({ description: 'Currency code' })
  @Column({ type: 'varchar', length: 3, default: 'VND' })
  currency: string;

  @ApiProperty({ description: 'Order timestamp', type: Date })
  @Column({
    name: 'ordered_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderedAt: Date;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', type: Date })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    type: () => [OrderItem],
    description: 'Order line items',
  })
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
