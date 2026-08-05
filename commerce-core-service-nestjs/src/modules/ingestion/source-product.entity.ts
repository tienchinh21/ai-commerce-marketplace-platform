import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'ingestion', name: 'source_products' })
export class SourceProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'data_source_id', type: 'uuid' })
  dataSourceId: string;

  @Column({ name: 'sync_run_id', type: 'uuid', nullable: true })
  syncRunId: string | null;

  @Column({ name: 'raw_snapshot_id', type: 'uuid', nullable: true })
  rawSnapshotId: string | null;

  @Column({ name: 'canonical_product_id', type: 'uuid', nullable: true })
  canonicalProductId: string | null;

  @Column({ type: 'varchar', name: 'source_product_id', length: 255 })
  sourceProductId: string;

  @Column({ type: 'varchar', name: 'source_url', length: 1000, nullable: true })
  sourceUrl: string | null;

  @Column({ name: 'raw_data_json', type: 'jsonb', nullable: true })
  rawDataJson: Record<string, unknown> | null;

  @Column({ name: 'normalized_data_json', type: 'jsonb', nullable: true })
  normalizedDataJson: Record<string, unknown> | null;

  @Column({
    type: 'varchar',
    name: 'mapping_status',
    length: 32,
    default: 'PENDING',
  })
  mappingStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
