import { ApiProperty } from '@nestjs/swagger';
import { VI_API_MESSAGES } from '../../../shared/api/api-messages.vi';

export class ImportRunResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ format: 'uuid' })
  syncRunId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  totalRecords: number;

  @ApiProperty()
  successCount: number;

  @ApiProperty()
  failedCount: number;

  @ApiProperty({ example: 'Nhập sản phẩm hoàn tất.' })
  message: string;
}

export type ImportRunKind = 'products' | 'reviews';

export function toImportRunResponse(
  run: {
    id: string;
    status: string;
    totalRecords: number;
    successCount: number;
    failedCount: number;
  },
  kind: ImportRunKind,
): ImportRunResponseDto {
  const success = run.failedCount === 0;
  const message =
    kind === 'products'
      ? success
        ? VI_API_MESSAGES.success.IMPORT_PRODUCTS_COMPLETED
        : VI_API_MESSAGES.success.IMPORT_PRODUCTS_COMPLETED_WITH_ERRORS
      : success
        ? VI_API_MESSAGES.success.IMPORT_REVIEWS_COMPLETED
        : VI_API_MESSAGES.success.IMPORT_REVIEWS_COMPLETED_WITH_ERRORS;

  return {
    success,
    syncRunId: run.id,
    status: run.status,
    totalRecords: run.totalRecords,
    successCount: run.successCount,
    failedCount: run.failedCount,
    message,
  };
}
