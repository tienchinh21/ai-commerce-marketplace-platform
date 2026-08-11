import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type {
  CreatedResourceResponse,
  MutationSuccessResponse,
  Seller,
  SellerListParams,
  SellerPayload,
  UpdateSellerPayload,
} from './seller.types';

export async function fetchSellers(params: SellerListParams = {}): Promise<PageResponse<Seller>> {
  const response = await coreApi.get<PageResponse<Seller>>(cmsPath('/sellers'), { params });
  return response.data;
}

export async function fetchSellerDetail(id: string): Promise<Seller> {
  const response = await coreApi.get<Seller>(cmsPath(`/sellers/${id}`));
  return response.data;
}

export async function createSeller(payload: SellerPayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/sellers'), payload);
  return response.data;
}

export async function updateSeller(
  id: string,
  payload: UpdateSellerPayload,
): Promise<MutationSuccessResponse> {
  const response = await coreApi.patch<MutationSuccessResponse>(cmsPath(`/sellers/${id}`), payload);
  return response.data;
}
