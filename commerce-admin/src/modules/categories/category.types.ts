export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  path: string;
  level: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  code: string;
  label: string;
  dataType: 'text' | 'number' | 'boolean' | 'select' | 'multi_select';
  isFilterable: boolean;
  isSearchable: boolean;
  isRequired: boolean;
  unit?: string | null;
  optionsJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  parentId?: string | null;
  name: string;
  slug?: string;
  status?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  status?: string;
}

export interface CategoryAttributePayload {
  code: string;
  label: string;
  dataType: string;
  isFilterable?: boolean;
  isSearchable?: boolean;
  isRequired?: boolean;
  unit?: string | null;
  optionsJson?: Record<string, unknown>;
}

export type UpdateCategoryAttributePayload = Partial<
  Omit<CategoryAttributePayload, 'code'>
>;

export interface CreatedResourceResponse {
  success: true;
  id: string;
  message: string;
}

export interface MutationSuccessResponse {
  success: true;
  message: string;
}
