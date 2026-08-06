import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiBearerAuth()
@Controller('cms/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Permissions('product:read')
  @ApiOkResponse({ description: 'Paginated list of orders', type: () => PaginatedResponseDto<Order> })
  @Get()
  list(
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.ordersService.list({
      buyerId,
      sellerId,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Permissions('product:read')
  @ApiOkResponse({ description: 'Order details', type: Order })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.get(id);
  }

  @Permissions('product:write')
  @ApiCreatedResponse({ description: 'Created order', type: Order })
  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }
}
