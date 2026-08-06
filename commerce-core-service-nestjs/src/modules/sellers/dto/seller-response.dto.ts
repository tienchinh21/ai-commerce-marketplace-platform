import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SellerResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty({ nullable: true, format: 'uuid' })
  userId: string | null;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty()
  status: string;

  @Expose()
  @ApiProperty({ type: 'object', additionalProperties: true })
  metadataJson: Record<string, unknown>;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class SellerDetailResponseDto extends SellerResponseDto {}
