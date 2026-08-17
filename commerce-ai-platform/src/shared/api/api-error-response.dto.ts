import { ApiProperty } from '@nestjs/swagger';
import { ApiErrorCode } from './api-error-code';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ enum: ApiErrorCode, example: ApiErrorCode.VALIDATION_ERROR })
  errorCode: ApiErrorCode | string;

  @ApiProperty({ example: 'Dữ liệu đầu vào không hợp lệ' })
  message: string;

  @ApiProperty({ required: false, example: ['Query không được để trống'] })
  errors?: string[];

  @ApiProperty({ example: '2026-08-17T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/ai/search/products' })
  path: string;
}
