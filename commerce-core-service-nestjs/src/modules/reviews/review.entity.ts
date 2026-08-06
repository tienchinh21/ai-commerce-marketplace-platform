import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'marketplace', name: 'reviews' })
export class Review {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Product identifier' })
  @Index()
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Buyer identifier',
  })
  @Column({ name: 'buyer_id', type: 'uuid', nullable: true })
  buyerId: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Seller identifier',
  })
  @Column({ name: 'seller_id', type: 'uuid', nullable: true })
  sellerId: string | null;

  @ApiProperty({ description: 'Rating score', type: Number })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({ nullable: true, type: String, description: 'Review title' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  title: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Review content',
  })
  @Column({ type: 'text', nullable: true })
  content: string | null;

  @ApiProperty({ description: 'Review status' })
  @Column({ type: 'varchar', length: 32, default: 'APPROVED' })
  status: string;

  @ApiProperty({ description: 'Source type' })
  @Column({
    type: 'varchar',
    name: 'source_type',
    length: 32,
    default: 'manual',
  })
  sourceType: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Source review identifier',
  })
  @Column({ name: 'source_review_id', type: 'uuid', nullable: true })
  sourceReviewId: string | null;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', type: Date })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
