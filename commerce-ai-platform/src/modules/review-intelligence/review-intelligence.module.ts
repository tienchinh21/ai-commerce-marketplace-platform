import { Module } from '@nestjs/common';
import { CoreDataModule } from '../core-data/core-data.module';
import { ProvidersModule } from '../providers/providers.module';
import { ReviewIntelligenceController } from './review-intelligence.controller';
import { ReviewIntelligenceService } from './review-intelligence.service';

@Module({
  imports: [CoreDataModule, ProvidersModule],
  controllers: [ReviewIntelligenceController],
  providers: [ReviewIntelligenceService],
  exports: [ReviewIntelligenceService],
})
export class ReviewIntelligenceModule {}
