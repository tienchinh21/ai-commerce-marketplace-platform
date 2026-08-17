"use client";

import * as React from "react";
import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useTranslation } from "@/i18n/useTranslation";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useCartStore } from "@/stores/useCartStore";
import { useToast } from "@/components/ui/toast";

export function ProductCard({ product }: { product: Product }) {
  const { lang, isVi, t } = useTranslation();
  const { addItem } = useCartStore();
  const { showToast } = useToast();
  const [isWishlist, setIsWishlist] = React.useState(false);

  const productUrl = isVi
    ? ROUTES.vi.productDetail(product.slug)
    : ROUTES.en.productDetail(product.slug);

  const discount = calculateDiscount(product.originalPrice || 0, product.price);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.variants[0], 1);
    showToast({
      title: isVi ? "Đã thêm vào giỏ hàng" : "Added to Cart",
      description: isVi ? product.title : product.titleEn,
      type: "success",
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-hairline-light bg-white p-3.5 shadow-elevation-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation-4">
      {/* Top Image Container inside Card */}
      <Link
        href={productUrl}
        className="relative aspect-square w-full overflow-hidden rounded-md bg-shade-30/20"
      >
        <img
          src={product.thumbnail}
          alt={isVi ? product.title : product.titleEn}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="rounded-full bg-black px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              NEW
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-aloe-10 px-2 py-0.5 text-[9px] font-bold text-black shadow-xs">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 shadow-xs cursor-pointer ${
            isWishlist ? "text-red-500 fill-red-500" : "text-shade-60 hover:text-black"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`h-3.5 w-3.5 ${isWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add To Cart Overlay (Desktop) */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-black/90 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-black active:scale-98 transition-all shadow-sm cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{t.common.addToCart}</span>
          </button>
        </div>
      </Link>

      {/* Product Content inside Card */}
      <div className="mt-3 flex flex-1 flex-col justify-between space-y-2">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[11px] font-medium text-shade-50">
            <span className="uppercase tracking-wider font-semibold text-shade-60">{product.brand}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-semibold text-ink">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={productUrl} className="block mt-1">
            <h4 className="text-[13px] font-semibold text-ink line-clamp-2 leading-snug group-hover:text-shade-60 transition-colors">
              {isVi ? product.title : product.titleEn}
            </h4>
          </Link>
        </div>

        {/* Pricing & Mobile Quick Add */}
        <div className="flex items-center justify-between pt-2 border-t border-hairline-light">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-ink">
              {formatPrice(product.price, lang)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-shade-40 line-through">
                {formatPrice(product.originalPrice, lang)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-shade-30/30 text-ink hover:bg-black hover:text-white transition-colors sm:hidden cursor-pointer"
            aria-label={t.common.addToCart}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
