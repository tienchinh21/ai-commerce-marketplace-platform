import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type { Review, ReviewListParams } from './review.types';

export async function fetchReviews(params: ReviewListParams = {}): Promise<PageResponse<Review>> {
  const response = await coreApi.get<PageResponse<Review>>(cmsPath('/reviews'), { params });
  return response.data;
}
