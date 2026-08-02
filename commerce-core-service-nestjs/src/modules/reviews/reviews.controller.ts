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
import { ReviewsService } from './reviews.service';
import { Permissions } from '../auth/permissions.decorator';

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

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Permissions('review:read')
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
  @Post()
  create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }

  @Permissions('review:read')
  @Get(':id')
  get(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.get(id);
  }

  @Permissions('review:moderate')
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, body);
  }
}
