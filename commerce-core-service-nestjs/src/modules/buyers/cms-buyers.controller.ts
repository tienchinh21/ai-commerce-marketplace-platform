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
import { BuyersService } from './buyers.service';
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
} from '../../shared/api/response-serialization';
import {
  BuyerResponseDto,
  BuyerDetailResponseDto,
} from './dto/cms/buyer-response.dto';
import { CreateBuyerDto } from './dto/cms/create-buyer.dto';
import { UpdateBuyerDto } from './dto/cms/update-buyer.dto';

@ApiBearerAuth()
@Controller('cms/buyers')
export class CmsBuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Permissions('buyer:read')
  @ApiOkResponse({
    description: 'Danh sách người mua có phân trang',
    type: () => PaginatedResponseDto<BuyerResponseDto>,
  })
  @Get()
  async list(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResponseDto<BuyerResponseDto>> {
    const result = await this.buyersService.list({
      search,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return toPaginatedResponseDto(BuyerResponseDto, result);
  }

  @Permissions('buyer:write')
  @ApiCreatedResponse({
    description: 'Tạo người mua thành công',
    type: CreatedResourceResponseDto,
  })
  @Post()
  async create(
    @Body() body: CreateBuyerDto,
  ): Promise<CreatedResourceResponseDto> {
    const buyer = await this.buyersService.create(body);
    return createCreated(buyer.id, VI_API_MESSAGES.success.BUYER_CREATED);
  }

  @Permissions('buyer:read')
  @ApiOkResponse({
    description: 'Chi tiết người mua',
    type: BuyerDetailResponseDto,
  })
  @Get(':id')
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BuyerDetailResponseDto> {
    const buyer = await this.buyersService.get(id);
    return toResponseDto(BuyerDetailResponseDto, buyer);
  }

  @Permissions('buyer:write')
  @ApiOkResponse({
    description: 'Cập nhật người mua thành công',
    type: MutationSuccessResponseDto,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateBuyerDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.buyersService.update(id, body);
    return createSuccess(VI_API_MESSAGES.success.BUYER_UPDATED);
  }
}
