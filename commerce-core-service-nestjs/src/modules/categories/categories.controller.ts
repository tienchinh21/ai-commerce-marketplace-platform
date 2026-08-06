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
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  CreatedResourceResponseDto,
  MutationSuccessResponseDto,
  createCreated,
  createSuccess,
} from '../../shared/api/mutation-response.dto';
import { toResponseDto, toResponseDtoList } from '../../shared/api/response-serialization';
import { CategoriesService } from './categories.service';
import { Permissions } from '../auth/permissions.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryAttributeResponseDto } from './dto/category-attribute-response.dto';

@ApiBearerAuth()
@Controller('cms/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Permissions('category:read')
  @ApiOkResponse({ description: 'List of categories', type: [CategoryResponseDto] })
  @Get()
  async list(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.list();
    return toResponseDtoList(CategoryResponseDto, categories);
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ description: 'Created category', type: CreatedResourceResponseDto })
  @Post()
  async create(@Body() body: CreateCategoryDto): Promise<CreatedResourceResponseDto> {
    const category = await this.categoriesService.create(body);
    return createCreated(category.id, 'Category created successfully');
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Category details', type: CategoryResponseDto })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.get(id);
    return toResponseDto(CategoryResponseDto, category);
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Category updated successfully', type: MutationSuccessResponseDto })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.categoriesService.update(id, body);
    return createSuccess('Category updated successfully');
  }

  @Permissions('category:write')
  @ApiNoContentResponse({ description: 'Category deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'List of category attributes', type: [CategoryAttributeResponseDto] })
  @Get(':id/attributes')
  async listAttributes(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryAttributeResponseDto[]> {
    const attributes = await this.categoriesService.listAttributes(id);
    return toResponseDtoList(CategoryAttributeResponseDto, attributes);
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ description: 'Created category attribute', type: CreatedResourceResponseDto })
  @Post(':id/attributes')
  async createAttribute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAttributeDto,
  ): Promise<CreatedResourceResponseDto> {
    const attribute = await this.categoriesService.createAttribute(id, body);
    return createCreated(attribute.id, 'Category attribute created successfully');
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Category attribute updated successfully', type: MutationSuccessResponseDto })
  @Patch('attributes/:attributeId')
  async updateAttribute(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
    @Body() body: UpdateAttributeDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.categoriesService.updateAttribute(attributeId, body);
    return createSuccess('Category attribute updated successfully');
  }

  @Permissions('category:write')
  @ApiNoContentResponse({ description: 'Category attribute deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('attributes/:attributeId')
  async removeAttribute(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
  ): Promise<void> {
    await this.categoriesService.removeAttribute(attributeId);
  }
}
