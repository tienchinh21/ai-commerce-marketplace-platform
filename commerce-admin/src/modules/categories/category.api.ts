import { coreApi } from '../../shared/api/http-client';
import type { Category, CategoryAttribute } from './category.types';

export async function fetchCategories(): Promise<Category[]> {
  const response = await coreApi.get<Category[]>('/categories');
  return response.data;
}

export async function fetchCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
  const response = await coreApi.get<CategoryAttribute[]>(`/categories/${categoryId}/attributes`);
  return response.data;
}
