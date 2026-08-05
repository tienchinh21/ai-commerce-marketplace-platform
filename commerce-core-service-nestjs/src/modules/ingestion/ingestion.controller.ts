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
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IngestionService } from './ingestion.service';
import { Permissions } from '../auth/permissions.decorator';

class CreateDataSourceDto {
  @IsString() name: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() baseUrl?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() configJson?: Record<string, unknown>;
}

class UpdateDataSourceDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() baseUrl?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() configJson?: Record<string, unknown>;
}

class ImportProductItemDto {
  @IsString() sourceProductId: string;
  @IsString() title: string;
  @IsString() sellerId: string;
  @IsString() categoryId: string;
  @IsOptional() @IsNumber() @Min(0) priceMin?: number;
  @IsOptional() @IsNumber() @Min(0) priceMax?: number;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() specs?: Record<string, unknown>;
}

class ImportProductsDto {
  @IsString() dataSourceId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportProductItemDto)
  items: ImportProductItemDto[];
}

class ImportReviewItemDto {
  @IsString() sourceReviewId: string;
  @IsString() sourceProductId: string;
  @IsString() productId: string;
  @IsOptional() @IsString() buyerId?: string;
  @IsOptional() @IsString() sellerId?: string;
  @IsNumber() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
}

class ImportReviewsDto {
  @IsString() dataSourceId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportReviewItemDto)
  items: ImportReviewItemDto[];
}

@Controller('cms')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Permissions('source:read')
  @Get('data-sources')
  listDataSources() {
    return this.ingestionService.listDataSources();
  }

  @Permissions('source:write')
  @Post('data-sources')
  createDataSource(@Body() body: CreateDataSourceDto) {
    return this.ingestionService.createDataSource(body);
  }

  @Permissions('source:read')
  @Get('data-sources/:id')
  getDataSource(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingestionService.getDataSource(id);
  }

  @Permissions('source:write')
  @Patch('data-sources/:id')
  updateDataSource(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateDataSourceDto,
  ) {
    return this.ingestionService.updateDataSource(id, body);
  }

  @Permissions('source:read')
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
  @Get('sync-runs/:id')
  getSyncRun(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingestionService.getSyncRun(id);
  }

  @Permissions('source:read')
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
  @Get('raw-snapshots/:id')
  getRawSnapshot(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingestionService.getRawSnapshot(id);
  }

  @Permissions('source:sync')
  @Post('imports/products')
  importProducts(@Body() body: ImportProductsDto) {
    return this.ingestionService.importProducts(body);
  }

  @Permissions('source:sync')
  @Post('imports/reviews')
  importReviews(@Body() body: ImportReviewsDto) {
    return this.ingestionService.importReviews(body);
  }
}
