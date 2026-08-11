import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type {
  CreatedResourceResponse,
  MutationSuccessResponse,
  Review,
  ReviewListParams,
  ReviewPayload,
  UpdateReviewPayload,
} from './review.types';

export async function fetchReviews(params: ReviewListParams = {}): Promise<PageResponse<Review>> {
  const response = await coreApi.get<PageResponse<Review>>(cmsPath('/reviews'), { params });
  return response.data;
}

export async function fetchReviewDetail(id: string): Promise<Review> {
  const response = await coreApi.get<Review>(cmsPath(`/reviews/${id}`));
  return response.data;
}

export async function createReview(payload: ReviewPayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/reviews'), payload);
  return response.data;
}

export async function updateReview(
  id: string,
  payload: UpdateReviewPayload,
): Promise<MutationSuccessResponse> {
  const response = await coreApi.patch<MutationSuccessResponse>(cmsPath(`/reviews/${id}`), payload);
  return response.data;
}
