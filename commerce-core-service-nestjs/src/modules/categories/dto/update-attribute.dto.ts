import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAttributeDto {
  @ApiPropertyOptional({ example: 'Color' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ example: 'string' })
  @IsOptional()
  @IsString()
  dataType?: string;

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
