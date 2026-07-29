export interface Category {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  path: string;
  level: number;
  status: string;
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
}
