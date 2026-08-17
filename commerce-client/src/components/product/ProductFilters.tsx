"use client";

import * as React from "react";
import { SlidersHorizontal, RotateCcw, Star } from "lucide-react";
import { ProductCategory, ProductFilterParams } from "@/types/product";
import { useTranslation } from "@/i18n/useTranslation";

export function ProductFilters({
  categories,
  filters,
  onFilterChange,
  onReset,
}: {
  categories: ProductCategory[];
  filters: ProductFilterParams;
  onFilterChange: (newFilters: Partial<ProductFilterParams>) => void;
  onReset: () => void;
}) {
  const { t, isVi } = useTranslation();

  return (
    <div className="space-y-6 rounded-md border border-hairline-light bg-white p-4">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-hairline-light pb-3">
        <div className="flex items-center gap-2 font-semibold text-ink text-xs uppercase tracking-wider">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{t.products.filters}</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] text-shade-50 hover:text-black transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>{t.products.resetFilters}</span>
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-shade-50">
          {t.products.categories}
        </h5>
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onFilterChange({ category: undefined })}
            className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors text-left cursor-pointer ${
              !filters.category
                ? "bg-black text-white font-semibold"
                : "text-shade-60 hover:bg-shade-30/30 hover:text-ink"
            }`}
          >
            <span>{t.products.allProducts}</span>
          </button>
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ category: cat.slug })}
                className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors text-left cursor-pointer ${
                  isSelected
                    ? "bg-black text-white font-semibold"
                    : "text-shade-60 hover:bg-shade-30/30 hover:text-ink"
                }`}
              >
                <span>{isVi ? cat.name : cat.nameEn}</span>
                {cat.itemCount && (
                  <span className={`text-[10px] ${isSelected ? "text-shade-30" : "text-shade-40"}`}>
                    {cat.itemCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price filter */}
      <div className="space-y-2 pt-2 border-t border-hairline-light">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-shade-50">
          {t.products.priceRange}
        </h5>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-shade-40">{t.products.minPrice}</label>
            <input
              type="number"
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onFilterChange({
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="0"
              className="h-8 w-full rounded-md border border-hairline-light px-2.5 text-xs text-ink focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-shade-40">{t.products.maxPrice}</label>
            <input
              type="number"
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onFilterChange({
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="50,000,000"
              className="h-8 w-full rounded-md border border-hairline-light px-2.5 text-xs text-ink focus:border-black focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Rating filter */}
      <div className="space-y-2 pt-2 border-t border-hairline-light">
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-shade-50">
          {t.products.ratingFilter}
        </h5>
        <div className="flex flex-col gap-0.5">
          {[5, 4.5, 4].map((ratingVal) => {
            const isSelected = filters.rating === ratingVal;
            return (
              <button
                key={ratingVal}
                type="button"
                onClick={() =>
                  onFilterChange({
                    rating: isSelected ? undefined : ratingVal,
                  })
                }
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-aloe-10 text-black font-semibold"
                    : "text-shade-60 hover:bg-shade-30/30"
                }`}
              >
                <div className="flex items-center text-amber-400">
                  <Star className="h-3 w-3 fill-current" />
                </div>
                <span>Từ {ratingVal} sao</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
