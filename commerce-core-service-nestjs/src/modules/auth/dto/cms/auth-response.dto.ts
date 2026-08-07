import { ApiProperty } from '@nestjs/swagger';

class AuthUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty({ type: [String] })
  permissions: string[];
}

export class LoginResponseDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: 'Đăng nhập thành công.' })
  message: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class MeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty({ type: [String] })
  permissions: string[];
}

export class MePermissionsResponseDto {
  @ApiProperty({ type: [String] })
  permissions: string[];
}

export class RefreshResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: 'Đăng xuất thành công.' })
  message: string;
}
