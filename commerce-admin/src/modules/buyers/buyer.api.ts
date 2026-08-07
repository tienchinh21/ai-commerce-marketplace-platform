import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type { Buyer, BuyerListParams } from './buyer.types';

export async function fetchBuyers(params: BuyerListParams = {}): Promise<PageResponse<Buyer>> {
  const response = await coreApi.get<PageResponse<Buyer>>(cmsPath('/buyers'), { params });
  return response.data;
}
