"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { Locale } from "@/types/common";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = (targetLang: Locale) => {
    if (targetLang === lang) return;

    // Replace /[lang]/... with /[targetLang]/...
    let newPath = pathname;
    if (pathname.startsWith("/vi")) {
      newPath = pathname.replace(/^\/vi/, `/${targetLang}`);
    } else if (pathname.startsWith("/en")) {
      newPath = pathname.replace(/^\/en/, `/${targetLang}`);
    } else {
      newPath = `/${targetLang}${pathname}`;
    }

    router.push(newPath);
  };

  return (
    <div className="inline-flex items-center rounded-full border border-hairline-light bg-white/80 p-1 backdrop-blur-sm shadow-sm text-xs font-medium">
      <div className="flex items-center px-1.5 text-shade-50">
        <Globe className="h-3.5 w-3.5" />
      </div>
      <button
        type="button"
        onClick={() => toggleLanguage("vi")}
        className={`rounded-full px-2.5 py-1 transition-all cursor-pointer select-none ${
          lang === "vi"
            ? "bg-black text-white font-semibold shadow-xs"
            : "text-shade-60 hover:text-black"
        }`}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => toggleLanguage("en")}
        className={`rounded-full px-2.5 py-1 transition-all cursor-pointer select-none ${
          lang === "en"
            ? "bg-black text-white font-semibold shadow-xs"
            : "text-shade-60 hover:text-black"
        }`}
      >
        EN
      </button>
    </div>
  );
}
