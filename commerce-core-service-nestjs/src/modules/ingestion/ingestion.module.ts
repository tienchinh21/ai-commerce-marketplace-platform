import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceEntity } from './data-source.entity';
import { SyncRun } from './sync-run.entity';
import { RawSnapshot } from './raw-snapshot.entity';
import { SourceProduct } from './source-product.entity';
import { SourceReview } from './source-review.entity';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { ProductsModule } from '../products/products.module';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataSourceEntity,
      SyncRun,
      RawSnapshot,
      SourceProduct,
      SourceReview,
    ]),
    ProductsModule,
    ReviewsModule,
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
