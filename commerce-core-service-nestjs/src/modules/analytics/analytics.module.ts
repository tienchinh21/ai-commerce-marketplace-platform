import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CmsAnalyticsController } from './cms-analytics.controller';

@Module({
  controllers: [CmsAnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
