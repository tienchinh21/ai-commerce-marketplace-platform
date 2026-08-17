import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AiLogsService } from '../ai-logs/ai-logs.service';
import { SqlSafetyService } from '../sql-safety/sql-safety.service';
import { AnalystChatRequestDto, AnalystChatResponseDto } from './analyst-chat.dto';

function generateSql(question: string): string | null {
  const text = question.toLowerCase();

  if (text.includes('sản phẩm') && (text.includes('top') || text.includes('doanh thu') || text.includes('bán chạy'))) {
    return 'SELECT product_id, title, total_revenue, units_sold FROM analytics.product_performance ORDER BY total_revenue DESC LIMIT 10';
  }

  if (text.includes('sentiment') || text.includes('đánh giá') || text.includes('review')) {
    return 'SELECT product_id, positive_count, neutral_count, negative_count, avg_rating FROM analytics.review_sentiment ORDER BY avg_rating DESC LIMIT 10';
  }

  if (text.includes('người bán') || text.includes('seller') || text.includes('gian hàng')) {
    return 'SELECT seller_id, seller_name, total_revenue, total_orders FROM analytics.seller_performance ORDER BY total_revenue DESC LIMIT 10';
  }

  if (text.includes('danh mục') || text.includes('category')) {
    return 'SELECT category_id, category_name, total_products, total_revenue FROM analytics.category_summary ORDER BY total_revenue DESC LIMIT 10';
  }

  if (text.includes('doanh thu') || text.includes('báo cáo') || text.includes('hiệu suất')) {
    return 'SELECT product_id, title, total_revenue, units_sold FROM analytics.product_performance LIMIT 10';
  }

  return null;
}

@Injectable()
export class AnalystChatService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly safetyService: SqlSafetyService,
    private readonly logsService: AiLogsService,
  ) {}

  async ask(request: AnalystChatRequestDto): Promise<AnalystChatResponseDto> {
    const startTime = Date.now();
    const sql = generateSql(request.question);

    if (!sql) {
      const logId = await this.logsService.logQuery({
        userId: request.userId,
        question: request.question,
        generatedSql: null,
        safetyStatus: 'NOT_GENERATED',
        executionStatus: 'NOT_EXECUTED',
        rowCount: 0,
        durationMs: Date.now() - startTime,
        errorMessage: 'Chưa có rule phù hợp cho câu hỏi.',
      });

      return {
        answer: 'AI Analyst hiện tại hỗ trợ các câu hỏi mẫu như: "Top 10 sản phẩm doanh thu cao nhất", "Thống kê review & sentiment", "Hiệu suất người bán", "Tổng hợp theo danh mục". Vui lòng thử lại với các chủ đề này.',
        generatedSql: undefined,
        safetyStatus: 'NOT_GENERATED',
        executionStatus: 'NOT_EXECUTED',
        columns: [],
        rows: [],
        queryLogId: logId,
      };
    }

    const safety = this.safetyService.validate(sql);
    if (!safety.allowed) {
      const logId = await this.logsService.logQuery({
        userId: request.userId,
        question: request.question,
        generatedSql: sql,
        safetyStatus: safety.status,
        executionStatus: 'NOT_EXECUTED',
        rowCount: 0,
        durationMs: Date.now() - startTime,
        errorMessage: safety.reasons.join('; '),
      });

      return {
        answer: `Câu lệnh truy vấn được tạo không vượt qua SQL Safety Guardrail (${safety.reasons.join(', ')}).`,
        generatedSql: sql,
        safetyStatus: safety.status,
        executionStatus: 'NOT_EXECUTED',
        columns: [],
        rows: [],
        queryLogId: logId,
      };
    }

    let rows: Record<string, unknown>[] = [];
    let executionStatus: 'SUCCESS' | 'FAILED' = 'SUCCESS';
    let errorMessage: string | null = null;

    try {
      rows = await this.dataSource.query(sql);
    } catch (err: unknown) {
      executionStatus = 'FAILED';
      errorMessage = err instanceof Error ? err.message : 'Database query failed';
    }

    const durationMs = Date.now() - startTime;
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    const logId = await this.logsService.logQuery({
      userId: request.userId,
      question: request.question,
      generatedSql: sql,
      safetyStatus: safety.status,
      executionStatus,
      rowCount: rows.length,
      durationMs,
      errorMessage,
    });

    const answer =
      executionStatus === 'SUCCESS'
        ? `Đã truy vấn thành công ${rows.length} dòng dữ liệu an toàn từ views analytics.`
        : `Lỗi thực thi truy vấn: ${errorMessage}`;

    return {
      answer,
      generatedSql: sql,
      safetyStatus: safety.status,
      executionStatus,
      columns,
      rows,
      queryLogId: logId,
    };
  }
}
