import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import {
  CreatedResourceResponseDto,
  createCreated,
} from '../../shared/api/mutation-response.dto';
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
import {
  toPaginatedResponseDto,
  toResponseDto,
} from '../../shared/api/response-serialization';
import {
  OrderResponseDto,
  OrderDetailResponseDto,
} from './dto/cms/order-response.dto';
import { CreateOrderDto } from './dto/cms/create-order.dto';

@ApiBearerAuth()
@Controller('cms/orders')
export class CmsOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Permissions('product:read')
  @ApiOkResponse({
    description: 'Danh sách đơn hàng có phân trang',
    type: () => PaginatedResponseDto<OrderResponseDto>,
  })
  @Get()
  async list(
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResponseDto<OrderResponseDto>> {
    const result = await this.ordersService.list({
      buyerId,
      sellerId,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return toPaginatedResponseDto(OrderResponseDto, result);
  }

  @Permissions('product:read')
  @ApiOkResponse({
    description: 'Chi tiết đơn hàng',
    type: OrderDetailResponseDto,
  })
  @Get(':id')
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderDetailResponseDto> {
    const order = await this.ordersService.get(id);
    return toResponseDto(OrderDetailResponseDto, order);
  }

  @Permissions('product:write')
  @ApiCreatedResponse({
    description: 'Tạo đơn hàng thành công',
    type: CreatedResourceResponseDto,
  })
  @Post()
  async create(
    @Body() body: CreateOrderDto,
  ): Promise<CreatedResourceResponseDto> {
    const order = await this.ordersService.create(body);
    return createCreated(order.id, VI_API_MESSAGES.success.ORDER_CREATED);
  }
}
