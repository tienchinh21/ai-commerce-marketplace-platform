import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import {
  LoginResponseDto,
  LogoutResponseDto,
  MePermissionsResponseDto,
  MeResponseDto,
  RefreshResponseDto,
} from './dto/cms/auth-response.dto';
import { LoginDto } from './dto/cms/login.dto';
import { RefreshTokenDto } from './dto/cms/refresh-token.dto';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';

@Controller('cms/auth')
export class CmsAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiCreatedResponse({
    description: 'Token truy cập và token làm mới',
    type: LoginResponseDto,
  })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const tokens = await this.authService.login(body.email, body.password);
    return {
      success: true as const,
      message: VI_API_MESSAGES.success.LOGIN_SUCCESS,
      ...tokens,
    };
  }

  @Public()
  @ApiCreatedResponse({
    description: 'Cặp access token và refresh token mới',
    type: RefreshResponseDto,
  })
  @Post('refresh')
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Đăng xuất thành công',
    type: LogoutResponseDto,
  })
  @Post('logout')
  async logout(@Request() request: { user: { id: string } }) {
    await this.authService.logout(request.user.id);
    return {
      success: true as const,
      message: VI_API_MESSAGES.success.LOGOUT_SUCCESS,
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Thông tin người dùng đang đăng nhập',
    type: MeResponseDto,
  })
  @Get('me')
  me(@Request() request: { user: { id: string } }) {
    return this.authService.me(request.user.id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Danh sách quyền của người dùng hiện tại',
    type: MePermissionsResponseDto,
  })
  @Get('me/permissions')
  async mePermissions(@Request() request: { user: { id: string } }) {
    const me = await this.authService.me(request.user.id);
    return { permissions: me.permissions };
  }
}
