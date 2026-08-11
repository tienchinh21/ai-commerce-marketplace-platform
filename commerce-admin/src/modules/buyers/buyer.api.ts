import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type {
  Buyer,
  BuyerListParams,
  BuyerPayload,
  CreatedResourceResponse,
  MutationSuccessResponse,
  UpdateBuyerPayload,
} from './buyer.types';

export async function fetchBuyers(params: BuyerListParams = {}): Promise<PageResponse<Buyer>> {
  const response = await coreApi.get<PageResponse<Buyer>>(cmsPath('/buyers'), { params });
  return response.data;
}

export async function fetchBuyerDetail(id: string): Promise<Buyer> {
  const response = await coreApi.get<Buyer>(cmsPath(`/buyers/${id}`));
  return response.data;
}

export async function createBuyer(payload: BuyerPayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/buyers'), payload);
  return response.data;
}

export async function updateBuyer(
  id: string,
  payload: UpdateBuyerPayload,
): Promise<MutationSuccessResponse> {
  const response = await coreApi.patch<MutationSuccessResponse>(cmsPath(`/buyers/${id}`), payload);
  return response.data;
}
