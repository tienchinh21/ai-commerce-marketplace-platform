import { describe, expect, it, vi } from 'vitest';
import { coreApi } from '@/shared/api/http-client';
import {
  createCategory,
  createCategoryAttribute,
  deleteCategory,
  deleteCategoryAttribute,
  fetchCategories,
  fetchCategoryAttributes,
  updateCategory,
  updateCategoryAttribute,
} from './category.api';

vi.mock('@/shared/api/http-client', () => ({
  coreApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  cmsPath: (path: string) => (path.startsWith('/') ? `/cms${path}` : `/cms/${path}`),
}));

describe('category API', () => {
  it('fetches categories from the CMS categories endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });

    await expect(fetchCategories()).resolves.toEqual([]);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/categories');
  });

  it('creates category through the CMS categories endpoint', async () => {
    const payload = { name: 'Tai nghe', slug: 'tai-nghe', status: 'ACTIVE' };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'category-id', message: 'Tạo danh mục thành công.' },
    });

    await expect(createCategory(payload)).resolves.toEqual({
      success: true,
      id: 'category-id',
      message: 'Tạo danh mục thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/categories', payload);
  });

  it('updates category through the CMS category endpoint', async () => {
    vi.mocked(coreApi.patch).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật danh mục thành công.' },
    });

    await expect(updateCategory('category-id', { status: 'INACTIVE' })).resolves.toEqual({
      success: true,
      message: 'Cập nhật danh mục thành công.',
    });
    expect(coreApi.patch).toHaveBeenCalledWith('/cms/categories/category-id', { status: 'INACTIVE' });
  });

  it('deletes category through the CMS category endpoint', async () => {
    vi.mocked(coreApi.delete).mockResolvedValueOnce({ data: undefined });

    await expect(deleteCategory('category-id')).resolves.toBeUndefined();
    expect(coreApi.delete).toHaveBeenCalledWith('/cms/categories/category-id');
  });

  it('fetches category attributes from the CMS attributes endpoint', async () => {
    vi.mocked(coreApi.get).mockResolvedValueOnce({ data: [] });

    await expect(fetchCategoryAttributes('category-id')).resolves.toEqual([]);
    expect(coreApi.get).toHaveBeenCalledWith('/cms/categories/category-id/attributes');
  });

  it('creates category attribute through the CMS attributes endpoint', async () => {
    const payload = {
      code: 'color',
      label: 'Màu sắc',
      dataType: 'select',
      isFilterable: true,
      isSearchable: true,
      isRequired: false,
      optionsJson: { values: ['Đen', 'Trắng'] },
    };
    vi.mocked(coreApi.post).mockResolvedValueOnce({
      data: { success: true, id: 'attribute-id', message: 'Tạo thuộc tính danh mục thành công.' },
    });

    await expect(createCategoryAttribute('category-id', payload)).resolves.toEqual({
      success: true,
      id: 'attribute-id',
      message: 'Tạo thuộc tính danh mục thành công.',
    });
    expect(coreApi.post).toHaveBeenCalledWith('/cms/categories/category-id/attributes', payload);
  });

  it('updates category attribute through the CMS attribute endpoint', async () => {
    vi.mocked(coreApi.patch).mockResolvedValueOnce({
      data: { success: true, message: 'Cập nhật thuộc tính danh mục thành công.' },
    });

    await expect(updateCategoryAttribute('attribute-id', { label: 'Màu sản phẩm' })).resolves.toEqual({
      success: true,
      message: 'Cập nhật thuộc tính danh mục thành công.',
    });
    expect(coreApi.patch).toHaveBeenCalledWith('/cms/categories/attributes/attribute-id', {
      label: 'Màu sản phẩm',
    });
  });

  it('deletes category attribute through the CMS attribute endpoint', async () => {
    vi.mocked(coreApi.delete).mockResolvedValueOnce({ data: undefined });

    await expect(deleteCategoryAttribute('attribute-id')).resolves.toBeUndefined();
    expect(coreApi.delete).toHaveBeenCalledWith('/cms/categories/attributes/attribute-id');
  });
});
