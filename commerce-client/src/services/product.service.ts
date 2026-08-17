import { Product, ProductCategory, ProductFilterParams } from "@/types/product";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mock-data";

export const productService = {
  async getCategories(): Promise<ProductCategory[]> {
    // In real mode, would call: (await apiClient.get('/categories')).data
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CATEGORIES), 100);
    });
  },

  async getProducts(params?: ProductFilterParams): Promise<{ products: Product[]; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...MOCK_PRODUCTS];

        if (params?.category) {
          results = results.filter((p) => p.category.slug === params.category);
        }

        if (params?.search) {
          const q = params.search.toLowerCase();
          results = results.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.titleEn.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        if (params?.minPrice !== undefined) {
          results = results.filter((p) => p.price >= (params.minPrice || 0));
        }

        if (params?.maxPrice !== undefined) {
          results = results.filter((p) => p.price <= (params.maxPrice || Infinity));
        }

        if (params?.rating) {
          results = results.filter((p) => p.rating >= (params.rating || 0));
        }

        if (params?.sortBy) {
          switch (params.sortBy) {
            case "newest":
              results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
              break;
            case "price-asc":
              results.sort((a, b) => a.price - b.price);
              break;
            case "price-desc":
              results.sort((a, b) => b.price - a.price);
              break;
            case "rating":
              results.sort((a, b) => b.rating - a.rating);
              break;
            case "featured":
            default:
              results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
              break;
          }
        }

        resolve({ products: results, total: results.length });
      }, 150);
    });
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
        resolve(found || null);
      }, 100);
    });
  },

  async getFeaturedProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PRODUCTS.filter((p) => p.isFeatured));
      }, 100);
    });
  },

  async getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const related = MOCK_PRODUCTS.filter(
          (p) => p.id !== currentProductId
        ).slice(0, 4);
        resolve(related);
      }, 100);
    });
  },
};
