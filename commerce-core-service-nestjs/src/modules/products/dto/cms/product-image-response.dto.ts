import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductImageResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  altText: string | null;

  @Expose()
  @ApiProperty()
  sortOrder: number;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
