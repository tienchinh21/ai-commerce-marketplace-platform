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
import { Review } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiBearerAuth()
@Controller('cms/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Permissions('review:read')
  @ApiOkResponse({ type: () => PaginatedResponseDto<Review> })
  @Get()
  list(
    @Query('productId') productId?: string,
    @Query('buyerId') buyerId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('status') status?: string,
    @Query('minRating') minRating?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.reviewsService.list({
      productId,
      buyerId,
      sellerId,
      status,
      minRating: minRating ? Number(minRating) : undefined,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Permissions('review:moderate')
  @ApiCreatedResponse({ type: Review })
  @Post()
  create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }

  @Permissions('review:read')
  @ApiOkResponse({ type: Review })
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.get(id);
  }

  @Permissions('review:moderate')
  @ApiOkResponse({ type: Review })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, body);
  }
}
