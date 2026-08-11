export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  title: string;
  slug: string;
  brand: string | null;
  status: string;
  priceMin: string;
  priceMax: string;
  ratingAvg: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRelationSummary {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string | null;
  price: string;
  stockQuantity: number;
  status: string;
  specsJson: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface ProductDetail extends Product {
  seller: ProductRelationSummary | null;
  category: ProductRelationSummary | null;
  description: string | null;
  specsJson: Record<string, unknown>;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface ProductListParams {
  search?: string;
  categoryId?: string;
  sellerId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductPayload {
  sellerId: string;
  categoryId: string;
  title: string;
  slug?: string;
  brand?: string | null;
  description?: string | null;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  specsJson?: Record<string, unknown>;
}

export type UpdateProductPayload = Partial<ProductPayload>;

export interface ProductVariantPayload {
  sku: string;
  title?: string | null;
  price: number;
  stockQuantity?: number;
  status?: string;
  specsJson?: Record<string, unknown>;
}

export interface AddProductImagesPayload {
  images: Array<{
    url: string;
    sortOrder?: number;
    altText?: string | null;
  }>;
}

export interface CreatedResourceResponse {
  success: true;
  id: string;
  message: string;
}

export interface MutationSuccessResponse {
  success: true;
  message: string;
}

export interface BulkCreatedResourceResponse {
  success: true;
  ids: string[];
  count: number;
  message: string;
}
