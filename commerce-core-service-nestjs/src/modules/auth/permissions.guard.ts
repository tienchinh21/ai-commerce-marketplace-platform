import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import type { Request as ExpressRequest } from 'express';
import { PERMISSIONS_KEY } from './permissions.decorator';
import type { PermissionCode } from './permissions.const';

interface AuthenticatedRequest extends ExpressRequest {
  user?: { id: string };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<
      PermissionCode[] | undefined
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Missing user context');
    }

    const rows: Array<{ code: string }> = await this.dataSource.query(
      `SELECT DISTINCT p.code
       FROM identity.user_permissions up
       JOIN identity.permissions p ON p.id = up.permission_id
       WHERE up.user_id = $1`,
      [user.id],
    );
    const granted = new Set(rows.map((row) => row.code));

    const missing = required.filter((permission) => !granted.has(permission));
    if (missing.length > 0) {
      throw new ForbiddenException(
        `Missing permissions: ${missing.join(', ')}`,
      );
    }
    return true;
  }
}
