import { Module } from '@nestjs/common';
import { CoreDataModule } from '../core-data/core-data.module';
import { ProvidersModule } from '../providers/providers.module';
import { VectorStoreModule } from '../vector-store/vector-store.module';
import { ProductIndexingController } from './product-indexing.controller';
import { ProductIndexingService } from './product-indexing.service';

@Module({
  imports: [CoreDataModule, ProvidersModule, VectorStoreModule],
  controllers: [ProductIndexingController],
  providers: [ProductIndexingService],
  exports: [ProductIndexingService],
})
export class IndexingModule {}
