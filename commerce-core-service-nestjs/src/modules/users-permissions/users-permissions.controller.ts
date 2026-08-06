import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UsersPermissionsService } from './users-permissions.service';
import { Permissions } from '../auth/permissions.decorator';
import {
  CreatedResourceResponseDto,
  MutationSuccessResponseDto,
  createCreated,
  createSuccess,
} from '../../shared/api/mutation-response.dto';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
import { toResponseDtoList } from '../../shared/api/response-serialization';
import { UserResponseDto } from './dto/user-response.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SetPermissionsDto } from './dto/set-permissions.dto';

@ApiBearerAuth()
@Controller('cms')
export class UsersPermissionsController {
  constructor(
    private readonly usersPermissionsService: UsersPermissionsService,
  ) {}

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Danh sách người dùng', type: [UserResponseDto] })
  @Get('users')
  async listUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersPermissionsService.listUsers();
    return toResponseDtoList(UserResponseDto, users);
  }

  @Permissions('category:read')
  @ApiCreatedResponse({ description: 'Tạo người dùng thành công', type: CreatedResourceResponseDto })
  @Post('users')
  async createUser(@Body() body: CreateUserDto): Promise<CreatedResourceResponseDto> {
    const user = await this.usersPermissionsService.createUser(body);
    return createCreated(user.id, VI_API_MESSAGES.success.USER_CREATED);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Danh sách quyền', type: [PermissionResponseDto] })
  @Get('permissions')
  async listPermissions(): Promise<PermissionResponseDto[]> {
    const permissions = await this.usersPermissionsService.listPermissions();
    return toResponseDtoList(PermissionResponseDto, permissions);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Danh sách quyền của người dùng', type: [String] })
  @Get('users/:id/permissions')
  async getUserPermissions(@Param('id', ParseUUIDPipe) id: string): Promise<string[]> {
    return this.usersPermissionsService.getUserPermissions(id);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Cập nhật quyền người dùng thành công', type: MutationSuccessResponseDto })
  @Put('users/:id/permissions')
  async setPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SetPermissionsDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.usersPermissionsService.setPermissions(id, body.codes);
    return createSuccess(VI_API_MESSAGES.success.USER_PERMISSIONS_UPDATED);
  }
}
