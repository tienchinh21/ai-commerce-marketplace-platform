import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';
import { HealthModule } from './modules/health/health.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { CoreDataModule } from './modules/core-data/core-data.module';
import { VectorStoreModule } from './modules/vector-store/vector-store.module';
import { IndexingModule } from './modules/indexing/indexing.module';
import { SemanticSearchModule } from './modules/semantic-search/semantic-search.module';
import { ReviewIntelligenceModule } from './modules/review-intelligence/review-intelligence.module';
import { SqlSafetyModule } from './modules/sql-safety/sql-safety.module';
import { AiLogsModule } from './modules/ai-logs/ai-logs.module';
import { AnalystChatModule } from './modules/analyst-chat/analyst-chat.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    ProvidersModule,
    CoreDataModule,
    VectorStoreModule,
    IndexingModule,
    SemanticSearchModule,
    ReviewIntelligenceModule,
    SqlSafetyModule,
    AiLogsModule,
    AnalystChatModule,
  ],
})
export class AppModule {}
