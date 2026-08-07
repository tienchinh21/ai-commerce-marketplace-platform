import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DataSourceResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  type: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  baseUrl: string | null;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
