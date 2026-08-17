import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AiQueryLogRecord, CreateAiQueryLogInput } from './ai-logs.types';

@Injectable()
export class AiLogsService {
  constructor(private readonly dataSource: DataSource) {}

  async logQuery(input: CreateAiQueryLogInput): Promise<string> {
    const rows = await this.dataSource.query(
      `
        INSERT INTO ai.ai_query_logs (
          user_id, question, generated_sql, safety_status,
          execution_status, row_count, duration_ms, error_message
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `,
      [
        input.userId ?? null,
        input.question,
        input.generatedSql ?? null,
        input.safetyStatus,
        input.executionStatus,
        input.rowCount ?? 0,
        input.durationMs ?? 0,
        input.errorMessage ?? null,
      ],
    );
    return rows[0]?.id;
  }

  async listQueryLogs(): Promise<AiQueryLogRecord[]> {
    const rows = await this.dataSource.query(`
      SELECT
        id,
        user_id AS "userId",
        question,
        generated_sql AS "generatedSql",
        safety_status AS "safetyStatus",
        execution_status AS "executionStatus",
        row_count AS "rowCount",
        duration_ms AS "durationMs",
        error_message AS "errorMessage",
        created_at AS "createdAt"
      FROM ai.ai_query_logs
      ORDER BY created_at DESC
      LIMIT 100
    `);

    return rows;
  }
}
