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
import { SellersService } from './sellers.service';
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
  SellerResponseDto,
  SellerDetailResponseDto,
} from './dto/cms/seller-response.dto';
import { CreateSellerDto } from './dto/cms/create-seller.dto';
import { UpdateSellerDto } from './dto/cms/update-seller.dto';

@ApiBearerAuth()
@Controller('cms/sellers')
export class CmsSellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Permissions('seller:read')
  @ApiOkResponse({
    description: 'Danh sách nhà bán hàng có phân trang',
    type: () => PaginatedResponseDto<SellerResponseDto>,
  })
  @Get()
  async list(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResponseDto<SellerResponseDto>> {
    const result = await this.sellersService.list({
      search,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return toPaginatedResponseDto(SellerResponseDto, result);
  }

  @Permissions('seller:write')
  @ApiCreatedResponse({
    description: 'Tạo nhà bán hàng thành công',
    type: CreatedResourceResponseDto,
  })
  @Post()
  async create(
    @Body() body: CreateSellerDto,
  ): Promise<CreatedResourceResponseDto> {
    const seller = await this.sellersService.create(body);
    return createCreated(seller.id, VI_API_MESSAGES.success.SELLER_CREATED);
  }

  @Permissions('seller:read')
  @ApiOkResponse({
    description: 'Chi tiết nhà bán hàng',
    type: SellerDetailResponseDto,
  })
  @Get(':id')
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SellerDetailResponseDto> {
    const seller = await this.sellersService.get(id);
    return toResponseDto(SellerDetailResponseDto, seller);
  }

  @Permissions('seller:write')
  @ApiOkResponse({
    description: 'Cập nhật nhà bán hàng thành công',
    type: MutationSuccessResponseDto,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSellerDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.sellersService.update(id, body);
    return createSuccess(VI_API_MESSAGES.success.SELLER_UPDATED);
  }
}
