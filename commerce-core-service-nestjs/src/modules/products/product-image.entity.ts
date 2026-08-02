import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ schema: 'marketplace', name: 'product_images' })
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId: string | null;

  @Column({ type: 'varchar',  length: 1000 })
  url: string;

  @Column({ type: 'varchar',  name: 'storage_key', length: 500, nullable: true })
  storageKey: string | null;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar',  name: 'alt_text', length: 500, nullable: true })
  altText: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
