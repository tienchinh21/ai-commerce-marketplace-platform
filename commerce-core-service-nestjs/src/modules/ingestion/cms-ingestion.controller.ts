import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import {
  CreatedResourceResponseDto,
  MutationSuccessResponseDto,
  createCreated,
  createSuccess,
} from '../../shared/api/mutation-response.dto';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
import {
  toPaginatedResponseDto,
  toResponseDto,
  toResponseDtoList,
} from '../../shared/api/response-serialization';
import { DataSourceResponseDto } from './dto/cms/data-source-response.dto';
import { SyncRunResponseDto } from './dto/cms/sync-run-response.dto';
import { RawSnapshotResponseDto } from './dto/cms/raw-snapshot-response.dto';
import {
  ImportRunResponseDto,
  toImportRunResponse,
} from './dto/cms/import-run-response.dto';
import { CreateDataSourceDto } from './dto/cms/create-data-source.dto';
import { UpdateDataSourceDto } from './dto/cms/update-data-source.dto';
import { ImportProductsDto } from './dto/cms/import-products.dto';
import { ImportReviewsDto } from './dto/cms/import-reviews.dto';

@ApiBearerAuth()
@Controller('cms')
export class CmsIngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Permissions('source:read')
  @ApiOkResponse({
    description: 'Danh sách nguồn dữ liệu',
    type: [DataSourceResponseDto],
  })
  @Get('data-sources')
  async listDataSources(): Promise<DataSourceResponseDto[]> {
    return toResponseDtoList(
      DataSourceResponseDto,
      await this.ingestionService.listDataSources(),
    );
  }

  @Permissions('source:write')
  @ApiCreatedResponse({
    description: 'Tạo nguồn dữ liệu thành công',
    type: CreatedResourceResponseDto,
  })
  @Post('data-sources')
  async createDataSource(
    @Body() body: CreateDataSourceDto,
  ): Promise<CreatedResourceResponseDto> {
    const source = await this.ingestionService.createDataSource(body);
    return createCreated(
      source.id,
      VI_API_MESSAGES.success.DATA_SOURCE_CREATED,
    );
  }

  @Permissions('source:read')
  @ApiOkResponse({
    description: 'Chi tiết nguồn dữ liệu',
    type: DataSourceResponseDto,
  })
  @Get('data-sources/:id')
  async getDataSource(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DataSourceResponseDto> {
    return toResponseDto(
      DataSourceResponseDto,
      await this.ingestionService.getDataSource(id),
    );
  }

  @Permissions('source:write')
  @ApiOkResponse({
    description: 'Cập nhật nguồn dữ liệu thành công',
    type: MutationSuccessResponseDto,
  })
  @Patch('data-sources/:id')
  async updateDataSource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateDataSourceDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.ingestionService.updateDataSource(id, body);
    return createSuccess(VI_API_MESSAGES.success.DATA_SOURCE_UPDATED);
  }

  @Permissions('source:read')
  @ApiOkResponse({
    description: 'Danh sách lượt đồng bộ có phân trang',
    type: () => PaginatedResponseDto<SyncRunResponseDto>,
  })
  @Get('sync-runs')
  async listSyncRuns(
    @Query('dataSourceId') dataSourceId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResponseDto<SyncRunResponseDto>> {
    return toPaginatedResponseDto(
      SyncRunResponseDto,
      await this.ingestionService.listSyncRuns({
        dataSourceId,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      }),
    );
  }

  @Permissions('source:read')
  @ApiOkResponse({
    description: 'Chi tiết lượt đồng bộ',
    type: SyncRunResponseDto,
  })
  @Get('sync-runs/:id')
  async getSyncRun(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SyncRunResponseDto> {
    return toResponseDto(
      SyncRunResponseDto,
      await this.ingestionService.getSyncRun(id),
    );
  }

  @Permissions('source:read')
  @ApiOkResponse({
    description: 'Danh sách bản ghi dữ liệu thô có phân trang',
    type: () => PaginatedResponseDto<RawSnapshotResponseDto>,
  })
  @Get('raw-snapshots')
  async listRawSnapshots(
    @Query('dataSourceId') dataSourceId?: string,
    @Query('syncRunId') syncRunId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResponseDto<RawSnapshotResponseDto>> {
    return toPaginatedResponseDto(
      RawSnapshotResponseDto,
      await this.ingestionService.listRawSnapshots({
        dataSourceId,
        syncRunId,
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      }),
    );
  }

  @Permissions('source:read')
  @ApiOkResponse({
    description: 'Chi tiết bản ghi dữ liệu thô',
    type: RawSnapshotResponseDto,
  })
  @Get('raw-snapshots/:id')
  async getRawSnapshot(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RawSnapshotResponseDto> {
    return toResponseDto(
      RawSnapshotResponseDto,
      await this.ingestionService.getRawSnapshot(id),
    );
  }

  @Permissions('source:sync')
  @ApiCreatedResponse({
    description: 'Kết quả nhập sản phẩm',
    type: ImportRunResponseDto,
  })
  @Post('imports/products')
  async importProducts(
    @Body() body: ImportProductsDto,
  ): Promise<ImportRunResponseDto> {
    return toImportRunResponse(
      await this.ingestionService.importProducts(body),
      'products',
    );
  }

  @Permissions('source:sync')
  @ApiCreatedResponse({
    description: 'Kết quả nhập đánh giá',
    type: ImportRunResponseDto,
  })
  @Post('imports/reviews')
  async importReviews(
    @Body() body: ImportReviewsDto,
  ): Promise<ImportRunResponseDto> {
    return toImportRunResponse(
      await this.ingestionService.importReviews(body),
      'reviews',
    );
  }
}
