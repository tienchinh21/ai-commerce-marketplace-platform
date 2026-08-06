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
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import {
  CreatedResourceResponseDto,
  MutationSuccessResponseDto,
  createCreated,
  createSuccess,
} from '../../shared/api/mutation-response.dto';
import { toPaginatedResponseDto, toResponseDto } from '../../shared/api/response-serialization';
import { ReviewResponseDto } from './dto/review-response.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiBearerAuth()
@Controller('cms/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Permissions('review:read')
  @ApiOkResponse({ description: 'Paginated list of reviews', type: () => PaginatedResponseDto<ReviewResponseDto> })
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
  @ApiCreatedResponse({ description: 'Created review', type: CreatedResourceResponseDto })
  @Post()
  async create(@Body() body: CreateReviewDto): Promise<CreatedResourceResponseDto> {
    const review = await this.reviewsService.create(body);
    return createCreated(review.id, 'Review created successfully');
  }

  @Permissions('review:read')
  @ApiOkResponse({ description: 'Review details', type: ReviewResponseDto })
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ReviewResponseDto> {
    const review = await this.reviewsService.get(id);
    return toResponseDto(ReviewResponseDto, review);
  }

  @Permissions('review:moderate')
  @ApiOkResponse({ description: 'Review updated successfully', type: MutationSuccessResponseDto })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateReviewDto,
  ): Promise<MutationSuccessResponseDto> {
    await this.reviewsService.update(id, body);
    return createSuccess('Review updated successfully');
  }
}
