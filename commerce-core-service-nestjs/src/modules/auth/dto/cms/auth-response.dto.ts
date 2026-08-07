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
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user: AuthUserResponseDto;
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
