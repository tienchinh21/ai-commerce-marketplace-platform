"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Volume2, Sparkles, Watch, Shield, Compass } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/lib/constants";

export function HomeBentoGrid() {
  const { isVi } = useTranslation();
  const routes = isVi ? ROUTES.vi : ROUTES.en;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      {/* Section Header */}
      <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end border-b border-hairline-light pb-4">
        <div>
          <span className="pill-tag-mint mb-1.5">FLAGSHIP CRAFTSMANSHIP</span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {isVi ? "Nghệ Thuật Chế Tác & Đỉnh Cao Công Nghệ" : "The Art of Refined Craftsmanship"}
          </h2>
          <p className="text-xs text-shade-50 mt-0.5">
            {isVi
              ? "Tuyển tập những thiết kế biểu tượng với chất lượng hoàn thiện không tì vết"
              : "Iconic curated design objects built with uncompromising material standards"}
          </p>
        </div>

        <Link
          href={routes.products}
          className="inline-flex items-center text-xs font-semibold text-ink hover:underline gap-1"
        >
          <span>{isVi ? "Xem tất cả bộ sưu tập" : "Explore All Collections"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Bento Item 1: Large Primary Showcase (7 cols) */}
        <div className="group relative overflow-hidden rounded-xl bg-black text-white p-8 sm:p-10 lg:col-span-7 min-h-[380px] flex flex-col justify-between border border-surface-elevated-dark shadow-elevation-3">
          <img
            src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1400&auto=format&fit=crop&q=90"
            alt="Audiophile Acoustic Masterpiece"
            className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Top tag & sound icon */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full bg-aloe-10/90 px-3 py-1 text-[10px] font-bold text-black uppercase tracking-wider backdrop-blur-xs">
              ACOUSTIC EXCELLENCE
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-surface-elevated-dark bg-black/60 px-3 py-1 text-[11px] text-aloe-10 backdrop-blur-md">
              <Volume2 className="h-3.5 w-3.5" />
              <span>Hi-Res Lossless 96kHz/24-bit</span>
            </div>
          </div>

          {/* Bottom typography & action */}
          <div className="relative z-10 space-y-3 max-w-md pt-12">
            <h3 className="font-display text-2xl font-light sm:text-3xl text-white leading-tight">
              {isVi ? (
                <>Âm thanh vòm không gian chuẩn <span className="font-semibold text-aloe-10">Studio Master</span>.</>
              ) : (
                <>Immersive spatial acoustic architecture by <span className="font-semibold text-aloe-10">Studio Master</span>.</>
              )}
            </h3>
            <p className="text-xs text-shade-30 leading-relaxed line-clamp-2">
              {isVi
                ? "Màng loa Beryllium 40mm cao cấp cùng công nghệ triệt tiêu tiếng ồn chủ động thích ứng thế hệ mới."
                : "Custom 40mm Beryllium drivers engineered with adaptive active noise cancellation technology."}
            </p>
            <div className="pt-1">
              <Link
                href={`${routes.products}?category=tech-audio`}
                className="btn-aloe-pill text-xs py-2 px-4.5"
              >
                <span>{isVi ? "Trải Nghiệm Ngay" : "Discover Sound"}</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols, 2 stacked bento cards) */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-5">
          {/* Bento Item 2: Horology Precision */}
          <div className="group relative overflow-hidden rounded-xl bg-black text-white p-6 min-h-[200px] flex flex-col justify-between border border-surface-elevated-dark shadow-elevation-3">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=90"
              alt="Swiss Horology"
              className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                SWISS HOROLOGY
              </span>
              <span className="text-[10px] text-shade-30 font-mono">Calibre 8000 Automatic</span>
            </div>

            <div className="relative z-10 space-y-1.5 pt-8">
              <h4 className="text-base font-semibold text-white">
                {isVi ? "Tuyệt Tác Đồng Hồ Cơ Khí" : "Swiss Automatic Timepieces"}
              </h4>
              <p className="text-[11px] text-shade-30 line-clamp-1">
                Kính sapphire chống lóa, vỏ thép không gỉ 316L đánh bóng satin.
              </p>
              <Link
                href={`${routes.products}?category=watches`}
                className="inline-flex items-center text-xs font-semibold text-aloe-10 hover:underline gap-1 pt-1"
              >
                <span>{isVi ? "Xem chi tiết" : "Explore Timepieces"}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Bento Item 3: Botanical Leather & Living */}
          <div className="group relative overflow-hidden rounded-xl bg-black text-white p-6 min-h-[200px] flex flex-col justify-between border border-surface-elevated-dark shadow-elevation-3">
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&auto=format&fit=crop&q=90"
              alt="Italian Leather"
              className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                HERITAGE LEATHER
              </span>
              <span className="text-[10px] text-shade-30">Tuscan Full-Grain</span>
            </div>

            <div className="relative z-10 space-y-1.5 pt-8">
              <h4 className="text-base font-semibold text-white">
                {isVi ? "Đồ Da Thuộc Thảo Mộc Ý" : "Vegetable-Tanned Italian Leather"}
              </h4>
              <p className="text-[11px] text-shade-30 line-clamp-1">
                Chế tác may tay thủ công từng đường kim mũi chỉ, patina đẹp theo thời gian.
              </p>
              <Link
                href={`${routes.products}?category=leather`}
                className="inline-flex items-center text-xs font-semibold text-aloe-10 hover:underline gap-1 pt-1"
              >
                <span>{isVi ? "Khám phá đồ da" : "Explore Leather"}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
