import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SyncRunResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  dataSourceId: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ nullable: true, type: Date })
  startedAt: Date | null;

  @Expose()
  @ApiProperty({ nullable: true, type: Date })
  finishedAt: Date | null;

  @Expose()
  @ApiProperty()
  totalRecords: number;

  @Expose()
  @ApiProperty()
  successCount: number;

  @Expose()
  @ApiProperty()
  failedCount: number;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  errorSummary: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
