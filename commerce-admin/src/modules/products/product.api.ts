import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type { Product, ProductDetail, ProductListParams, ProductVariant } from './product.types';

export async function fetchProducts(params: ProductListParams = {}): Promise<PageResponse<Product>> {
  const response = await coreApi.get<PageResponse<Product>>(cmsPath('/products'), { params });
  return response.data;
}

export async function fetchProductDetail(id: string): Promise<ProductDetail> {
  const response = await coreApi.get<ProductDetail>(cmsPath(`/products/${id}`));
  return response.data;
}

export async function fetchProductVariants(id: string): Promise<ProductVariant[]> {
  const response = await coreApi.get<ProductVariant[]>(cmsPath(`/products/${id}/variants`));
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await coreApi.delete(cmsPath(`/products/${id}`));
}
