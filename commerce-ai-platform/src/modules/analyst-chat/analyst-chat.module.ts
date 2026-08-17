import { Module } from '@nestjs/common';
import { AiLogsModule } from '../ai-logs/ai-logs.module';
import { SqlSafetyModule } from '../sql-safety/sql-safety.module';
import { AnalystChatController } from './analyst-chat.controller';
import { AnalystChatService } from './analyst-chat.service';

@Module({
  imports: [SqlSafetyModule, AiLogsModule],
  controllers: [AnalystChatController],
  providers: [AnalystChatService],
  exports: [AnalystChatService],
})
export class AnalystChatModule {}
