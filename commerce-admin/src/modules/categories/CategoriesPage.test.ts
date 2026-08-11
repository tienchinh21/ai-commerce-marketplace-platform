import { describe, expect, it } from 'vitest';
import { getCategoryParentLabel } from './CategoriesPage';
import type { Category } from './category.types';

const categories: Category[] = [
  {
    id: 'parent-id',
    parentId: null,
    name: 'Electronics',
    slug: 'electronics',
    path: '',
    level: 0,
    status: 'ACTIVE',
  },
  {
    id: 'child-id',
    parentId: 'parent-id',
    name: 'Điện thoại',
    slug: 'dien-thoai',
    path: '/parent-id',
    level: 1,
    status: 'ACTIVE',
  },
];

describe('category display helpers', () => {
  it('returns parent category name instead of parent id', () => {
    expect(getCategoryParentLabel(categories[0], categories)).toBe('-');
    expect(getCategoryParentLabel(categories[1], categories)).toBe('Electronics');
  });
});
