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
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductsService } from './products.service';
import { Permissions } from '../auth/permissions.decorator';

class CreateProductDto {
  @IsString() sellerId: string;
  @IsString() categoryId: string;
  @IsString() title: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsNumber() priceMin?: number;
  @IsOptional() @IsNumber() priceMax?: number;
  @IsOptional() specsJson?: Record<string, unknown>;
}

class UpdateProductDto {
  @IsOptional() @IsString() sellerId?: string;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsNumber() priceMin?: number;
  @IsOptional() @IsNumber() priceMax?: number;
  @IsOptional() specsJson?: Record<string, unknown>;
}

class CreateVariantDto {
  @IsString() sku: string;
  @IsOptional() @IsString() title?: string;
  @IsNumber() price: number;
  @IsOptional() @IsInt() @Min(0) stockQuantity?: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() specsJson?: Record<string, unknown>;
}

class AddImageDto {
  @IsString() url: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsString() altText?: string;
}

class AddImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddImageDto)
  images: AddImageDto[];
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Permissions('product:read')
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
  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Permissions('product:read')
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getDetail(id);
  }

  @Permissions('product:write')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Permissions('product:write')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Permissions('product:read')
  @Get(':id/variants')
  listVariants(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.listVariants(id);
  }

  @Permissions('product:write')
  @Post(':id/variants')
  createVariant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateVariantDto,
  ) {
    return this.productsService.createVariant(id, body);
  }

  @Permissions('product:write')
  @Post(':id/images')
  addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddImagesDto,
  ) {
    return this.productsService.addImages(id, body.images);
  }
}
