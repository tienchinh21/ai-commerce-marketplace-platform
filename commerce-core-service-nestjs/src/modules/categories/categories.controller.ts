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
import { VI_API_MESSAGES } from '../../shared/api/api-messages.vi';
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
  @ApiOkResponse({ description: 'Danh sách danh mục', type: [CategoryResponseDto] })
  @Get()
  async list(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.list();
    return toResponseDtoList(CategoryResponseDto, categories);
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ description: 'Tạo danh mục thành công', type: CreatedResourceResponseDto })
  @Post()
  async create(@Body() body: CreateCategoryDto): Promise<CreatedResourceResponseDto> {
    const category = await this.categoriesService.create(body);
    return createCreated(category.id, VI_API_MESSAGES.success.CATEGORY_CREATED);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Chi tiết danh mục', type: CategoryResponseDto })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.get(id);
    return toResponseDto(CategoryResponseDto, category);
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Cập nhật danh mục thành công', type: MutationSuccessResponseDto })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.categoriesService.update(id, body);
    return createSuccess(VI_API_MESSAGES.success.CATEGORY_UPDATED);
  }

  @Permissions('category:write')
  @ApiNoContentResponse({ description: 'Xóa danh mục thành công' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }

  @Permissions('category:read')
  @ApiOkResponse({ description: 'Danh sách thuộc tính danh mục', type: [CategoryAttributeResponseDto] })
  @Get(':id/attributes')
  async listAttributes(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryAttributeResponseDto[]> {
    const attributes = await this.categoriesService.listAttributes(id);
    return toResponseDtoList(CategoryAttributeResponseDto, attributes);
  }

  @Permissions('category:write')
  @ApiCreatedResponse({ description: 'Tạo thuộc tính danh mục thành công', type: CreatedResourceResponseDto })
  @Post(':id/attributes')
  async createAttribute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAttributeDto,
  ): Promise<CreatedResourceResponseDto> {
    const attribute = await this.categoriesService.createAttribute(id, body);
    return createCreated(attribute.id, VI_API_MESSAGES.success.CATEGORY_ATTRIBUTE_CREATED);
  }

  @Permissions('category:write')
  @ApiOkResponse({ description: 'Cập nhật thuộc tính danh mục thành công', type: MutationSuccessResponseDto })
  @Patch('attributes/:attributeId')
  async updateAttribute(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
    @Body() body: UpdateAttributeDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.categoriesService.updateAttribute(attributeId, body);
    return createSuccess(VI_API_MESSAGES.success.CATEGORY_ATTRIBUTE_UPDATED);
  }

  @Permissions('category:write')
  @ApiNoContentResponse({ description: 'Xóa thuộc tính danh mục thành công' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('attributes/:attributeId')
  async removeAttribute(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
  ): Promise<void> {
    await this.categoriesService.removeAttribute(attributeId);
  }
}
