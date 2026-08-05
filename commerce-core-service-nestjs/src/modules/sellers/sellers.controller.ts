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
import { SellersService } from './sellers.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import { Seller } from './seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Controller('cms/sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Permissions('seller:read')
  @ApiOkResponse({ type: () => PaginatedResponseDto<Seller> })
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
  @ApiCreatedResponse({ type: Seller })
  @Post()
  create(@Body() body: CreateSellerDto) {
    return this.sellersService.create(body);
  }

  @Permissions('seller:read')
  @ApiOkResponse({ type: Seller })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.sellersService.get(id);
  }

  @Permissions('seller:write')
  @ApiOkResponse({ type: Seller })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSellerDto,
  ) {
    return this.sellersService.update(id, body);
  }
}
