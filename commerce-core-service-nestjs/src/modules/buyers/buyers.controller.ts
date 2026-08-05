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
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { BuyersService } from './buyers.service';
import { Permissions } from '../auth/permissions.decorator';

class CreateBuyerDto {
  @IsEmail() email: string;
  @IsString() displayName: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() metadataJson?: Record<string, unknown>;
}

class UpdateBuyerDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() userId?: string;
  @IsOptional() metadataJson?: Record<string, unknown>;
}

@Controller('cms/buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Permissions('buyer:read')
  @Get()
  list(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.buyersService.list({
      search,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Permissions('buyer:write')
  @Post()
  create(@Body() body: CreateBuyerDto) {
    return this.buyersService.create(body);
  }

  @Permissions('buyer:read')
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.buyersService.get(id);
  }

  @Permissions('buyer:write')
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateBuyerDto) {
    return this.buyersService.update(id, body);
  }
}
