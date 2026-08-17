import { Locale } from "@/types/common";

export const LOCALES: Locale[] = ["vi", "en"];
export const DEFAULT_LOCALE: Locale = "vi";

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}
