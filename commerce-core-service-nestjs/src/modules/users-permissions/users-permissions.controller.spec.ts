import { Test } from '@nestjs/testing';
import { UsersPermissionsController } from './users-permissions.controller';
import { UsersPermissionsService } from './users-permissions.service';

describe('UsersPermissionsController response shape', () => {
  let controller: UsersPermissionsController;
  const usersPermissionsService = {
    listUsers: jest.fn(),
    createUser: jest.fn(),
    listPermissions: jest.fn(),
    getUserPermissions: jest.fn(),
    setPermissions: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersPermissionsController],
      providers: [
        { provide: UsersPermissionsService, useValue: usersPermissionsService },
      ],
    }).compile();
    controller = moduleRef.get(UsersPermissionsController);
  });

  it('does not expose passwordHash when creating a user', async () => {
    usersPermissionsService.createUser.mockResolvedValue({
      id: 'user-1',
      email: 'admin@example.com',
      displayName: 'Admin',
      passwordHash: 'hash',
      status: 'ACTIVE',
    });

    await expect(
      controller.createUser({
        email: 'admin@example.com',
        password: '***********!',
        displayName: 'Admin',
        permissionCodes: [],
      }),
    ).resolves.toEqual({
      success: true,
      id: 'user-1',
      message: 'User created successfully',
    });
  });

  it('does not expose passwordHash in user list', async () => {
    usersPermissionsService.listUsers.mockResolvedValue([
      {
        id: 'user-1',
        email: 'admin@example.com',
        displayName: 'Admin',
        passwordHash: 'hash',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);

    const result = await controller.listUsers();

    expect(result).toEqual([
      {
        id: 'user-1',
        email: 'admin@example.com',
        displayName: 'Admin',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-06T00:00:00.000Z'),
        updatedAt: new Date('2026-08-06T00:00:00.000Z'),
      },
    ]);
    expect('passwordHash' in result[0]).toBe(false);
  });

  it('returns a success acknowledgement after setting permissions', async () => {
    usersPermissionsService.setPermissions.mockResolvedValue(undefined);

    await expect(
      controller.setPermissions('00000000-0000-0000-0000-000000000001', {
        codes: ['product:read'],
      }),
    ).resolves.toEqual({
      success: true,
      message: 'User permissions updated successfully',
    });
  });
});
