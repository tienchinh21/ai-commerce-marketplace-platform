import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { CmsReviewsController } from './cms-reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [CmsReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
