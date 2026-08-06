import { ApiProperty } from '@nestjs/swagger';

export class MutationSuccessResponseDto {
  @ApiProperty({ example: true })
  success: true;

  @ApiProperty({ example: 'Cập nhật dữ liệu thành công.' })
  message: string;
}

export class CreatedResourceResponseDto extends MutationSuccessResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
}

export class BulkCreatedResourceResponseDto extends MutationSuccessResponseDto {
  @ApiProperty({ type: [String], format: 'uuid' })
  ids: string[];

  @ApiProperty({ example: 2 })
  count: number;
}

export function createSuccess(message: string): MutationSuccessResponseDto {
  return { success: true, message };
}

export function createCreated(
  id: string,
  message: string,
): CreatedResourceResponseDto {
  return { success: true, id, message };
}

export function createBulkCreated(
  ids: string[],
  message: string,
): BulkCreatedResourceResponseDto {
  return { success: true, ids, count: ids.length, message };
}
