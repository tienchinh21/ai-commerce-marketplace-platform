import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'marketplace', name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'buyer_id', type: 'uuid', nullable: true })
  buyerId: string | null;

  @Column({ name: 'seller_id', type: 'uuid', nullable: true })
  sellerId: string | null;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 32, default: 'APPROVED' })
  status: string;

  @Column({
    type: 'varchar',
    name: 'source_type',
    length: 32,
    default: 'manual',
  })
  sourceType: string;

  @Column({ name: 'source_review_id', type: 'uuid', nullable: true })
  sourceReviewId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
