import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import {
  CreatedResourceResponseDto,
  BulkCreatedResourceResponseDto,
  MutationSuccessResponseDto,
  createCreated,
  createBulkCreated,
  createSuccess,
} from '../../shared/api/mutation-response.dto';
import { toPaginatedResponseDto, toResponseDto, toResponseDtoList } from '../../shared/api/response-serialization';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductDetailResponseDto } from './dto/product-detail-response.dto';
import { ProductVariantResponseDto } from './dto/product-variant-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { AddImagesDto } from './dto/add-images.dto';

@ApiBearerAuth()
@Controller('cms/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Permissions('product:read')
  @ApiOkResponse({ description: 'Paginated list of products', type: () => PaginatedResponseDto<ProductResponseDto> })
  @Get()
  async list(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const pageResult = await this.productsService.list({
      search,
      categoryId,
      sellerId,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return toPaginatedResponseDto(ProductResponseDto, pageResult);
  }

  @Permissions('product:write')
  @ApiCreatedResponse({ description: 'Created product', type: CreatedResourceResponseDto })
  @Post()
  async create(@Body() body: CreateProductDto): Promise<CreatedResourceResponseDto> {
    const product = await this.productsService.create(body);
    return createCreated(product.id, 'Product created successfully');
  }

  @Permissions('product:read')
  @ApiOkResponse({ description: 'Product details', type: ProductDetailResponseDto })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ProductDetailResponseDto> {
    const product = await this.productsService.getDetail(id);
    return toResponseDto(ProductDetailResponseDto, product);
  }

  @Permissions('product:write')
  @ApiOkResponse({ description: 'Product updated successfully', type: MutationSuccessResponseDto })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProductDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.productsService.update(id, body);
    return createSuccess('Product updated successfully');
  }

  @Permissions('product:write')
  @ApiNoContentResponse({ description: 'Product deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.productsService.remove(id);
  }

  @Permissions('product:read')
  @ApiOkResponse({ description: 'List of product variants', type: [ProductVariantResponseDto] })
  @Get(':id/variants')
  async listVariants(@Param('id', ParseUUIDPipe) id: string): Promise<ProductVariantResponseDto[]> {
    const variants = await this.productsService.listVariants(id);
    return toResponseDtoList(ProductVariantResponseDto, variants);
  }

  @Permissions('product:write')
  @ApiCreatedResponse({ description: 'Created product variant', type: CreatedResourceResponseDto })
  @Post(':id/variants')
  async createVariant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateVariantDto,
  ): Promise<CreatedResourceResponseDto> {
    const variant = await this.productsService.createVariant(id, body);
    return createCreated(variant.id, 'Product variant created successfully');
  }

  @Permissions('product:write')
  @ApiCreatedResponse({ description: 'Added product images', type: BulkCreatedResourceResponseDto })
  @Post(':id/images')
  async addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddImagesDto,
  ): Promise<BulkCreatedResourceResponseDto> {
    const images = await this.productsService.addImages(id, body.images);
    return createBulkCreated(
      images.map((image) => image.id),
      'Product images added successfully',
    );
  }
}
