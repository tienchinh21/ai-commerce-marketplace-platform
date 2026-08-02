import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPermission } from './user-permission.entity';

@Entity({ schema: 'identity', name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar',  length: 255 })
  email: string;

  @Column({ type: 'varchar',  name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'varchar',  name: 'display_name', length: 255 })
  displayName: string;

  @Column({ type: 'varchar',  length: 32, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermissions: UserPermission[];
}
