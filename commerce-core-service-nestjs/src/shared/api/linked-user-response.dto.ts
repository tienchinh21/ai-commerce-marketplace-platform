import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LinkedUserResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  displayName: string;
}
