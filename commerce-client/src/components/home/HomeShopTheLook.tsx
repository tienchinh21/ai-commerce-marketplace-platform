"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, ShoppingBag, ArrowRight, Sparkles, Check } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useCartStore } from "@/stores/useCartStore";
import { useToast } from "@/components/ui/toast";

interface HotspotItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  slug: string;
  top: string;
  left: string;
  thumbnail: string;
}

export function HomeShopTheLook({ products }: { products: Product[] }) {
  const { lang, isVi, t } = useTranslation();
  const { addItem, openCart } = useCartStore();
  const { showToast } = useToast();

  const hotspots: HotspotItem[] = [
    {
      id: "hotspot-1",
      name: "Đèn Cây Chiếu Sáng Kiến Trúc Minimal Lumina",
      nameEn: "Minimal Lumina Architectural Floor Lamp",
      price: 4950000,
      slug: "den-cay-chieu-sang-kien-truc-minimal-lumina",
      top: "32%",
      left: "48%",
      thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "hotspot-2",
      name: "Bàn Làm Việc Gỗ Óc Chó Bắc Mỹ Nordic Walnut",
      nameEn: "Nordic Walnut Solid Wood Executive Desk",
      price: 18900000,
      slug: "ban-lam-viec-go-oc-cho-nordic-walnut",
      top: "68%",
      left: "35%",
      thumbnail: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=80",
    },
    {
      id: "hotspot-3",
      name: "Loa Không Dây Hi-End OKZ SoundSphere Studio",
      nameEn: "OKZ SoundSphere Studio Hi-End Wireless Speaker",
      price: 12500000,
      slug: "loa-khong-day-okz-soundsphere-studio",
      top: "55%",
      left: "72%",
      thumbnail: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80",
    },
  ];

  const [activeHotspot, setActiveHotspot] = React.useState<HotspotItem>(hotspots[0]);

  const handleQuickAdd = (spot: HotspotItem) => {
    const matchedProduct = products.find((p) => p.slug === spot.slug) || {
      id: spot.id,
      title: spot.name,
      titleEn: spot.nameEn,
      slug: spot.slug,
      price: spot.price,
      thumbnail: spot.thumbnail,
      brand: "OKZ Studio",
      stock: 10,
      rating: 5.0,
      reviewCount: 18,
      soldCount: 42,
      category: { id: "cat-4", name: "Không Gian Sống", nameEn: "Living", slug: "living" },
      variants: [{ id: "v1", sku: "V1", name: "Tiêu Chuẩn", nameEn: "Standard", price: spot.price, stock: 10, options: {} }],
      images: [spot.thumbnail],
      description: spot.name,
      descriptionEn: spot.nameEn,
      specs: {},
      specsEn: {},
      reviews: [],
    };

    addItem(matchedProduct as Product, matchedProduct.variants[0], 1);
    showToast({
      title: isVi ? "Đã thêm vào giỏ hàng" : "Added to Cart",
      description: isVi ? spot.name : spot.nameEn,
      type: "success",
    });
  };

  const routes = isVi ? ROUTES.vi : ROUTES.en;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end border-b border-hairline-light pb-4">
        <div>
          <span className="pill-tag-mint mb-1.5">INTERACTIVE SPACE</span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {isVi ? "Không Gian Sống & Làm Việc Đương Đại" : "Curated Architectural Workspace"}
          </h2>
          <p className="text-xs text-shade-50 mt-0.5">
            {isVi
              ? "Chạm vào các điểm tròn trên hình để xem và phối hợp các sản phẩm trong không gian thực tế"
              : "Click the hotspot pins on the room to explore curated products placed in real architectural spaces"}
          </p>
        </div>

        <Link
          href={`${routes.products}?category=living`}
          className="inline-flex items-center text-xs font-semibold text-ink hover:underline gap-1"
        >
          <span>{isVi ? "Xem bộ sưu tập nội thất" : "Explore Living Space"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Interactive Container */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
        {/* Left: Atmospheric Living Scene with Pins (8 cols) */}
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-shade-30/20 border border-hairline-light shadow-elevation-3 lg:col-span-8">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&auto=format&fit=crop&q=90"
            alt="Living Space Lookbook"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />

          {/* Hotspot Pins */}
          {hotspots.map((spot, idx) => {
            const isActive = activeHotspot.id === spot.id;

            return (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                <button
                  type="button"
                  onClick={() => setActiveHotspot(spot)}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-black text-aloe-10 scale-110 shadow-lg ring-4 ring-aloe-10/70"
                      : "bg-white/90 text-ink shadow-md hover:scale-110 hover:bg-white"
                  }`}
                  aria-label={`View ${spot.name}`}
                >
                  <span className="text-xs font-bold">{idx + 1}</span>
                  {/* Ripple pulse ring */}
                  <span className="absolute -inset-1 rounded-full bg-white/40 animate-ping pointer-events-none" />
                </button>
              </div>
            );
          })}

          {/* Floating Mobile/Desktop Current Pin Card overlay on bottom-left */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs rounded-lg border border-hairline-light bg-white/95 p-3 backdrop-blur-md shadow-elevation-4">
            <div className="flex items-center gap-3">
              <img
                src={activeHotspot.thumbnail}
                alt={activeHotspot.name}
                className="h-12 w-12 rounded-md object-cover border border-hairline-light bg-shade-30/30 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-shade-50 uppercase">Đang chọn điểm</p>
                <h5 className="text-xs font-semibold text-ink truncate">
                  {isVi ? activeHotspot.name : activeHotspot.nameEn}
                </h5>
                <span className="text-xs font-bold text-ink">
                  {formatPrice(activeHotspot.price, lang)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Featured Hotspot Details & Instant Add (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-hairline-light bg-white p-6 shadow-elevation-3 space-y-4">
            <div className="flex items-center justify-between border-b border-hairline-light pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-shade-50">
                LOOKBOOK ITEM DETAILS
              </span>
              <span className="rounded-full bg-aloe-10 px-2 py-0.5 text-[10px] font-bold text-black">
                IN STOCK
              </span>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-lg bg-shade-30/20 border border-hairline-light">
              <img
                src={activeHotspot.thumbnail}
                alt={activeHotspot.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-ink">
                {isVi ? activeHotspot.name : activeHotspot.nameEn}
              </h4>
              <div className="text-base font-bold text-ink">
                {formatPrice(activeHotspot.price, lang)}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleQuickAdd(activeHotspot)}
                className="btn-primary-pill flex-1 text-xs py-2.5"
              >
                <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                <span>{t.common.addToCart}</span>
              </button>

              <Link
                href={isVi ? ROUTES.vi.productDetail(activeHotspot.slug) : ROUTES.en.productDetail(activeHotspot.slug)}
                className="btn-outline-light text-xs py-2.5 px-3.5"
              >
                <span>Chi tiết</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
