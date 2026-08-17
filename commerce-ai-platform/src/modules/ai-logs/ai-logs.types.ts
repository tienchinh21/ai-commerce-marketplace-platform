export interface CreateAiQueryLogInput {
  userId?: string | null;
  question: string;
  generatedSql?: string | null;
  safetyStatus: string;
  executionStatus: string;
  rowCount?: number;
  durationMs?: number;
  errorMessage?: string | null;
}

export interface AiQueryLogRecord {
  id: string;
  userId?: string | null;
  question: string;
  generatedSql?: string | null;
  safetyStatus: string;
  executionStatus: string;
  rowCount: number;
  durationMs: number;
  errorMessage?: string | null;
  createdAt: string;
}
