import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity({ schema: 'marketplace', name: 'product_images' })
export class ProductImage {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Product, description: 'Associated product' })
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Product variant identifier',
  })
  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId: string | null;

  @ApiProperty({ description: 'Image URL' })
  @Column({ type: 'varchar', length: 1000 })
  url: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Object storage key',
  })
  @Column({ type: 'varchar', name: 'storage_key', length: 500, nullable: true })
  storageKey: string | null;

  @ApiProperty({ description: 'Display sort order', type: Number })
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Image alt text',
  })
  @Column({ type: 'varchar', name: 'alt_text', length: 500, nullable: true })
  altText: string | null;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
