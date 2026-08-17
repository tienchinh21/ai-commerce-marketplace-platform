import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, lang: string = "vi"): string {
  if (lang === "vi") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  // Convert approximate VND to USD if needed, or format in USD
  const usdAmount = amount > 1000 ? amount / 25000 : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
}

export function formatDate(dateStr: string, lang: string = "vi"): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat(lang === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function calculateDiscount(originalPrice: number, salePrice?: number): number | null {
  if (!salePrice || salePrice >= originalPrice) return null;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
