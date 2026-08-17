import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
} from "lucide-react";
import { productService } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
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
      {/* 1. CINEMATIC DARK HERO (Canvas Night #000000) */}
      <section className="relative overflow-hidden bg-black text-white py-16 lg:py-24">
        {/* Ambient subtle light glow */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-surface-elevated-dark/50 blur-[120px] pointer-events-none animate-hero-glow" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left: Giant Display Typography */}
            <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-surface-elevated-dark bg-canvas-night-elevated px-3.5 py-1 text-xs font-semibold tracking-wider text-aloe-10">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.home.heroTag}</span>
              </div>

              <h1 className="font-display text-4xl font-light leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                {isVi ? (
                  <>
                    Tuyệt tác <span className="font-normal italic text-aloe-10">Công Nghệ</span> &amp; Phong Cách Sống.
                  </>
                ) : (
                  <>
                    Masterpiece of <span className="font-normal italic text-aloe-10">Tech</span> &amp; Modern Living.
                  </>
                )}
              </h1>

              <p className="max-w-xl text-sm font-normal leading-relaxed text-shade-40 sm:text-base">
                {t.home.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href={routes.products}
                  className="btn-aloe-pill text-xs sm:text-sm"
                >
                  <span>{t.home.exploreBtn}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <Link
                  href={`${routes.products}?category=tech-audio`}
                  className="btn-outline-dark text-xs sm:text-sm"
                >
                  <span>{t.nav.categories}</span>
                </Link>
              </div>

              {/* Specs Micro Badge strip */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-surface-elevated-dark text-xs text-shade-40">
                <div>
                  <span className="block font-bold text-white text-sm">96 kHz</span>
                  <span>Lossless Hi-Res</span>
                </div>
                <div className="h-6 w-px bg-surface-elevated-dark" />
                <div>
                  <span className="block font-bold text-white text-sm">60 Giờ</span>
                  <span>Thời Lượng Pin</span>
                </div>
                <div className="h-6 w-px bg-surface-elevated-dark" />
                <div>
                  <span className="block font-bold text-white text-sm">Active ANC</span>
                  <span>Chống Ồn Thích Ứng</span>
                </div>
              </div>
            </div>

            {/* Right: Featured Hero Visual with sleek caption */}
            <div className="lg:col-span-5 relative animate-fade-in-up [animation-delay:150ms]">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl border border-surface-elevated-dark bg-canvas-night-elevated shadow-elevation-4">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=90"
                  alt="OKZ Studio Master One"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-103"
                />

                {/* Minimalist Specs Overlay */}
                <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-surface-elevated-dark bg-black/85 p-3.5 backdrop-blur-md flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-aloe-10 uppercase block">
                      {t.home.featuredBannerTag}
                    </span>
                    <span className="font-medium text-white">OKZ Studio Master One</span>
                  </div>
                  <span className="font-semibold text-aloe-10">8.490.000₫</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
