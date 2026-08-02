import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ schema: 'marketplace', name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId: string | null;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 14, scale: 2 })
  unitPrice: string;

  @Column({ name: 'total_price', type: 'numeric', precision: 14, scale: 2 })
  totalPrice: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
