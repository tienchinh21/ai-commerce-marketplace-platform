import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/user.entity';
import { Permission } from '../auth/permission.entity';
import { UserPermission } from '../auth/user-permission.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

export interface CreateUserInput {
  email: string;
  password: string;
  displayName: string;
  status?: string;
  permissionCodes?: string[];
}

@Injectable()
export class UsersPermissionsService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissions: Repository<Permission>,
    @InjectRepository(UserPermission)
    private readonly userPermissions: Repository<UserPermission>,
  ) {}

  async listUsers(): Promise<User[]> {
    return this.users.find({ order: { createdAt: 'DESC' } });
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await this.users.findOne({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException({
        code: ApiErrorCode.USER_EMAIL_EXISTS,
        message: VI_API_MESSAGES.errors[ApiErrorCode.USER_EMAIL_EXISTS],
      });
    }

    const user = await this.users.save(
      this.users.create({
        email: input.email.toLowerCase(),
        passwordHash: await bcrypt.hash(input.password, 10),
        displayName: input.displayName,
        status: input.status ?? 'ACTIVE',
      }),
    );

    if (input.permissionCodes && input.permissionCodes.length > 0) {
      await this.setPermissions(user.id, input.permissionCodes);
    }
    return user;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const rows: Array<{ code: string }> =
      await this.userPermissions.manager.query(
        `SELECT p.code
       FROM identity.user_permissions up
       JOIN identity.permissions p ON p.id = up.permission_id
       WHERE up.user_id = $1
       ORDER BY p.code`,
        [userId],
      );
    return rows.map((row) => row.code);
  }

  async setPermissions(userId: string, codes: string[]): Promise<void> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.USER_NOT_FOUND],
      });
    }
    await this.userPermissions.delete({ user: { id: userId } });

    if (codes.length > 0) {
      const permissionRecords = await this.permissions.find({
        where: codes.map((code) => ({ code })),
      });
      const byCode = new Map(permissionRecords.map((p) => [p.code, p]));
      const records = codes
        .filter((code) => byCode.has(code))
        .map((code) =>
          this.userPermissions.create({ user, permission: byCode.get(code)! }),
        );
      await this.userPermissions.save(records);
    }
  }

  async listPermissions(): Promise<Permission[]> {
    return this.permissions.find({ order: { code: 'ASC' } });
  }

  async seedPermissions(codes: string[]): Promise<void> {
    for (const code of codes) {
      const existing = await this.permissions.findOne({ where: { code } });
      if (!existing) {
        await this.permissions.save(this.permissions.create({ code }));
      }
    }
  }
}
