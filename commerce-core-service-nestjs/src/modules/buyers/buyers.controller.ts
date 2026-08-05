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
import { BuyersService } from './buyers.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import { Buyer } from './buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Controller('cms/buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Permissions('buyer:read')
  @ApiOkResponse({ type: () => PaginatedResponseDto<Buyer> })
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
  @ApiCreatedResponse({ type: Buyer })
  @Post()
  create(@Body() body: CreateBuyerDto) {
    return this.buyersService.create(body);
  }

  @Permissions('buyer:read')
  @ApiOkResponse({ type: Buyer })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.buyersService.get(id);
  }

  @Permissions('buyer:write')
  @ApiOkResponse({ type: Buyer })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateBuyerDto) {
    return this.buyersService.update(id, body);
  }
}
