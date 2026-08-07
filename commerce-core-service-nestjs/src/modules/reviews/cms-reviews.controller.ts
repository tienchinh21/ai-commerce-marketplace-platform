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
import { ReviewsService } from './reviews.service';
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
import { ReviewResponseDto } from './dto/cms/review-response.dto';
import { CreateReviewDto } from './dto/cms/create-review.dto';
import { UpdateReviewDto } from './dto/cms/update-review.dto';

@ApiBearerAuth()
@Controller('cms/reviews')
export class CmsReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Permissions('review:read')
  @ApiOkResponse({
    description: 'Danh sách đánh giá có phân trang',
    type: () => PaginatedResponseDto<ReviewResponseDto>,
  })
  @Get()
  async list(
    @Query('productId') productId?: string,
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string,
    @Query('minRating') minRating?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResponseDto<ReviewResponseDto>> {
    const result = await this.reviewsService.list({
      productId,
      buyerId,
      sellerId,
      status,
      minRating: minRating ? Number(minRating) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return toPaginatedResponseDto(ReviewResponseDto, result);
  }

  @Permissions('review:moderate')
  @ApiCreatedResponse({
    description: 'Tạo đánh giá thành công',
    type: CreatedResourceResponseDto,
  })
  @Post()
  async create(
    @Body() body: CreateReviewDto,
  ): Promise<CreatedResourceResponseDto> {
    const review = await this.reviewsService.create(body);
    return createCreated(review.id, VI_API_MESSAGES.success.REVIEW_CREATED);
  }

  @Permissions('review:read')
  @ApiOkResponse({ description: 'Chi tiết đánh giá', type: ReviewResponseDto })
  @Get(':id')
  async get(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReviewResponseDto> {
    const review = await this.reviewsService.get(id);
    return toResponseDto(ReviewResponseDto, review);
  }

  @Permissions('review:moderate')
  @ApiOkResponse({
    description: 'Cập nhật đánh giá thành công',
    type: MutationSuccessResponseDto,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateReviewDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.reviewsService.update(id, body);
    return createSuccess(VI_API_MESSAGES.success.REVIEW_UPDATED);
  }
}
