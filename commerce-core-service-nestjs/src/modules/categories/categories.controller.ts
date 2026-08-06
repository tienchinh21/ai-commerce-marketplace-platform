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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Permissions } from '../auth/permissions.decorator';
import { Category } from './category.entity';
import { CategoryAttribute } from './category-attribute.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@ApiBearerAuth()
@Controller('cms/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Permissions('category:read')
  @ApiOkResponse({ description: 'List of categories', type: [Category] })
  @Get()
  list() {
    return this.categoriesService.list();
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ description: 'Created category', type: Category })
  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Category details', type: Category })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.get(id);
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Updated category', type: Category })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, body);
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Category deleted successfully' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'List of category attributes', type: [CategoryAttribute] })
  @Get(':id/attributes')
  listAttributes(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.listAttributes(id);
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ description: 'Created category attribute', type: CategoryAttribute })
  @Post(':id/attributes')
  createAttribute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAttributeDto,
  ) {
    return this.categoriesService.createAttribute(id, body);
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Updated category attribute', type: CategoryAttribute })
  @Patch('attributes/:attributeId')
  updateAttribute(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
    @Body() body: UpdateAttributeDto,
  ) {
    return this.categoriesService.updateAttribute(attributeId, body);
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Category attribute deleted successfully' })
  @Delete('attributes/:attributeId')
  removeAttribute(@Param('attributeId', ParseUUIDPipe) attributeId: string) {
    return this.categoriesService.removeAttribute(attributeId);
  }
}
