import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

const CORRECT_PASSWORD = 'correct-password';
const CORRECT_REFRESH_TOKEN = 'valid-refresh-token';

describe('AuthService', () => {
  let service: AuthService;
  const findOne = jest.fn();
  const update = jest.fn();
  const query = jest.fn();
  const signAsync = jest.fn();
  const verifyAsync = jest.fn();
  const configGet = jest.fn();
  const configGetOrThrow = jest.fn();

  let passwordHash: string;
  let refreshTokenHash: string;

  beforeAll(async () => {
    passwordHash = await bcrypt.hash(CORRECT_PASSWORD, 4);
    refreshTokenHash = await bcrypt.hash(CORRECT_REFRESH_TOKEN, 4);
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    configGet.mockImplementation((key: string) => {
      if (key === 'JWT_EXPIRES_IN') return '8h';
      if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
      return undefined;
    });
    configGetOrThrow.mockImplementation((key: string) => {
      if (key === 'JWT_SECRET') return 'access-secret';
      if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      return `mock-${key}`;
    });

    signAsync.mockResolvedValue('mock-jwt-token');

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            update,
            manager: { query },
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync, verifyAsync },
        },
        {
          provide: ConfigService,
          useValue: { get: configGet, getOrThrow: configGetOrThrow },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return accessToken and refreshToken on success', async () => {
      const mockUser = {
        id: 'u1',
        email: 'admin@test.com',
        displayName: 'Admin',
        passwordHash,
        status: 'ACTIVE',
      };
      findOne.mockResolvedValue(mockUser);
      signAsync.mockResolvedValueOnce('access-token-value');
      signAsync.mockResolvedValueOnce('refresh-token-value');
      update.mockResolvedValue({ affected: 1 });

      const result = await service.login('admin@test.com', CORRECT_PASSWORD);

      expect(result.accessToken).toBe('access-token-value');
      expect(result.refreshToken).toBe('refresh-token-value');
      // Should have called update to persist the refresh token hash
      expect(update).toHaveBeenCalledWith('u1', expect.any(Object));
    });

    it('should return AUTH_INVALID_CREDENTIALS for unknown email', async () => {
      findOne.mockResolvedValue(null);

      await expect(service.login('a@b.com', 'pass')).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
          message:
            VI_API_MESSAGES.errors[ApiErrorCode.AUTH_INVALID_CREDENTIALS],
        },
      });
    });

    it('should return AUTH_INVALID_CREDENTIALS for inactive user', async () => {
      findOne.mockResolvedValue({ status: 'INACTIVE' });

      await expect(service.login('a@b.com', 'pass')).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
          message:
            VI_API_MESSAGES.errors[ApiErrorCode.AUTH_INVALID_CREDENTIALS],
        },
      });
    });

    it('should return AUTH_INVALID_CREDENTIALS for wrong password', async () => {
      findOne.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        status: 'ACTIVE',
        passwordHash: '$2a$10$differenthash',
      });

      await expect(service.login('a@b.com', 'wrong')).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
          message:
            VI_API_MESSAGES.errors[ApiErrorCode.AUTH_INVALID_CREDENTIALS],
        },
      });
    });
  });

  describe('refresh', () => {
    it('should return new tokens on valid refresh token', async () => {
      verifyAsync.mockResolvedValue({
        sub: 'u1',
        email: 'admin@test.com',
        type: 'refresh',
      });
      findOne.mockResolvedValue({
        id: 'u1',
        email: 'admin@test.com',
        status: 'ACTIVE',
        refreshTokenHash,
      });
      signAsync
        .mockResolvedValueOnce('new-access')
        .mockResolvedValueOnce('new-refresh');
      update.mockResolvedValue({ affected: 1 });

      const result = await service.refresh(CORRECT_REFRESH_TOKEN);

      expect(result.accessToken).toBe('new-access');
      expect(result.refreshToken).toBe('new-refresh');
      expect(update).toHaveBeenCalledWith('u1', expect.any(Object));
    });

    it('should throw AUTH_REFRESH_INVALID for expired/invalid token', async () => {
      verifyAsync.mockRejectedValue(new Error('jwt expired'));

      await expect(service.refresh('expired')).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_REFRESH_INVALID,
          message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_REFRESH_INVALID],
        },
      });
    });

    it('should throw AUTH_REFRESH_INVALID when user not found', async () => {
      verifyAsync.mockResolvedValue({ sub: 'missing', email: 'x@y.com' });
      findOne.mockResolvedValue(null);

      await expect(service.refresh('valid-for-missing')).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_REFRESH_INVALID,
          message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_REFRESH_INVALID],
        },
      });
    });

    it('should throw AUTH_REFRESH_INVALID when user has no stored hash', async () => {
      verifyAsync.mockResolvedValue({ sub: 'u1', email: 'a@b.com' });
      findOne.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        status: 'ACTIVE',
        refreshTokenHash: null,
      });

      await expect(
        service.refresh('logged-out-refresh-token'),
      ).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_REFRESH_INVALID,
          message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_REFRESH_INVALID],
        },
      });
    });

    it('should throw AUTH_REFRESH_REUSED and clear hash on mismatch', async () => {
      verifyAsync.mockResolvedValue({ sub: 'u1', email: 'a@b.com' });
      findOne.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        status: 'ACTIVE',
        refreshTokenHash: '$2a$10$different',
      });
      update.mockResolvedValue({ affected: 1 });

      await expect(service.refresh('reused-token')).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_REFRESH_REUSED,
          message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_REFRESH_REUSED],
        },
      });
      // Should clear the stored hash on reuse detection
      expect(update).toHaveBeenCalledWith('u1', { refreshTokenHash: null });
    });
  });

  describe('logout', () => {
    it('should clear the refresh token hash', async () => {
      update.mockResolvedValue({ affected: 1 });

      await service.logout('u1');

      expect(update).toHaveBeenCalledWith('u1', { refreshTokenHash: null });
    });
  });

  describe('me', () => {
    it('should return user info', async () => {
      findOne.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        displayName: 'Admin',
      });
      query.mockResolvedValue([{ code: 'product:read' }]);

      const result = await service.me('u1');
      expect(result).toEqual({
        id: 'u1',
        email: 'a@b.com',
        displayName: 'Admin',
        permissions: ['product:read'],
      });
    });

    it('should return AUTH_USER_NOT_FOUND for missing user', async () => {
      findOne.mockResolvedValue(null);

      await expect(service.me('missing')).rejects.toMatchObject({
        response: {
          code: ApiErrorCode.AUTH_USER_NOT_FOUND,
          message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_USER_NOT_FOUND],
        },
      });
    });
  });
});
