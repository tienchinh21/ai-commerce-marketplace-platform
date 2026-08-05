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
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UsersPermissionsService } from './users-permissions.service';
import { Permissions } from '../auth/permissions.decorator';
import { User } from '../auth/user.entity';
import { Permission } from '../auth/permission.entity';

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

@Controller('cms')
export class UsersPermissionsController {
  constructor(
    private readonly usersPermissionsService: UsersPermissionsService,
  ) {}

  @Permissions('category:read')
  @ApiOkResponse({ type: [User] })
  @Get('users')
  listUsers() {
    return this.usersPermissionsService.listUsers();
  }

  @Permissions('category:read')
  @ApiCreatedResponse({ type: User })
  @Post('users')
  createUser(@Body() body: CreateUserDto) {
    return this.usersPermissionsService.createUser(body);
  }

  @Permissions('category:read')
  @ApiOkResponse({ type: [Permission] })
  @Get('permissions')
  listPermissions() {
    return this.usersPermissionsService.listPermissions();
  }

  @Permissions('category:read')
  @ApiOkResponse({ type: [String] })
  @Get('users/:id/permissions')
  getUserPermissions(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersPermissionsService.getUserPermissions(id);
  }

  @Permissions('category:read')
  @ApiOkResponse()
  @Put('users/:id/permissions')
  setPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SetPermissionsDto,
  ) {
    return this.usersPermissionsService.setPermissions(id, body.codes);
  }
}
