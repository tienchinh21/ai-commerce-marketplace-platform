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
import { Category } from './category.entity';

@Entity({ schema: 'marketplace', name: 'category_attributes' })
export class CategoryAttribute {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Category, description: 'Associated category' })
  @ManyToOne(() => Category, (category) => category.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty({ description: 'Attribute code' })
  @Column({ type: 'varchar', length: 100 })
  code: string;

  @ApiProperty({ description: 'Attribute label' })
  @Column({ type: 'varchar', length: 255 })
  label: string;

  @ApiProperty({ description: 'Attribute data type' })
  @Column({ type: 'varchar', name: 'data_type', length: 32 })
  dataType: string;

  @ApiProperty({
    description: 'Whether the attribute is filterable',
    type: Boolean,
  })
  @Column({ name: 'is_filterable', type: 'boolean', default: false })
  isFilterable: boolean;

  @ApiProperty({
    description: 'Whether the attribute is searchable',
    type: Boolean,
  })
  @Column({ name: 'is_searchable', type: 'boolean', default: false })
  isSearchable: boolean;

  @ApiProperty({
    description: 'Whether the attribute is required',
    type: Boolean,
  })
  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired: boolean;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Measurement unit',
  })
  @Column({ type: 'varchar', length: 32, nullable: true })
  unit: string | null;

  @ApiProperty({
    nullable: true,
    type: 'object',
    additionalProperties: true,
    description: 'Available attribute options',
  })
  @Column({ name: 'options_json', type: 'jsonb', nullable: true })
  optionsJson: Record<string, unknown> | null;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', type: Date })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
