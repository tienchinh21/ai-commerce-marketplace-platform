import { ApiProperty } from '@nestjs/swagger';
import { ApiErrorCode } from './api-error-code';

export class ApiErrorDetailDto {
  @ApiProperty({ example: 'email' })
  field?: string;

  @ApiProperty({ example: 'Email không hợp lệ.' })
  message: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: false;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ enum: ApiErrorCode, example: ApiErrorCode.VALIDATION_FAILED })
  code: ApiErrorCode | string;

  @ApiProperty({ example: 'Dữ liệu gửi lên không hợp lệ.' })
  message: string;

  @ApiProperty({ type: [ApiErrorDetailDto], required: false })
  details?: ApiErrorDetailDto[];

  @ApiProperty({ example: '2026-08-06T00:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/cms/products' })
  path: string;

  @ApiProperty({ example: 'POST' })
  method: string;
}
