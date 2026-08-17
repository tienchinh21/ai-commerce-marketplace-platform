export interface ProductCategory {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  itemCount?: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  nameEn: string;
  price: number;
  originalPrice?: number;
  stock: number;
  options: {
    color?: string;
    size?: string;
    capacity?: string;
    [key: string]: string | undefined;
  };
  imageUrl?: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  commentEn?: string;
  createdAt: string;
  verifiedPurchase: boolean;
  images?: string[];
  likesCount?: number;
}

export interface Product {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  shortDescription: string;
  shortDescriptionEn: string;
  description: string;
  descriptionEn: string;
  thumbnail: string;
  images: string[];
  specs: Record<string, string>;
  specsEn: Record<string, string>;
  variants: ProductVariant[];
  reviews: ProductReview[];
  tags: string[];
  stock: number;
}

export interface ProductFilterParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: "featured" | "newest" | "price-asc" | "price-desc" | "rating";
  tag?: string;
}
