import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'ingestion', name: 'raw_snapshots' })
export class RawSnapshot {
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

  @ApiProperty({ description: 'Content MIME type' })
  @Column({
    type: 'varchar',
    name: 'content_type',
    length: 64,
    default: 'application/json',
  })
  contentType: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Content hash',
  })
  @Column({ type: 'varchar', name: 'content_hash', length: 64, nullable: true })
  contentHash: string | null;

  @ApiProperty({
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'Raw JSON content',
  })
  @Column({ name: 'raw_json', type: 'jsonb', nullable: true })
  rawJson: Record<string, unknown> | null;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Object storage key',
  })
  @Column({
    type: 'varchar',
    name: 'object_storage_key',
    length: 500,
    nullable: true,
  })
  objectStorageKey: string | null;

  @ApiProperty({ description: 'Parse status' })
  @Column({
    type: 'varchar',
    name: 'parse_status',
    length: 32,
    default: 'PENDING',
  })
  parseStatus: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Error message during parsing',
  })
  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
