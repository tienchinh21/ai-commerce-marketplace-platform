export type AnalyticsRecord = Record<string, unknown>;

export interface AnalyticsParams {
  limit?: number;
  from?: string;
  to?: string;
}

export interface ReviewSentimentParams {
  categoryId?: string;
  from?: string;
  to?: string;
}
