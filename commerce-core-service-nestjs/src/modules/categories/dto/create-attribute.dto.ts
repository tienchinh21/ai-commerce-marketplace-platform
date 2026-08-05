import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({ example: 'color' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Color' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  dataType: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFilterable?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isSearchable?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ example: 'cm' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: { values: ['red', 'blue', 'green'] }, type: 'object', additionalProperties: true })
  @IsOptional()
  optionsJson?: Record<string, unknown>;
}
