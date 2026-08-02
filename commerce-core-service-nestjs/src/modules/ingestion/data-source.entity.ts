import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'ingestion', name: 'data_sources' })
export class DataSourceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar',  length: 255 })
  name: string;

  @Column({ type: 'varchar',  length: 32 })
  type: string;

  @Column({ type: 'varchar',  name: 'base_url', length: 1000, nullable: true })
  baseUrl: string | null;

  @Column({ type: 'varchar',  length: 32, default: 'ACTIVE' })
  status: string;

  @Column({ name: 'config_json', type: 'jsonb', default: () => "'{}'::jsonb" })
  configJson: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
