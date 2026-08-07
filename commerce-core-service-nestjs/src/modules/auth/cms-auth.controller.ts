import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import {
  LoginResponseDto,
  MePermissionsResponseDto,
  MeResponseDto,
} from './dto/cms/auth-response.dto';
import { LoginDto } from './dto/cms/login.dto';

@Controller('cms/auth')
export class CmsAuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiCreatedResponse({
    description: 'Token truy cập và thông tin người dùng',
    type: LoginResponseDto,
  })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
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
