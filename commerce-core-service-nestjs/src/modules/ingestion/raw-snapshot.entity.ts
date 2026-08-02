import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'ingestion', name: 'raw_snapshots' })
export class RawSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'data_source_id', type: 'uuid' })
  dataSourceId: string;

  @Column({ name: 'sync_run_id', type: 'uuid', nullable: true })
  syncRunId: string | null;

  @Column({ type: 'varchar',  name: 'content_type', length: 64, default: 'application/json' })
  contentType: string;

  @Column({ type: 'varchar',  name: 'content_hash', length: 64, nullable: true })
  contentHash: string | null;

  @Column({ name: 'raw_json', type: 'jsonb', nullable: true })
  rawJson: Record<string, unknown> | null;

  @Column({ type: 'varchar',  name: 'object_storage_key', length: 500, nullable: true })
  objectStorageKey: string | null;

  @Column({ type: 'varchar',  name: 'parse_status', length: 32, default: 'PENDING' })
  parseStatus: string;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
