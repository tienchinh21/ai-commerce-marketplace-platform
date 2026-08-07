import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RawSnapshotResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ format: 'uuid' })
  dataSourceId: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  syncRunId: string | null;

  @Expose()
  @ApiProperty()
  contentType: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  contentHash: string | null;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  objectStorageKey: string | null;

  @Expose()
  @ApiProperty()
  parseStatus: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  errorMessage: string | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
