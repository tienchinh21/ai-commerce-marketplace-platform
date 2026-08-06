import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'ingestion', name: 'sync_runs' })
export class SyncRun {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Data source identifier' })
  @Index()
  @Column({ name: 'data_source_id', type: 'uuid' })
  dataSourceId: string;

  @ApiProperty({ description: 'Sync run status' })
  @Column({ type: 'varchar', length: 32, default: 'PENDING' })
  status: string;

  @ApiProperty({
    nullable: true,
    type: Date,
    description: 'Sync start timestamp',
  })
  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @ApiProperty({
    nullable: true,
    type: Date,
    description: 'Sync finish timestamp',
  })
  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @ApiProperty({ description: 'Total records to process', type: Number })
  @Column({ name: 'total_records', type: 'int', default: 0 })
  totalRecords: number;

  @ApiProperty({ description: 'Successfully processed records', type: Number })
  @Column({ name: 'success_count', type: 'int', default: 0 })
  successCount: number;

  @ApiProperty({ description: 'Failed record count', type: Number })
  @Column({ name: 'failed_count', type: 'int', default: 0 })
  failedCount: number;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Error summary',
  })
  @Column({ name: 'error_summary', type: 'text', nullable: true })
  errorSummary: string | null;

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
}
