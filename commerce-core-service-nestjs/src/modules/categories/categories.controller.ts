import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Permissions } from '../auth/permissions.decorator';
import { Category } from './category.entity';
import { CategoryAttribute } from './category-attribute.entity';

class CreateCategoryDto {
  @IsOptional() @IsString() parentId?: string;
  @IsString() name: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() status?: string;
}

class UpdateCategoryDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() status?: string;
}

class CreateAttributeDto {
  @IsString() code: string;
  @IsString() label: string;
  @IsString() dataType: string;
  @IsOptional() @IsBoolean() isFilterable?: boolean;
  @IsOptional() @IsBoolean() isSearchable?: boolean;
  @IsOptional() @IsBoolean() isRequired?: boolean;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() optionsJson?: Record<string, unknown>;
}

class UpdateAttributeDto {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() dataType?: string;
  @IsOptional() @IsBoolean() isFilterable?: boolean;
  @IsOptional() @IsBoolean() isSearchable?: boolean;
  @IsOptional() @IsBoolean() isRequired?: boolean;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() optionsJson?: Record<string, unknown>;
}

@Controller('cms/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Permissions('category:read')
  @ApiOkResponse({ type: [Category] })
  @Get()
  list() {
    return this.categoriesService.list();
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ type: Category })
  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Permissions('category:read')
  @ApiOkResponse({ type: Category })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.get(id);
  }

  @Permissions('category:write')
  @ApiOkResponse({ type: Category })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, body);
  }

  @Permissions('category:write')
  @ApiOkResponse()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @Permissions('category:read')
  @ApiOkResponse({ type: [CategoryAttribute] })
  @Get(':id/attributes')
  listAttributes(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.listAttributes(id);
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ type: CategoryAttribute })
  @Post(':id/attributes')
  createAttribute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAttributeDto,
  ) {
    return this.categoriesService.createAttribute(id, body);
  }

  @Permissions('category:write')
  @ApiOkResponse({ type: CategoryAttribute })
  @Patch('attributes/:attributeId')
  updateAttribute(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
    @Body() body: UpdateAttributeDto,
  ) {
    return this.categoriesService.updateAttribute(attributeId, body);
  }

  @Permissions('category:write')
  @ApiOkResponse()
  @Delete('attributes/:attributeId')
  removeAttribute(@Param('attributeId', ParseUUIDPipe) attributeId: string) {
    return this.categoriesService.removeAttribute(attributeId);
  }
}
