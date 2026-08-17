import { Module } from '@nestjs/common';
import { ProvidersModule } from '../providers/providers.module';
import { VectorStoreModule } from '../vector-store/vector-store.module';
import { SemanticSearchController } from './semantic-search.controller';
import { SemanticSearchService } from './semantic-search.service';

@Module({
  imports: [ProvidersModule, VectorStoreModule],
  controllers: [SemanticSearchController],
  providers: [SemanticSearchService],
  exports: [SemanticSearchService],
})
export class SemanticSearchModule {}
