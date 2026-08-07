import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
import type { JwtPayload } from './jwt.strategy';

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.users.findOne({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        displayName: true,
        passwordHash: true,
        status: true,
      },
    });
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException({
        code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_INVALID_CREDENTIALS],
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException({
        code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_INVALID_CREDENTIALS],
      });
    }

    const accessToken = await this.signAccessToken(user);
    const refreshToken = await this.signRefreshToken(user);

    await this.users.update(user.id, {
      refreshTokenHash: await this.hashRefreshToken(refreshToken),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async me(userId: string): Promise<{
    id: string;
    email: string;
    displayName: string;
    permissions: string[];
  }> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException({
        code: ApiErrorCode.AUTH_USER_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_USER_NOT_FOUND],
      });
    }
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      permissions: await this.findPermissions(user.id),
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException({
        code: ApiErrorCode.AUTH_REFRESH_INVALID,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_REFRESH_INVALID],
      });
    }

    const user = await this.users.findOne({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        status: true,
        refreshTokenHash: true,
      },
    });

    if (!user || !user.refreshTokenHash || user.status !== 'ACTIVE') {
      throw new UnauthorizedException({
        code: ApiErrorCode.AUTH_REFRESH_INVALID,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_REFRESH_INVALID],
      });
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      // Reuse detected — revoke all sessions for this user
      await this.users.update(user.id, {
        refreshTokenHash: null,
      });
      throw new UnauthorizedException({
        code: ApiErrorCode.AUTH_REFRESH_REUSED,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_REFRESH_REUSED],
      });
    }

    // Rotate tokens
    const newAccessToken = await this.signAccessToken(user);
    const newRefreshToken = await this.signRefreshToken(user);
    await this.users.update(user.id, {
      refreshTokenHash: await this.hashRefreshToken(newRefreshToken),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.users.update(userId, {
      refreshTokenHash: null,
    });
  }

  private async findPermissions(userId: string): Promise<string[]> {
    const rows: Array<{ code: string }> = await this.users.manager.query(
      `SELECT p.code
       FROM identity.user_permissions up
       JOIN identity.permissions p ON p.id = up.permission_id
       WHERE up.user_id = $1
       ORDER BY p.code`,
      [userId],
    );
    return rows.map((row) => row.code);
  }

  private async signAccessToken(
    user: Pick<User, 'id' | 'email'>,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id, email: user.email },
      {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
        expiresIn: (this.config.get<string>('JWT_EXPIRES_IN') ??
          '8h') as `${number}h`,
      },
    );
  }

  private async signRefreshToken(
    user: Pick<User, 'id' | 'email'>,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { sub: user.id, email: user.email, type: 'refresh' },
      {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: (this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ??
          '7d') as `${number}d`,
      },
    );
  }

  private async hashRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }
}
