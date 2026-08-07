import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SetPermissionsDto {
  @ApiProperty({ example: ['category:read', 'category:write'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  codes: string[];
}
