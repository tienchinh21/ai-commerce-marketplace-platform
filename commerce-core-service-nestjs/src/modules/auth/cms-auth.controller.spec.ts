import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CmsAuthController } from './cms-auth.controller';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

describe('CmsAuthController', () => {
  let controller: CmsAuthController;
  const login = jest.fn();
  const refresh = jest.fn();
  const logout = jest.fn();
  const me = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [CmsAuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { login, refresh, logout, me },
        },
      ],
    }).compile();

    controller = moduleRef.get(CmsAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST login', () => {
    it('should delegate to AuthService.login and return lean success with tokens', async () => {
      const mockTokens = { accessToken: 'at', refreshToken: 'rt' };
      login.mockResolvedValue(mockTokens);

      const result = await controller.login({
        email: 'a@b.com',
        password: 'pass',
      });

      expect(login).toHaveBeenCalledWith('a@b.com', 'pass');
      expect(result).toEqual({
        success: true,
        message: VI_API_MESSAGES.success.LOGIN_SUCCESS,
        accessToken: 'at',
        refreshToken: 'rt',
      });
    });
  });

  describe('POST refresh', () => {
    it('should delegate to AuthService.refresh and return tokens', async () => {
      const mockResult = { accessToken: 'new-at', refreshToken: 'new-rt' };
      refresh.mockResolvedValue(mockResult);

      const result = await controller.refresh({
        refreshToken: 'old-rt',
      });

      expect(refresh).toHaveBeenCalledWith('old-rt');
      expect(result).toEqual(mockResult);
    });
  });

  describe('POST logout', () => {
    it('should call AuthService.logout and return success', async () => {
      logout.mockResolvedValue(undefined);

      const result = await controller.logout({
        user: { id: 'u1' },
      });

      expect(logout).toHaveBeenCalledWith('u1');
      expect(result).toEqual({
        success: true,
        message: VI_API_MESSAGES.success.LOGOUT_SUCCESS,
      });
    });
  });

  describe('GET me', () => {
    it('should delegate to AuthService.me', async () => {
      const mockUser = {
        id: 'u1',
        email: 'a@b.com',
        displayName: 'Admin',
        permissions: ['product:read'],
      };
      me.mockResolvedValue(mockUser);

      const result = await controller.me({ user: { id: 'u1' } });

      expect(me).toHaveBeenCalledWith('u1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('GET me/permissions', () => {
    it('should return permissions list', async () => {
      me.mockResolvedValue({
        id: 'u1',
        email: 'a@b.com',
        displayName: 'Admin',
        permissions: ['product:read', 'category:write'],
      });

      const result = await controller.mePermissions({ user: { id: 'u1' } });

      expect(result).toEqual({
        permissions: ['product:read', 'category:write'],
      });
    });
  });
});
