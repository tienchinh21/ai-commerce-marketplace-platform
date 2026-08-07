import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type { Seller, SellerListParams } from './seller.types';

export async function fetchSellers(params: SellerListParams = {}): Promise<PageResponse<Seller>> {
  const response = await coreApi.get<PageResponse<Seller>>(cmsPath('/sellers'), { params });
  return response.data;
}
