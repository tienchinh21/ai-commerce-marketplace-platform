import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'ingestion', name: 'source_products' })
export class SourceProduct {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Data source identifier' })
  @Index()
  @Column({ name: 'data_source_id', type: 'uuid' })
  dataSourceId: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Sync run identifier',
  })
  @Column({ name: 'sync_run_id', type: 'uuid', nullable: true })
  syncRunId: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Raw snapshot identifier',
  })
  @Column({ name: 'raw_snapshot_id', type: 'uuid', nullable: true })
  rawSnapshotId: string | null;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Canonical product identifier',
  })
  @Column({ name: 'canonical_product_id', type: 'uuid', nullable: true })
  canonicalProductId: string | null;

  @ApiProperty({ description: 'Source product identifier' })
  @Column({ type: 'varchar', name: 'source_product_id', length: 255 })
  sourceProductId: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Source URL',
  })
  @Column({ type: 'varchar', name: 'source_url', length: 1000, nullable: true })
  sourceUrl: string | null;

  @ApiProperty({
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'Raw source data',
  })
  @Column({ name: 'raw_data_json', type: 'jsonb', nullable: true })
  rawDataJson: Record<string, unknown> | null;

  @ApiProperty({
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'Normalized source data',
  })
  @Column({ name: 'normalized_data_json', type: 'jsonb', nullable: true })
  normalizedDataJson: Record<string, unknown> | null;

  @ApiProperty({ description: 'Mapping status' })
  @Column({
    type: 'varchar',
    name: 'mapping_status',
    length: 32,
    default: 'PENDING',
  })
  mappingStatus: string;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', type: Date })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
