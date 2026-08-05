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
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Permissions } from '../auth/permissions.decorator';
import { PaginatedResponseDto } from '../../shared/api/paginated-response.dto';
import { Review } from './review.entity';

class CreateReviewDto {
  @IsString() productId: string;
  @IsOptional() @IsString() buyerId?: string;
  @IsOptional() @IsString() sellerId?: string;
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() sourceType?: string;
}

class UpdateReviewDto {
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() status?: string;
}

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
