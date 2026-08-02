import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity({ schema: 'marketplace', name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @Index()
  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @Column({ type: 'varchar',  length: 32, default: 'PENDING' })
  status: string;

  @Column({ type: 'varchar',  name: 'payment_status', length: 32, default: 'UNPAID' })
  paymentStatus: string;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  totalAmount: string;

  @Column({ type: 'varchar',  length: 3, default: 'VND' })
  currency: string;

  @Column({
    name: 'ordered_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];
}
