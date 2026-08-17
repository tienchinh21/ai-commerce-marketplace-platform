"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Volume2, Sparkles, Watch, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/lib/constants";

interface HeroSlide {
  id: string;
  tag: string;
  tagEn: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  productName: string;
  price: string;
  ctaText: string;
  ctaTextEn: string;
  link: string;
  bgImage: string;
  specs: { label: string; value: string }[];
}

export function HomeHero() {
  const { isVi, lang } = useTranslation();
  const routes = isVi ? ROUTES.vi : ROUTES.en;

  const slides: HeroSlide[] = [
    {
      id: "slide-audio",
      tag: "FLAGSHIP ACOUSTIC 2026",
      tagEn: "FLAGSHIP ACOUSTIC 2026",
      title: "Âm Thanh Thuần Khiết. Thiết Kế Vượt Thời Gian.",
      titleEn: "Sound in Its Purest Form. Timeless Design.",
      subtitle: "Chế tác từ nhôm hàng không nguyên khối và da cừu thuộc thảo mộc. Màng loa Beryllium 40mm tái tạo không gian âm thanh chuẩn phòng thu.",
      subtitleEn: "Crafted from aerospace-grade anodized aluminum and vegetable-tanned lambskin. Custom 40mm Beryllium drivers for true studio acoustic precision.",
      productName: "OKZ Studio Master One",
      price: "8.490.000₫",
      ctaText: "Khám Phá Tuyệt Tác",
      ctaTextEn: "Discover Masterpiece",
      link: `${routes.products}/tai-nghe-chong-on-okz-studio-master-one`,
      bgImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1800&auto=format&fit=crop&q=90",
      specs: [
        { label: "Hi-Res Lossless", value: "96 kHz / 24-bit" },
        { label: "Thời Lượng Pin", value: "60 Giờ" },
        { label: "Chống Ồn", value: "Active ANC 2.0" },
      ],
    },
    {
      id: "slide-horology",
      tag: "SWISS HOROLOGY ATELIER",
      tagEn: "SWISS HOROLOGY ATELIER",
      title: "Nhịp Đập Cơ Khí. Sự Chính Xác Tuyệt Đối.",
      titleEn: "Mechanical Heartbeat. Absolute Precision.",
      subtitle: "Cỗ máy tự động Thụy Sĩ Calibre 8000 đặt trong bộ vỏ thép không gỉ 316L, hoàn thiện kính sapphire phủ chống lóa đa lớp.",
      subtitleEn: "Swiss-made Calibre 8000 automatic movement encased in 316L stainless steel with multi-layer anti-reflective sapphire crystal.",
      productName: "ChronoMaster Automatic 40mm",
      price: "24.900.000₫",
      ctaText: "Chiêm Ngưỡng Đồng Hồ",
      ctaTextEn: "Explore Timepiece",
      link: `${routes.products}/dong-ho-chronomaster-automatic`,
      bgImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1800&auto=format&fit=crop&q=90",
      specs: [
        { label: "Cỗ Máy", value: "Calibre 8000" },
        { label: "Dự Trữ Cót", value: "48 Giờ" },
        { label: "Kháng Nước", value: "10 ATM (100m)" },
      ],
    },
    {
      id: "slide-leather",
      tag: "HERITAGE TUSCAN LEATHER",
      tagEn: "HERITAGE TUSCAN LEATHER",
      title: "Da Bò Thuộc Thảo Mộc. Di Sản Chế Tác Thủ Công.",
      titleEn: "Vegetable-Tanned Tuscan Leather. Pure Heritage.",
      subtitle: "Da bò nguyên tấm tuyển chọn từ vùng Tuscany nước Ý, may tay thủ công từng đường chỉ sáp với lớp patina biến đổi độc bản theo năm tháng.",
      subtitleEn: "Full-grain leather from Tuscany, hand-stitched with waxed thread developing a rich personal patina over time.",
      productName: "Tuscan Artisan Leather Briefcase",
      price: "6.800.000₫",
      ctaText: "Xem Bộ Sưu Tập Da",
      ctaTextEn: "Discover Leather Goods",
      link: `${routes.products}/tui-xach-da-thu-cong-tuscan`,
      bgImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1800&auto=format&fit=crop&q=90",
      specs: [
        { label: "Chất Liệu", value: "Full-Grain Veg-Tan" },
        { label: "Xuất Xứ", value: "Tuscany, Italy" },
        { label: "Phụ Kiện", value: "Đồng Thau Đúc Solid" },
      ],
    },
  ];

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const currentSlide = slides[currentIdx];

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto slide every 7 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] w-full overflow-hidden bg-black text-white flex flex-col justify-between">
      {/* Background Image with Cinematic Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          key={currentSlide.id}
          src={currentSlide.bgImage}
          alt={currentSlide.productName}
          className="h-full w-full object-cover object-center opacity-45 transition-opacity duration-1000 animate-fade-in scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      {/* Top Ambient Glow */}
      <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-aloe-10/10 blur-[140px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 animate-fade-in-up">
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-surface-elevated-dark bg-black/60 px-3.5 py-1 text-xs font-semibold tracking-widest text-aloe-10 backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>{isVi ? currentSlide.tag : currentSlide.tagEn}</span>
          </div>

          {/* Editorial Display Heading */}
          <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl text-white">
            {isVi ? (
              <>
                {currentSlide.title.split(".")[0]}.{" "}
                <span className="font-normal italic text-aloe-10 block sm:inline">
                  {currentSlide.title.split(".")[1] || ""}
                </span>
              </>
            ) : (
              <>
                {currentSlide.titleEn.split(".")[0]}.{" "}
                <span className="font-normal italic text-aloe-10 block sm:inline">
                  {currentSlide.titleEn.split(".")[1] || ""}
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-xs font-normal leading-relaxed text-shade-30 sm:text-sm sm:leading-relaxed">
            {isVi ? currentSlide.subtitle : currentSlide.subtitleEn}
          </p>

          {/* CTAs & Product Price */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={currentSlide.link}
              className="btn-aloe-pill text-xs sm:text-sm"
            >
              <span>{isVi ? currentSlide.ctaText : currentSlide.ctaTextEn}</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 rounded-full border border-surface-elevated-dark bg-black/60 px-4 py-2.5 backdrop-blur-md">
              <span className="text-xs text-shade-40">{currentSlide.productName}:</span>
              <span className="text-xs font-bold text-white">{currentSlide.price}</span>
            </div>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-elevated-dark max-w-lg">
            {currentSlide.specs.map((sp, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-sm font-bold text-white block">{sp.value}</span>
                <span className="text-[11px] text-shade-40 block">{sp.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Interactive Slide Switcher Bar */}
      <div className="relative z-10 border-t border-surface-elevated-dark/70 bg-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Slide Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all cursor-pointer ${
                  currentIdx === idx
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-shade-40 hover:text-white hover:bg-surface-elevated-dark"
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">0{idx + 1}</span>
                <span className="hidden sm:inline">{s.productName}</span>
              </button>
            ))}
          </div>

          {/* Arrow Nav controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-elevated-dark bg-black text-shade-30 hover:bg-white hover:text-black transition-colors cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-elevated-dark bg-black text-shade-30 hover:bg-white hover:text-black transition-colors cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
