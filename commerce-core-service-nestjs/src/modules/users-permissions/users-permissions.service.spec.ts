import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersPermissionsService } from './users-permissions.service';
import { User } from '../auth/user.entity';
import { Permission } from '../auth/permission.entity';
import { UserPermission } from '../auth/user-permission.entity';
import { ApiErrorCode } from '../../shared/api/api-error-code';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

describe('UsersPermissionsService', () => {
  let service: UsersPermissionsService;
  const usersFindOne = jest.fn();
  const permissionsFind = jest.fn();
  const userPermissionsDelete = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersPermissionsService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: usersFindOne,
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            find: permissionsFind,
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserPermission),
          useValue: {
            delete: userPermissionsDelete,
            save: jest.fn(),
            create: jest.fn(),
            manager: { query: jest.fn() },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(UsersPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return USER_EMAIL_EXISTS for duplicate email', async () => {
    usersFindOne.mockResolvedValue({ id: 'u1', email: 'a@b.com' });

    await expect(
      service.createUser({
        email: 'a@b.com',
        password: 'secret',
        displayName: 'Test',
      }),
    ).rejects.toMatchObject({
      response: {
        code: ApiErrorCode.USER_EMAIL_EXISTS,
        message: VI_API_MESSAGES.errors[ApiErrorCode.USER_EMAIL_EXISTS],
      },
    });
  });

  it('should return USER_NOT_FOUND when setting permissions for missing user', async () => {
    usersFindOne.mockResolvedValue(null);

    await expect(service.setPermissions('missing', ['p:read'])).rejects.toMatchObject({
      response: {
        code: ApiErrorCode.USER_NOT_FOUND,
        message: VI_API_MESSAGES.errors[ApiErrorCode.USER_NOT_FOUND],
      },
    });
  });
});
