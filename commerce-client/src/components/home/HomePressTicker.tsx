"use client";

import * as React from "react";
import { ShieldCheck, Zap, RotateCcw, Award, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function HomePressTicker() {
  const { isVi } = useTranslation();

  const pressItems = [
    { press: "GQ MAGAZINE", quote: isVi ? "Đỉnh cao thiết kế tối giản đương đại" : "The pinnacle of contemporary minimalism" },
    { press: "WIRED", quote: isVi ? "Chất âm audiophile chuẩn phòng thu" : "Studio-grade audiophile acoustic precision" },
    { press: "VOGUE LIVING", quote: isVi ? "Tác phẩm nghệ thuật cho không gian sống" : "A masterpiece of refined living aesthetics" },
    { press: "MONOCLE", quote: isVi ? "Sự hoàn hảo trong từng đường nét thủ công" : "Perfection in every handcrafted detail" },
  ];

  return (
    <div className="border-y border-hairline-light bg-black text-white py-4 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Press Mentions */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 items-center justify-between border-b border-surface-elevated-dark pb-3.5 mb-3.5">
          {pressItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-[10px] font-bold tracking-widest text-aloe-10 uppercase">
                {item.press}
              </span>
              <p className="text-[11px] text-shade-40 italic mt-0.5 truncate max-w-[220px]">
                "{item.quote}"
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Guarantees Strip */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-1 text-xs">
          <div className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-aloe-10 shrink-0" />
            <div>
              <span className="font-semibold text-white">100% Chính Hãng</span>
              <p className="text-[10px] text-shade-40">Bảo chứng toàn cầu</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-aloe-10 shrink-0" />
            <div>
              <span className="font-semibold text-white">Giao Hỏa Tốc 2H</span>
              <p className="text-[10px] text-shade-40">Nội thành HN &amp; TP.HCM</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw className="h-4 w-4 text-aloe-10 shrink-0" />
            <div>
              <span className="font-semibold text-white">15 Ngày Đổi Trả</span>
              <p className="text-[10px] text-shade-40">Miễn phí thủ tục</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-aloe-10 shrink-0" />
            <div>
              <span className="font-semibold text-white">Bảo Hành Điện Tử</span>
              <p className="text-[10px] text-shade-40">Kích hoạt thông minh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
