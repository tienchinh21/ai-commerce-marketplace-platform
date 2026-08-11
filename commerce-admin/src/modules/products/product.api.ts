import { cmsPath, coreApi } from '@/shared/api/http-client';
import type { PageResponse } from '@/shared/types/pagination';
import type {
  AddProductImagesPayload,
  BulkCreatedResourceResponse,
  CreatedResourceResponse,
  MutationSuccessResponse,
  Product,
  ProductDetail,
  ProductListParams,
  ProductPayload,
  ProductVariant,
  ProductVariantPayload,
  UpdateProductPayload,
} from './product.types';

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

export async function createProduct(payload: ProductPayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/products'), payload);
  return response.data;
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<MutationSuccessResponse> {
  const response = await coreApi.patch<MutationSuccessResponse>(cmsPath(`/products/${id}`), payload);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await coreApi.delete(cmsPath(`/products/${id}`));
}

export async function createProductVariant(
  id: string,
  payload: ProductVariantPayload,
): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath(`/products/${id}/variants`), payload);
  return response.data;
}

export async function addProductImages(
  id: string,
  payload: AddProductImagesPayload,
): Promise<BulkCreatedResourceResponse> {
  const response = await coreApi.post<BulkCreatedResourceResponse>(cmsPath(`/products/${id}/images`), payload);
  return response.data;
}
