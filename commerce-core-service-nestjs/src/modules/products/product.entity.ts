import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({ schema: 'marketplace', name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @Index()
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 32, default: 'ACTIVE' })
  status: string;

  @Column({
    name: 'price_min',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  priceMin: string;

  @Column({
    name: 'price_max',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  priceMax: string;

  @Column({
    name: 'rating_avg',
    type: 'numeric',
    precision: 3,
    scale: 2,
    default: 0,
  })
  ratingAvg: string;

  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount: number;

  @Column({ name: 'specs_json', type: 'jsonb', default: () => "'{}'::jsonb" })
  specsJson: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}
