export interface AnalystChatRequest {
  question: string;
  userId?: string;
}

export interface AnalystChatResponse {
  answer: string;
  generatedSql?: string;
  safetyStatus: string;
  executionStatus: 'NOT_EXECUTED' | 'SUCCESS' | 'FAILED';
  columns: string[];
  rows: Record<string, unknown>[];
  queryLogId?: string;
}
