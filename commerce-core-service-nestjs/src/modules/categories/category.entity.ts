import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryAttribute } from './category-attribute.entity';

@Entity({ schema: 'marketplace', name: 'categories' })
export class Category {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    nullable: true,
    type: String,
    description: 'Parent category identifier',
  })
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @ApiProperty({
    nullable: true,
    type: () => Category,
    description: 'Parent category',
  })
  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  @ApiProperty({ description: 'Category name' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Category slug' })
  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @ApiProperty({ description: 'Category path' })
  @Column({ type: 'varchar', length: 500 })
  path: string;

  @ApiProperty({ description: 'Category hierarchy level', type: Number })
  @Column({ type: 'int', default: 0 })
  level: number;

  @ApiProperty({ description: 'Category status' })
  @Column({ type: 'varchar', length: 32, default: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Created timestamp', type: Date })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', type: Date })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    type: () => [CategoryAttribute],
    description: 'Category attributes',
  })
  @OneToMany(() => CategoryAttribute, (attribute) => attribute.category)
  attributes: CategoryAttribute[];
}
