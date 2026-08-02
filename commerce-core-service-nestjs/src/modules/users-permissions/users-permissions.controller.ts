import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Post,
} from '@nestjs/common';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';
import { UsersPermissionsService } from './users-permissions.service';
import { Permissions } from '../auth/permissions.decorator';

class CreateUserDto {
  @IsEmail() email: string;
  @IsString() password: string;
  @IsString() displayName: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) permissionCodes?: string[];
}

class SetPermissionsDto {
  @IsArray() @IsString({ each: true }) codes: string[];
}

@Controller()
export class UsersPermissionsController {
  constructor(
    private readonly usersPermissionsService: UsersPermissionsService,
  ) {}

  @Permissions('category:read')
  @Get('users')
  listUsers() {
    return this.usersPermissionsService.listUsers();
  }

  @Permissions('category:read')
  @Post('users')
  createUser(@Body() body: CreateUserDto) {
    return this.usersPermissionsService.createUser(body);
  }

  @Permissions('category:read')
  @Get('permissions')
  listPermissions() {
    return this.usersPermissionsService.listPermissions();
  }

  @Permissions('category:read')
  @Get('users/:id/permissions')
  getUserPermissions(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersPermissionsService.getUserPermissions(id);
  }

  @Permissions('category:read')
  @Put('users/:id/permissions')
  setPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SetPermissionsDto,
  ) {
    return this.usersPermissionsService.setPermissions(id, body.codes);
  }
}
