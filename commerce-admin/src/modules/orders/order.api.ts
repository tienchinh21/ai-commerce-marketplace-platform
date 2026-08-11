import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type { CreatedResourceResponse, Order, OrderDetail, OrderListParams, OrderPayload } from './order.types';

export async function fetchOrders(params: OrderListParams = {}): Promise<PageResponse<Order>> {
  const response = await coreApi.get<PageResponse<Order>>(cmsPath('/orders'), { params });
  return response.data;
}

export async function fetchOrderDetail(id: string): Promise<OrderDetail> {
  const response = await coreApi.get<OrderDetail>(cmsPath(`/orders/${id}`));
  return response.data;
}

export async function createOrder(payload: OrderPayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/orders'), payload);
  return response.data;
}
