import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Permission } from '../auth/permission.entity';
import { UserPermission } from '../auth/user-permission.entity';
import { UsersPermissionsService } from './users-permissions.service';
import { UsersPermissionsController } from './users-permissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permission, UserPermission])],
  controllers: [UsersPermissionsController],
  providers: [UsersPermissionsService],
  exports: [UsersPermissionsService],
})
export class UsersPermissionsModule {}
