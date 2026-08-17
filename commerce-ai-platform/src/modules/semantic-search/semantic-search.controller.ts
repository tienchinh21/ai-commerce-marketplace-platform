import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SemanticSearchService } from './semantic-search.service';
import {
  SemanticProductSearchRequestDto,
  SemanticProductSearchResponseDto,
} from './semantic-search.dto';

@ApiTags('AI Search')
@Controller('ai/search')
export class SemanticSearchController {
  constructor(private readonly searchService: SemanticSearchService) {}

  @Post('products')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm bằng ngữ nghĩa (Semantic Product Search)' })
  @ApiResponse({ status: 200, type: SemanticProductSearchResponseDto })
  async searchProducts(
    @Body() request: SemanticProductSearchRequestDto,
  ): Promise<SemanticProductSearchResponseDto> {
    return this.searchService.searchProducts(request);
  }
}
