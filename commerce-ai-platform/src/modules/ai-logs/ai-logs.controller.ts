import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiLogsService } from './ai-logs.service';
import { AiQueryLogRecord } from './ai-logs.types';

@ApiTags('AI Query Logs')
@Controller('ai')
export class AiLogsController {
  constructor(private readonly logsService: AiLogsService) {}

  @Get('query-logs')
  @ApiOperation({ summary: 'Lấy danh sách nhật ký câu hỏi Text-to-SQL' })
  async listLogs(): Promise<AiQueryLogRecord[]> {
    return this.logsService.listQueryLogs();
  }
}
