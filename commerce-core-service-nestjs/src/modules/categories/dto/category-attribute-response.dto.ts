import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryAttributeResponseDto {
  @Expose()
  @ApiProperty({ format: 'uuid' })
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  label: string;

  @Expose()
  @ApiProperty()
  dataType: string;

  @Expose()
  @ApiProperty()
  isFilterable: boolean;

  @Expose()
  @ApiProperty()
  isSearchable: boolean;

  @Expose()
  @ApiProperty()
  isRequired: boolean;

  @Expose()
  @ApiProperty({ nullable: true, type: String })
  unit: string | null;

  @Expose()
  @ApiProperty({ nullable: true, type: 'object', additionalProperties: true })
  optionsJson: Record<string, unknown> | null;

  @Expose()
  @ApiProperty({ type: Date })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: Date })
  updatedAt: Date;
}
