import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
} from "lucide-react";
import { productService } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
import { HomeHero } from "@/components/home/HomeHero";
import { HomePressTicker } from "@/components/home/HomePressTicker";
import { HomeBentoGrid } from "@/components/home/HomeBentoGrid";
import { HomeShopTheLook } from "@/components/home/HomeShopTheLook";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/types/common";
import { ROUTES } from "@/lib/constants";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "en" || rawLang === "vi" ? rawLang : "vi") as Locale;
  const t = getDictionary(lang);
  const isVi = lang === "vi";
  const routes = isVi ? ROUTES.vi : ROUTES.en;

  const [categories, productsData] = await Promise.all([
    productService.getCategories(),
    productService.getProducts(),
  ]);

  const featuredProducts = productsData.products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = productsData.products.filter((p) => p.isNew || !p.isFeatured).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* 1. CINEMATIC FULL-BLEED LUXURY HERO SLIDER */}
      <HomeHero />

      {/* 2. PRESS & VALUE PROPOSITION TICKER */}
      <HomePressTicker />

      <div className="flex flex-col gap-20 md:gap-28 py-16">
        {/* 3. VISUAL CATEGORIES SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-6 flex items-end justify-between border-b border-hairline-light pb-4">
            <div>
              <span className="pill-tag-mint mb-1.5">{t.home.categoriesTitle}</span>
              <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {isVi ? "Khám Phá Theo Danh Mục Tuyển Chọn" : "Explore Curated Categories"}
              </h2>
            </div>

            <Link
              href={routes.products}
              className="inline-flex items-center text-xs font-semibold text-ink hover:underline gap-1"
            >
              <span>{t.common.viewAll}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Clean 5-column Category Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`${routes.products}?category=${cat.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-hairline-light bg-white transition-all duration-300 hover:shadow-elevation-3 hover:-translate-y-0.5"
              >
                <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-shade-30/20">
                  {cat.imageUrl && (
                    <img
                      src={cat.imageUrl}
                      alt={isVi ? cat.name : cat.nameEn}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-black backdrop-blur-xs">
                    {cat.itemCount} items
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-ink line-clamp-1 group-hover:text-shade-60 transition-colors">
                    {isVi ? cat.name : cat.nameEn}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. LUXURY BENTO GRID SHOWCASE */}
        <HomeBentoGrid />

        {/* 5. CURATED SELECTION / FEATURED PRODUCTS */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-6 flex items-end justify-between border-b border-hairline-light pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-shade-50">
                CURATED SELECTION
              </span>
              <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {isVi ? "Sản Phẩm Nổi Bật Trong Tuần" : "Weekly Featured Picks"}
              </h2>
            </div>

            <Link
              href={routes.products}
              className="btn-outline-light text-xs py-1.5 px-3.5"
            >
              <span>{t.common.viewAll}</span>
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          {/* 4-col Responsive Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. INTERACTIVE ROOM / SHOP THE LOOK HOTSPOTS */}
        <HomeShopTheLook products={productsData.products} />

        {/* 7. PROMOTIONAL FEATURE STRIP (Pistachio & Aloe Accent) */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="rounded-xl bg-pistachio-10 p-8 lg:p-12 border border-aloe-10 shadow-elevation-3 relative overflow-hidden">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8 space-y-3">
                <span className="pill-tag-mint">
                  {t.home.curatedPromoTitle}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {isVi
                    ? "Trải Nghiệm Mua Sắm Thông Minh Tích Hợp AI"
                    : "AI-Powered Intelligent Commerce Experience"}
                </h3>
                <p className="text-xs text-shade-60 sm:text-sm max-w-xl leading-relaxed">
                  {t.home.curatedPromoSubtitle} Hệ thống phân tích sắc thái nhận xét thực tế, tìm kiếm ngữ nghĩa siêu tốc và bảo hành điện tử chính hãng 100%.
                </p>

                <div className="pt-2">
                  <Link
                    href={routes.products}
                    className="btn-primary-pill text-xs py-2.5 px-5"
                  >
                    <span>{t.home.exploreBtn}</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2.5 border-t border-aloe-10/80 pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0 text-xs text-ink font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-700" />
                  <span>Tìm kiếm ngữ nghĩa thông minh</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-700" />
                  <span>Tóm tắt nhận xét người mua bằng AI</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-700" />
                  <span>Bảo chứng 100% xuất xứ chính hãng</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. NEW ARRIVALS GRID */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-6 flex items-end justify-between border-b border-hairline-light pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-shade-50">
                NEW DROPS
              </span>
              <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {isVi ? "Hàng Mới Vừa Lên Kệ" : "Fresh Off the Runway"}
              </h2>
            </div>

            <Link
              href={routes.products}
              className="inline-flex items-center text-xs font-semibold text-ink hover:underline gap-1"
            >
              <span>{t.common.viewAll}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
