import { Suspense } from "react";
import { productService } from "@/services/product.service";
import { ProductsCatalogClient } from "@/components/product/ProductsCatalogClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curated Products Collection",
  description: "Discover luxury audio, horology, fashion and living accessories at OKZ Commerce.",
};

export default async function ProductsEnPage() {
  const [categories, productsRes] = await Promise.all([
    productService.getCategories(),
    productService.getProducts(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center text-xs text-shade-50">
          Loading curated collection...
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
