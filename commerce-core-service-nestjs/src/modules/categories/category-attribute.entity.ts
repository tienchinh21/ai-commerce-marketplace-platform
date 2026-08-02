import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity({ schema: 'marketplace', name: 'category_attributes' })
export class CategoryAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (category) => category.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar',  length: 100 })
  code: string;

  @Column({ type: 'varchar',  length: 255 })
  label: string;

  @Column({ type: 'varchar',  name: 'data_type', length: 32 })
  dataType: string;

  @Column({ name: 'is_filterable', type: 'boolean', default: false })
  isFilterable: boolean;

  @Column({ name: 'is_searchable', type: 'boolean', default: false })
  isSearchable: boolean;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ type: 'varchar',  length: 32, nullable: true })
  unit: string | null;

  @Column({ name: 'options_json', type: 'jsonb', nullable: true })
  optionsJson: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
