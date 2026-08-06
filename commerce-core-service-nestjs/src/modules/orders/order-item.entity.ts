import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity({ schema: 'marketplace', name: 'order_items' })
export class OrderItem {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Order, description: 'Associated order' })
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'Product identifier' })
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Product variant identifier',
  })
  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId: string | null;

  @ApiProperty({ description: 'Ordered quantity', type: Number })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ description: 'Unit price', type: Number })
  @Column({ name: 'unit_price', type: 'numeric', precision: 14, scale: 2 })
  unitPrice: string;

  @ApiProperty({ description: 'Total price', type: Number })
  @Column({ name: 'total_price', type: 'numeric', precision: 14, scale: 2 })
  totalPrice: string;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
