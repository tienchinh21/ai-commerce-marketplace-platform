import { aiApi, aiPath } from '@/shared/api/http-client';
import type {
  ProductReviewSummaryResponse,
  ReviewAnalysisRecord,
  ReviewAnalysisRunResponse,
} from './review-intelligence.types';

export async function runReviewAnalysis(): Promise<ReviewAnalysisRunResponse> {
  const response = await aiApi.post<ReviewAnalysisRunResponse>(
    aiPath('/reviews/analyze/run'),
  );
  return response.data;
}

export async function fetchProductReviewSummary(
  productId: string,
): Promise<ProductReviewSummaryResponse> {
  const response = await aiApi.get<ProductReviewSummaryResponse>(
    aiPath(`/products/${productId}/review-summary`),
  );
  return response.data;
}

export async function fetchReviewAnalysisList(): Promise<ReviewAnalysisRecord[]> {
  const response = await aiApi.get<ReviewAnalysisRecord[]>(
    aiPath('/reviews/analysis'),
  );
  return response.data;
}
