import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import {
  LoginResponseDto,
  MePermissionsResponseDto,
  MeResponseDto,
} from './dto/auth-response.dto';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}

@Controller('cms/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiCreatedResponse({ type: LoginResponseDto })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @ApiOkResponse({ type: MeResponseDto })
  @Get('me')
  me(@Request() request: { user: { id: string } }) {
    return this.authService.me(request.user.id);
  }

  @ApiOkResponse({ type: MePermissionsResponseDto })
  @Get('me/permissions')
  async mePermissions(@Request() request: { user: { id: string } }) {
    const me = await this.authService.me(request.user.id);
    return { permissions: me.permissions };
  }
}
