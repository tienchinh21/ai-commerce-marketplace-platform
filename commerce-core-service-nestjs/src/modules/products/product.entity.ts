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
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity({ schema: 'marketplace', name: 'products' })
export class Product {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Seller identifier' })
  @Index()
  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId: string;

  @ApiProperty({ description: 'Category identifier' })
  @Index()
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ApiProperty({ description: 'Product title' })
  @Column({ type: 'varchar', length: 500 })
  title: string;

  @ApiProperty({ description: 'Product slug' })
  @Column({ type: 'varchar', length: 500 })
  slug: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Product brand',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  brand: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Product description',
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Product status' })
  @Column({ type: 'varchar', length: 32, default: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Minimum price', type: Number })
  @Column({
    name: 'price_min',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  priceMin: string;

  @ApiProperty({ description: 'Maximum price', type: Number })
  @Column({
    name: 'price_max',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
  })
  priceMax: string;

  @ApiProperty({ description: 'Average rating score', type: Number })
  @Column({
    name: 'rating_avg',
    type: 'numeric',
    precision: 3,
    scale: 2,
    default: 0,
  })
  ratingAvg: string;

  @ApiProperty({ description: 'Number of reviews', type: Number })
  @Column({ name: 'review_count', type: 'int', default: 0 })
  reviewCount: number;

  @ApiProperty({
    description: 'Product specifications',
    type: 'object',
    additionalProperties: true,
  })
  @Column({ name: 'specs_json', type: 'jsonb', default: () => "'{}'::jsonb" })
  specsJson: Record<string, unknown>;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', type: Date })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    type: () => [ProductVariant],
    description: 'Product variants',
  })
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @ApiProperty({
    type: () => [ProductImage],
    description: 'Product images',
  })
  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];
}
