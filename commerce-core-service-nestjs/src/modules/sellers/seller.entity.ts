import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ExternalUser } from '../auth/external-user.entity';

@Entity({ schema: 'marketplace', name: 'sellers' })
export class Seller {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Associated user identifier',
  })
  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @ApiProperty({
    nullable: true,
    type: () => ExternalUser,
    description: 'Associated user',
  })
  @ManyToOne(() => ExternalUser, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: ExternalUser | null;

  @ApiProperty({ description: 'Seller name' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Seller slug' })
  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @ApiProperty({ description: 'Seller status' })
  @Column({ type: 'varchar', length: 32, default: 'ACTIVE' })
  status: string;

  @ApiProperty({
    description: 'Average rating score',
    type: Number,
  })
  @Column({
    name: 'rating_avg',
    type: 'numeric',
    precision: 3,
    scale: 2,
    default: 0,
  })
  ratingAvg: string;

  @ApiProperty({
    description: 'Additional metadata',
    type: 'object',
    additionalProperties: true,
  })
  @Column({
    name: 'metadata_json',
    type: 'jsonb',
    default: () => "'{}'::jsonb",
  })
  metadataJson: Record<string, unknown>;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', type: Date })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
