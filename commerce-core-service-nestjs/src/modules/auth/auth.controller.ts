import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import {
  LoginResponseDto,
  MePermissionsResponseDto,
  MeResponseDto,
} from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';

@Controller('cms/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiCreatedResponse({ description: 'Access token and user profile', type: LoginResponseDto })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Current authenticated user profile', type: MeResponseDto })
  @Get('me')
  me(@Request() request: { user: { id: string } }) {
    return this.authService.me(request.user.id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'List of permission codes for the current user', type: MePermissionsResponseDto })
  @Get('me/permissions')
  async mePermissions(@Request() request: { user: { id: string } }) {
    const me = await this.authService.me(request.user.id);
    return { permissions: me.permissions };
  }
}
