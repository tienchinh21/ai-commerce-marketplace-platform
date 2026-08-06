import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

describe('AuthService', () => {
  let service: AuthService;
  const findOne = jest.fn();
  const query = jest.fn();
  const signAsync = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            manager: { query },
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync },
        },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return AUTH_INVALID_CREDENTIALS for unknown login', async () => {
    findOne.mockResolvedValue(null);

    await expect(service.login('a@b.com', 'pass')).rejects.toMatchObject({
      response: {
        code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_INVALID_CREDENTIALS],
      },
    });
  });

  it('should return AUTH_USER_NOT_FOUND for missing user in me', async () => {
    findOne.mockResolvedValue(null);

    await expect(service.me('missing')).rejects.toMatchObject({
      response: {
        code: ApiErrorCode.AUTH_USER_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.AUTH_USER_NOT_FOUND],
      },
    });
  });
});
