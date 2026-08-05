import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'ingestion', name: 'sync_runs' })
export class SyncRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'data_source_id', type: 'uuid' })
  dataSourceId: string;

  @Column({ type: 'varchar', length: 32, default: 'PENDING' })
  status: string;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @Column({ name: 'total_records', type: 'int', default: 0 })
  totalRecords: number;

  @Column({ name: 'success_count', type: 'int', default: 0 })
  successCount: number;

  @Column({ name: 'failed_count', type: 'int', default: 0 })
  failedCount: number;

  @Column({ name: 'error_summary', type: 'text', nullable: true })
  errorSummary: string | null;

  @Column({
    name: 'metadata_json',
    type: 'jsonb',
    default: () => "'{}'::jsonb",
  })
  metadataJson: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
