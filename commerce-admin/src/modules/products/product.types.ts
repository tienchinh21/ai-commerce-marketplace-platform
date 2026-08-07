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
