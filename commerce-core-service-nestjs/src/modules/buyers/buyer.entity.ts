import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'marketplace', name: 'buyers' })
export class Buyer {
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

  @ApiProperty({ description: 'Email address' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({ description: 'Display name' })
  @Column({ type: 'varchar', name: 'display_name', length: 255 })
  displayName: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Phone number',
  })
  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string | null;

  @ApiProperty({ description: 'Buyer status' })
  @Column({ type: 'varchar', length: 32, default: 'ACTIVE' })
  status: string;

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
