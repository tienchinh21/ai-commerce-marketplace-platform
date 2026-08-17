import { AnalystChatService } from './analyst-chat.service';
import { SqlSafetyService } from '../sql-safety/sql-safety.service';
import { AiLogsService } from '../ai-logs/ai-logs.service';
import { DataSource } from 'typeorm';

describe('AnalystChatService', () => {
  let service: AnalystChatService;
  let dataSource: Partial<DataSource>;
  let safetyService: SqlSafetyService;
  let logsService: Partial<AiLogsService>;

  beforeEach(() => {
    dataSource = {
      query: jest.fn().mockResolvedValue([
        { product_id: 'p1', title: 'Áo thun', total_revenue: 1000000 },
      ]),
    };
    safetyService = new SqlSafetyService();
    logsService = {
      logQuery: jest.fn().mockResolvedValue('log-1'),
    };

    service = new AnalystChatService(
      dataSource as DataSource,
      safetyService,
      logsService as AiLogsService,
    );
  });

  it('generates safe SQL and executes whitelisted query', async () => {
    const result = await service.ask({ question: 'Top sản phẩm doanh thu cao' });

    expect(result.safetyStatus).toBe('ALLOWED');
    expect(result.executionStatus).toBe('SUCCESS');
    expect(result.rows).toHaveLength(1);
    expect(result.columns).toEqual(['product_id', 'title', 'total_revenue']);
  });

  it('handles unrecognized questions safely', async () => {
    const result = await service.ask({ question: 'thời tiết hôm nay' });

    expect(result.safetyStatus).toBe('NOT_GENERATED');
    expect(result.executionStatus).toBe('NOT_EXECUTED');
    expect(result.rows).toHaveLength(0);
  });
});
