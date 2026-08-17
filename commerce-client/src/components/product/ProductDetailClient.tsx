"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";
import { Product, ProductVariant } from "@/types/product";
import { useTranslation } from "@/i18n/useTranslation";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductVariantSelector } from "@/components/product/ProductVariantSelector";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductJsonLd } from "@/components/common/SeoHead";
import { useCartStore } from "@/stores/useCartStore";
import { useToast } from "@/components/ui/toast";

export function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { t, lang, isVi } = useTranslation();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { showToast } = useToast();

  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant>(
    product.variants[0] || {
      id: "default",
      sku: product.id,
      name: "Mặc định",
      nameEn: "Default",
      price: product.price,
      stock: product.stock,
      options: {},
    }
  );

  const [quantity, setQuantity] = React.useState(1);
  const [isWishlist, setIsWishlist] = React.useState(false);

  const routes = isVi ? ROUTES.vi : ROUTES.en;
  const currentPrice = selectedVariant.price || product.price;
  const originalPrice = selectedVariant.originalPrice || product.originalPrice;
  const discount = calculateDiscount(originalPrice || 0, currentPrice);

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    showToast({
      title: isVi ? "Đã thêm vào giỏ hàng" : "Added to Cart",
      description: `${isVi ? product.title : product.titleEn} x ${quantity}`,
      type: "success",
    });
  };

  const handleBuyNow = () => {
    addItem(product, selectedVariant, quantity);
    router.push(routes.checkout);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        title: isVi ? "Đã sao chép liên kết" : "Link Copied",
        description: isVi ? "Bạn có thể chia sẻ sản phẩm này ngay" : "Product URL copied to clipboard",
        type: "info",
      });
    }
  };

  return (
    <>
      <ProductJsonLd product={product} lang={lang} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-shade-50">
          <Link href={routes.home} className="hover:text-black transition-colors">
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link href={routes.products} className="hover:text-black transition-colors">
            {t.nav.products}
          </Link>
          <span>/</span>
          <Link
            href={`${routes.products}?category=${product.category.slug}`}
            className="hover:text-black transition-colors"
          >
            {isVi ? product.category.name : product.category.nameEn}
          </Link>
          <span>/</span>
          <span className="text-ink font-medium truncate max-w-[200px]">
            {isVi ? product.title : product.titleEn}
          </span>
        </nav>

        {/* Product Core Grid (Gallery Left + Info Right) */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-16">
          {/* Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              title={isVi ? product.title : product.titleEn}
            />
          </div>

          {/* Product Meta & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Brand & Stock */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-shade-50">
                  {product.brand}
                </span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                  {t.common.inStock}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {isVi ? product.title : product.titleEn}
              </h1>

              {/* Rating & Sold */}
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-ink ml-1">{product.rating}</span>
                  <span className="text-shade-40">({product.reviewCount} {t.common.reviews})</span>
                </div>
                <span className="text-shade-30">•</span>
                <span className="text-shade-50">
                  {t.common.sold} {product.soldCount}
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 border-y border-hairline-light py-3">
              <span className="text-3xl font-bold tracking-tight text-ink">
                {formatPrice(currentPrice, lang)}
              </span>
              {originalPrice && (
                <span className="text-sm text-shade-40 line-through">
                  {formatPrice(originalPrice, lang)}
                </span>
              )}
              {discount && (
                <span className="rounded-full bg-aloe-10 px-2 py-0.5 text-xs font-bold text-black">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-shade-60 leading-relaxed">
              {isVi ? product.shortDescription : product.shortDescriptionEn}
            </p>

            {/* Variant Selector */}
            <ProductVariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-semibold text-ink">
                {t.productDetail.quantity}:
              </span>
              <div className="flex items-center gap-2 rounded-md border border-hairline-light bg-white px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-0.5 text-shade-60 hover:text-black cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="min-w-6 text-center text-xs font-semibold text-ink">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-0.5 text-shade-60 hover:text-black cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 pt-3 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>{t.common.addToCart}</span>
              </Button>

              <Button
                variant="aloe"
                size="lg"
                className="flex-1"
                onClick={handleBuyNow}
              >
                <Zap className="mr-2 h-4 w-4" />
                <span>{t.common.buyNow}</span>
              </Button>

              <button
                type="button"
                onClick={() => setIsWishlist(!isWishlist)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-hairline-light transition-colors cursor-pointer ${
                  isWishlist ? "bg-red-50 text-red-500 fill-red-500 border-red-200" : "hover:bg-shade-30/20 text-shade-60"
                }`}
                title={t.productDetail.wishlist}
              >
                <Heart className={`h-4 w-4 ${isWishlist ? "fill-current" : ""}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-light text-shade-60 hover:bg-shade-30/20 transition-colors cursor-pointer"
                title={t.productDetail.share}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Guarantees Strip */}
            <div className="grid grid-cols-3 gap-2 border-t border-hairline-light pt-5 text-[11px] text-shade-60">
              <div className="flex flex-col items-center text-center gap-1">
                <ShieldCheck className="h-4 w-4 text-ink" />
                <span>100% Chính Hãng</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 border-x border-hairline-light px-2">
                <Truck className="h-4 w-4 text-ink" />
                <span>Giao Hỏa Tốc</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw className="h-4 w-4 text-ink" />
                <span>Đổi Trả 15 Ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content: Specs, Description, Reviews */}
        <div className="mb-20">
          <Tabs defaultValue="description">
            <div className="flex justify-center border-b border-hairline-light pb-4">
              <TabsList>
                <TabsTrigger value="description">
                  {t.productDetail.description}
                </TabsTrigger>
                <TabsTrigger value="specs">
                  {t.productDetail.specifications}
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  {t.productDetail.customerReviews} ({product.reviewCount})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Description Tab */}
            <TabsContent value="description" className="max-w-4xl mx-auto py-6">
              <div className="prose prose-neutral max-w-none text-xs leading-relaxed sm:text-sm text-shade-60 space-y-4">
                <p>{isVi ? product.description : product.descriptionEn}</p>
                <div className="rounded-lg bg-shade-30/10 p-5 my-6 border border-hairline-light">
                  <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">
                    {isVi ? "Đặc điểm nổi bật" : "Product Highlights"}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-shade-60">
                    <li>Chế tác từ vật liệu cao cấp, độ bền vượt trội theo thời gian.</li>
                    <li>Tích hợp công nghệ cảm ứng và điều khiển thông minh.</li>
                    <li>Bảo hành chính hãng toàn diện trên toàn hệ thống OKZ Commerce.</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* Specs Tab */}
            <TabsContent value="specs" className="max-w-3xl mx-auto py-6">
              <div className="overflow-hidden rounded-md border border-hairline-light bg-white">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {Object.entries(isVi ? product.specs : product.specsEn).map(
                      ([key, val], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? "bg-shade-30/10" : "bg-white"}
                        >
                          <td className="w-1/3 py-2.5 px-4 font-semibold text-shade-60 border-b border-hairline-light">
                            {key}
                          </td>
                          <td className="py-2.5 px-4 text-ink border-b border-hairline-light font-medium">
                            {val}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="max-w-4xl mx-auto py-6">
              <ProductReviews
                reviews={product.reviews}
                overallRating={product.rating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-hairline-light pt-10">
            <h3 className="text-lg font-bold tracking-tight text-ink mb-6">
              {t.productDetail.relatedProducts}
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
