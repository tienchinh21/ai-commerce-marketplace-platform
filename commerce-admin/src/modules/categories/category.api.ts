import { cmsPath, coreApi } from '@/shared/api/http-client';
import type {
  Category,
  CategoryAttribute,
  CategoryAttributePayload,
  CategoryPayload,
  CreatedResourceResponse,
  MutationSuccessResponse,
  UpdateCategoryAttributePayload,
  UpdateCategoryPayload,
} from './category.types';

export async function fetchCategories(): Promise<Category[]> {
  const response = await coreApi.get<Category[]>(cmsPath('/categories'));
  return response.data;
}

export async function fetchCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
  const response = await coreApi.get<CategoryAttribute[]>(cmsPath(`/categories/${categoryId}/attributes`));
  return response.data;
}

export async function createCategory(payload: CategoryPayload): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(cmsPath('/categories'), payload);
  return response.data;
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<MutationSuccessResponse> {
  const response = await coreApi.patch<MutationSuccessResponse>(cmsPath(`/categories/${id}`), payload);
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await coreApi.delete(cmsPath(`/categories/${id}`));
}

export async function createCategoryAttribute(
  categoryId: string,
  payload: CategoryAttributePayload,
): Promise<CreatedResourceResponse> {
  const response = await coreApi.post<CreatedResourceResponse>(
    cmsPath(`/categories/${categoryId}/attributes`),
    payload,
  );
  return response.data;
}

export async function updateCategoryAttribute(
  attributeId: string,
  payload: UpdateCategoryAttributePayload,
): Promise<MutationSuccessResponse> {
  const response = await coreApi.patch<MutationSuccessResponse>(
    cmsPath(`/categories/attributes/${attributeId}`),
    payload,
  );
  return response.data;
}

export async function deleteCategoryAttribute(attributeId: string): Promise<void> {
  await coreApi.delete(cmsPath(`/categories/attributes/${attributeId}`));
}
