"use client";

import * as React from "react";
import { ProductVariant } from "@/types/product";
import { useTranslation } from "@/i18n/useTranslation";
import { Check } from "lucide-react";

export function ProductVariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}) {
  const { isVi, t } = useTranslation();

  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">{t.productDetail.selectVariant}:</span>
        {selectedVariant && (
          <span className="text-shade-50">
            {isVi ? selectedVariant.name : selectedVariant.nameEn} (
            {selectedVariant.stock > 0
              ? `${t.common.inStock}: ${selectedVariant.stock}`
              : t.common.outOfStock}
            )
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectVariant(variant)}
              className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all cursor-pointer select-none ${
                isSelected
                  ? "border-black bg-black text-white shadow-sm font-semibold"
                  : "border-hairline-light bg-white text-ink hover:border-shade-40 hover:bg-shade-30/20"
              } ${isOutOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
            >
              {isSelected && <Check className="h-3.5 w-3.5" />}
              <span>{isVi ? variant.name : variant.nameEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
