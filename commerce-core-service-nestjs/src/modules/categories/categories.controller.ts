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
import { CategoriesService } from './categories.service';
import { Permissions } from '../auth/permissions.decorator';

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

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Permissions('category:read')
  @Get()
  list() {
    return this.categoriesService.list();
  }

  @Permissions('category:write')
  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @Permissions('category:read')
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.get(id);
  }

  @Permissions('category:write')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, body);
  }

  @Permissions('category:write')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @Permissions('category:read')
  @Get(':id/attributes')
  listAttributes(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.listAttributes(id);
  }

  @Permissions('category:write')
  @Post(':id/attributes')
  createAttribute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateAttributeDto,
  ) {
    return this.categoriesService.createAttribute(id, body);
  }

  @Permissions('category:write')
  @Patch('attributes/:attributeId')
  updateAttribute(
    @Param('attributeId', ParseUUIDPipe) attributeId: string,
    @Body() body: UpdateAttributeDto,
  ) {
    return this.categoriesService.updateAttribute(attributeId, body);
  }

  @Permissions('category:write')
  @Delete('attributes/:attributeId')
  removeAttribute(@Param('attributeId', ParseUUIDPipe) attributeId: string) {
    return this.categoriesService.removeAttribute(attributeId);
  }
}
