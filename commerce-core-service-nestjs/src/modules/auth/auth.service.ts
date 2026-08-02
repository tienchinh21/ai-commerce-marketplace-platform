import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

export interface LoginResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    permissions: string[];
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = await this.findPermissions(user.id);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        permissions,
      },
    };
  }

  async me(userId: string): Promise<LoginResult['user']> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      permissions: await this.findPermissions(user.id),
    };
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
}
