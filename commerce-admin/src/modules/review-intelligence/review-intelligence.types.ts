export interface ReviewAnalysisRecord {
  reviewId: string;
  productId: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topics: string[];
  complaints: string[];
  praises: string[];
  model: string;
}

export interface ReviewAnalysisRunResponse {
  success: boolean;
  runId: string;
  totalReviews: number;
  analyzedCount: number;
  failedCount: number;
  message: string;
}

export interface ProductReviewSummaryResponse {
  productId: string;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topTopics: string[];
  commonComplaints: string[];
  commonPraises: string[];
  sourceReviewCount: number;
  confidence: number;
}
