import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'Import finished' })
  message: string;
}

export function toImportRunResponse(run: {
  id: string;
  status: string;
  totalRecords: number;
  successCount: number;
  failedCount: number;
}): ImportRunResponseDto {
  return {
    success: run.failedCount === 0,
    syncRunId: run.id,
    status: run.status,
    totalRecords: run.totalRecords,
    successCount: run.successCount,
    failedCount: run.failedCount,
    message:
      run.failedCount === 0
        ? 'Import finished successfully'
        : 'Import finished with errors',
  };
}
