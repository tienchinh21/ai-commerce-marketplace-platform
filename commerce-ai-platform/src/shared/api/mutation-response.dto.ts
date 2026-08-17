import { ApiProperty } from '@nestjs/swagger';

export class MutationResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Thao tác thành công' })
  message: string;

  @ApiProperty({ required: false, example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8' })
  id?: string;
}
