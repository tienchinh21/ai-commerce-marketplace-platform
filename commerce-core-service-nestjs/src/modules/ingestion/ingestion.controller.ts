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
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { IngestionService } from './ingestion.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import { DataSourceEntity } from './data-source.entity';
import { SyncRun } from './sync-run.entity';
import { RawSnapshot } from './raw-snapshot.entity';
import { CreateDataSourceDto } from './dto/create-data-source.dto';
import { UpdateDataSourceDto } from './dto/update-data-source.dto';
import { ImportProductsDto } from './dto/import-products.dto';
import { ImportReviewsDto } from './dto/import-reviews.dto';

@Controller('cms')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Permissions('source:read')
  @ApiOkResponse({ type: [DataSourceEntity] })
  @Get('data-sources')
  listDataSources() {
    return this.ingestionService.listDataSources();
  }

  @Permissions('source:write')
  @ApiCreatedResponse({ type: DataSourceEntity })
  @Post('data-sources')
  createDataSource(@Body() body: CreateDataSourceDto) {
    return this.ingestionService.createDataSource(body);
  }

  @Permissions('source:read')
  @ApiOkResponse({ type: DataSourceEntity })
  @Get('data-sources/:id')
  getDataSource(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingestionService.getDataSource(id);
  }

  @Permissions('source:write')
  @ApiOkResponse({ type: DataSourceEntity })
  @Patch('data-sources/:id')
  updateDataSource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateDataSourceDto,
  ) {
    return this.ingestionService.updateDataSource(id, body);
  }

  @Permissions('source:read')
  @ApiOkResponse({ type: () => PaginatedResponseDto<SyncRun> })
  @Get('sync-runs')
  listSyncRuns(
    @Query('dataSourceId') dataSourceId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.ingestionService.listSyncRuns({
      dataSourceId,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Permissions('source:read')
  @ApiOkResponse({ type: SyncRun })
  @Get('sync-runs/:id')
  getSyncRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingestionService.getSyncRun(id);
  }

  @Permissions('source:read')
  @ApiOkResponse({ type: () => PaginatedResponseDto<RawSnapshot> })
  @Get('raw-snapshots')
  listRawSnapshots(
    @Query('dataSourceId') dataSourceId?: string,
    @Query('syncRunId') syncRunId?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.ingestionService.listRawSnapshots({
      dataSourceId,
      syncRunId,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Permissions('source:read')
  @ApiOkResponse({ type: RawSnapshot })
  @Get('raw-snapshots/:id')
  getRawSnapshot(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingestionService.getRawSnapshot(id);
  }

  @Permissions('source:sync')
  @ApiCreatedResponse({ type: SyncRun })
  @Post('imports/products')
  importProducts(@Body() body: ImportProductsDto) {
    return this.ingestionService.importProducts(body);
  }

  @Permissions('source:sync')
  @ApiCreatedResponse({ type: SyncRun })
  @Post('imports/reviews')
  importReviews(@Body() body: ImportReviewsDto) {
    return this.ingestionService.importReviews(body);
  }
}
