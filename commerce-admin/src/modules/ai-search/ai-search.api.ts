import { aiApi, aiPath } from '@/shared/api/http-client';
import type {
  SemanticProductSearchRequest,
  SemanticProductSearchResponse,
} from './ai-search.types';

export async function searchAiProducts(
  payload: SemanticProductSearchRequest,
): Promise<SemanticProductSearchResponse> {
  const response = await aiApi.post<SemanticProductSearchResponse>(
    aiPath('/search/products'),
    payload,
  );
  return response.data;
}
