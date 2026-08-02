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
import { IsOptional, IsString } from 'class-validator';
import { SellersService } from './sellers.service';
import { Permissions } from '../auth/permissions.decorator';

class CreateSellerDto {
  @IsString() name: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() metadataJson?: Record<string, unknown>;
}

class UpdateSellerDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() metadataJson?: Record<string, unknown>;
}

@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Permissions('seller:read')
  @Get()
  list(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.sellersService.list({
      search,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Permissions('seller:write')
  @Post()
  create(@Body() body: CreateSellerDto) {
    return this.sellersService.create(body);
  }

  @Permissions('seller:read')
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.sellersService.get(id);
  }

  @Permissions('seller:write')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSellerDto,
  ) {
    return this.sellersService.update(id, body);
  }
}
