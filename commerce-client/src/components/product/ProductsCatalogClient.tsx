"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Product, ProductCategory, ProductFilterParams } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { useTranslation } from "@/i18n/useTranslation";
import { productService } from "@/services/product.service";
import { SlidersHorizontal, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductsCatalogClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: ProductCategory[];
}) {
  const { t, isVi } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlCategory = searchParams.get("category") || undefined;
  const urlSearch = searchParams.get("search") || undefined;

  const [filters, setFilters] = React.useState<ProductFilterParams>({
    category: urlCategory,
    search: urlSearch,
    sortBy: "featured",
  });

  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [loading, setLoading] = React.useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  // Sync with URL params
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
    }));
  }, [searchParams]);

  // Fetch / filter products
  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    productService.getProducts(filters).then((res) => {
      if (isMounted) {
        setProducts(res.products);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<ProductFilterParams>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      // Update URL query
      const params = new URLSearchParams();
      if (updated.category) params.set("category", updated.category);
      if (updated.search) params.set("search", updated.search);
      router.replace(`${pathname}?${params.toString()}`);
      return updated;
    });
  };

  const handleReset = () => {
    setFilters({ sortBy: "featured" });
    router.replace(pathname);
  };

  const activeCategoryObj = categories.find((c) => c.slug === filters.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Clean Editorial Page Header */}
      <div className="mb-8 border-b border-hairline-light pb-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-shade-50">
            {t.nav.products}
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-4xl">
            {activeCategoryObj
              ? isVi
                ? activeCategoryObj.name
                : activeCategoryObj.nameEn
              : filters.search
              ? `${isVi ? "Kết quả tìm kiếm cho" : "Search results for"}: "${filters.search}"`
              : t.products.allProducts}
          </h1>
          <p className="text-xs text-shade-50">
            {t.products.showingResults.replace("{count}", String(products.length))}
          </p>
        </div>
      </div>

      {/* Main Catalog Layout (Sidebar + Grid) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Desktop Sidebar Filter (3 cols) */}
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>
        </aside>

        {/* Mobile Filter Toggle & Controls */}
        <div className="flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 rounded-full border border-hairline-light bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t.products.filters}</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-shade-50">{t.products.sortBy}:</span>
            <select
              value={filters.sortBy || "featured"}
              onChange={(e) =>
                handleFilterChange({
                  sortBy: e.target.value as ProductFilterParams["sortBy"],
                })
              }
              className="rounded-md border border-hairline-light bg-white px-2.5 py-1 text-xs text-ink focus:border-black focus:outline-none"
            >
              <option value="featured">{t.products.sortFeatured}</option>
              <option value="newest">{t.products.sortNewest}</option>
              <option value="price-asc">{t.products.sortPriceAsc}</option>
              <option value="price-desc">{t.products.sortPriceDesc}</option>
              <option value="rating">{t.products.sortRating}</option>
            </select>
          </div>
        </div>

        {/* Mobile Filter Sheet */}
        {isMobileFilterOpen && (
          <div className="lg:hidden">
            <ProductFilters
              categories={categories}
              filters={filters}
              onFilterChange={(f) => {
                handleFilterChange(f);
                setIsMobileFilterOpen(false);
              }}
              onReset={() => {
                handleReset();
                setIsMobileFilterOpen(false);
              }}
            />
          </div>
        )}

        {/* Product Grid Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Sort & Actions Bar (Desktop) */}
          <div className="hidden items-center justify-between border-b border-hairline-light pb-3 lg:flex">
            <div className="text-xs text-shade-50">
              {filters.search && (
                <span className="mr-2">
                  Từ khóa: <strong>{filters.search}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-shade-50">{t.products.sortBy}:</span>
              <div className="flex gap-1">
                {[
                  { key: "featured", label: t.products.sortFeatured },
                  { key: "newest", label: t.products.sortNewest },
                  { key: "price-asc", label: t.products.sortPriceAsc },
                  { key: "price-desc", label: t.products.sortPriceDesc },
                  { key: "rating", label: t.products.sortRating },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() =>
                      handleFilterChange({
                        sortBy: s.key as ProductFilterParams["sortBy"],
                      })
                    }
                    className={`rounded-full px-3 py-1 text-xs transition-colors cursor-pointer ${
                      filters.sortBy === s.key
                        ? "bg-black text-white font-semibold shadow-xs"
                        : "bg-shade-30/30 text-shade-60 hover:bg-shade-30 hover:text-black"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-80 animate-pulse rounded-md bg-shade-30/40"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline-light py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-shade-30/40 text-shade-40 mb-3">
                <PackageX className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-ink mb-1">
                {t.products.noProductsFound}
              </h4>
              <p className="text-xs text-shade-50 max-w-sm mb-4">
                Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bớt tiêu chí lọc.
              </p>
              <Button variant="outline-light" size="sm" onClick={handleReset}>
                {t.products.resetFilters}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
