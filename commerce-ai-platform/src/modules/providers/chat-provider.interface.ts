export const CHAT_PROVIDER = Symbol('CHAT_PROVIDER');

export interface ProductMatchExplanationInput {
  query: string;
  productTitle: string;
  matchedFields: string[];
  score: number;
}

export interface ReviewAnalysisInput {
  title?: string | null;
  content: string;
  rating: number;
}

export interface ReviewAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topics: string[];
  complaints: string[];
  praises: string[];
}

export interface ChatProvider {
  explainProductMatch(input: ProductMatchExplanationInput): Promise<string>;
  analyzeReview(input: ReviewAnalysisInput): Promise<ReviewAnalysisResult>;
}
