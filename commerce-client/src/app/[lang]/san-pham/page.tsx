import { Suspense } from "react";
import { productService } from "@/services/product.service";
import { ProductsCatalogClient } from "@/components/product/ProductsCatalogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh Sách Sản Phẩm Tuyển Chọn",
  description: "Khám phá các sản phẩm công nghệ, thời trang và không gian sống cao cấp tại OKZ Commerce.",
};

export default async function ProductsPage() {
  const [categories, productsRes] = await Promise.all([
    productService.getCategories(),
    productService.getProducts(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center text-xs text-shade-50">
          Đang tải danh sách sản phẩm...
        </div>
      }
    >
      <ProductsCatalogClient
        initialProducts={productsRes.products}
        categories={categories}
      />
    </Suspense>
  );
}
