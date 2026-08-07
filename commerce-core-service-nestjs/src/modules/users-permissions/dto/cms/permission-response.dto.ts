import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PermissionResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
