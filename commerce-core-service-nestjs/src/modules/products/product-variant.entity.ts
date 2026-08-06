import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity({ schema: 'marketplace', name: 'product_variants' })
export class ProductVariant {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Product, description: 'Associated product' })
  @Index()
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'Stock keeping unit' })
  @Column({ type: 'varchar', length: 255 })
  sku: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Variant title',
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @ApiProperty({ description: 'Variant price', type: Number })
  @Column({ type: 'numeric', precision: 14, scale: 2 })
  price: string;

  @ApiProperty({ description: 'Available stock quantity', type: Number })
  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number;

  @ApiProperty({ description: 'Variant status' })
  @Column({ type: 'varchar', length: 32, default: 'ACTIVE' })
  status: string;

  @ApiProperty({
    description: 'Variant specifications',
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
}
