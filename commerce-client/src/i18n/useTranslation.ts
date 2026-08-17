"use client";

import { useParams } from "next/navigation";
import { vi } from "./dictionaries/vi";
import { en } from "./dictionaries/en";
import { Locale } from "@/types/common";
import { DEFAULT_LOCALE } from "./config";

const dictionaries = {
  vi,
  en,
};

export function useTranslation() {
  const params = useParams();
  const lang = (params?.lang as Locale) || DEFAULT_LOCALE;
  const currentLang = (lang === "en" || lang === "vi") ? lang : DEFAULT_LOCALE;
  const t = dictionaries[currentLang] || dictionaries.vi;

  return {
    t,
    lang: currentLang,
    isVi: currentLang === "vi",
    isEn: currentLang === "en",
  };
}
