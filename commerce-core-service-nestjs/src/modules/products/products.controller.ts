import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductDetailResponseDto } from './dto/product-detail-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { AddImagesDto } from './dto/add-images.dto';

@ApiBearerAuth()
@Controller('cms/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Permissions('product:read')
  @ApiOkResponse({ description: 'Paginated list of products', type: () => PaginatedResponseDto<Product> })
  @Get()
  list(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.productsService.list({
      search,
      categoryId,
      sellerId,
      status,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Permissions('product:write')
  @ApiCreatedResponse({ description: 'Created product', type: Product })
  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Permissions('product:read')
  @ApiOkResponse({ description: 'Product details', type: ProductDetailResponseDto })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getDetail(id);
  }

  @Permissions('product:write')
  @ApiOkResponse({ description: 'Updated product', type: Product })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Permissions('product:write')
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Permissions('product:read')
  @ApiOkResponse({ description: 'List of product variants', type: [ProductVariant] })
  @Get(':id/variants')
  listVariants(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.listVariants(id);
  }

  @Permissions('product:write')
  @ApiCreatedResponse({ description: 'Created product variant', type: ProductVariant })
  @Post(':id/variants')
  createVariant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateVariantDto,
  ) {
    return this.productsService.createVariant(id, body);
  }

  @Permissions('product:write')
  @ApiCreatedResponse({ description: 'Added product images', type: [ProductImage] })
  @Post(':id/images')
  addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddImagesDto,
  ) {
    return this.productsService.addImages(id, body.images);
  }
}
