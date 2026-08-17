import { vi } from "./dictionaries/vi";
import { en } from "./dictionaries/en";
import { Locale } from "@/types/common";
import { DEFAULT_LOCALE } from "./config";

const dictionaries = {
  vi,
  en,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}
