import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Permission } from '../auth/permission.entity';
import { UserPermission } from '../auth/user-permission.entity';
import { UsersPermissionsService } from './users-permissions.service';
import { CmsUsersPermissionsController } from './cms-users-permissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permission, UserPermission])],
  controllers: [CmsUsersPermissionsController],
  providers: [UsersPermissionsService],
  exports: [UsersPermissionsService],
})
export class UsersPermissionsModule {}
