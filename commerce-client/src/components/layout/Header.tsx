"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  Sparkles,
  ChevronDown,
  Clock,
  LogOut,
} from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUiStore } from "@/stores/useUiStore";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Header() {
  const { t, lang, isVi } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { getTotalItemsCount, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openMobileNav } = useUiStore();

  const [searchVal, setSearchVal] = React.useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const cartCount = getTotalItemsCount();
  const routes = isVi ? ROUTES.vi : ROUTES.en;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    router.push(`${routes.products}?search=${encodeURIComponent(searchVal.trim())}`);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline-light bg-white/90 backdrop-blur-md transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-black text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="h-3 w-3 text-aloe-10" />
        <span>{t.home.heroTag} — {t.common.freeShipping} cho đơn từ 2.000.000₫</span>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openMobileNav}
            className="rounded-full p-2 text-ink hover:bg-shade-30/30 md:hidden cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href={routes.home} className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tighter text-ink sm:text-2xl">
              OKZ<span className="text-emerald-700">.</span>
            </span>
            <span className="hidden text-[11px] font-bold uppercase tracking-widest text-shade-50 lg:inline-block border-l border-hairline-light pl-2">
              MARKETPLACE
            </span>
          </Link>
        </div>

        {/* Center: Main Navigation Desktop */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href={routes.home}
            className={`text-[14px] font-medium transition-colors hover:text-black ${
              pathname === routes.home ? "text-black font-semibold" : "text-shade-60"
            }`}
          >
            {t.nav.home}
          </Link>
          <Link
            href={routes.products}
            className={`text-[14px] font-medium transition-colors hover:text-black ${
              pathname.includes("san-pham") || pathname.includes("products")
                ? "text-black font-semibold"
                : "text-shade-60"
            }`}
          >
            {t.nav.products}
          </Link>
          <Link
            href={routes.orderHistory}
            className={`text-[14px] font-medium transition-colors hover:text-black ${
              pathname.includes("lich-su-don-hang") || pathname.includes("order-history")
                ? "text-black font-semibold"
                : "text-shade-60"
            }`}
          >
            {t.orders.title}
          </Link>
        </nav>

        {/* Center Search Input (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden max-w-xs flex-1 items-center px-4 lg:flex"
        >
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-shade-40" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={t.common.searchPlaceholder}
              className="h-9 w-full rounded-full border border-hairline-light bg-shade-30/20 pl-9 pr-4 text-xs text-ink placeholder:text-shade-40 focus:border-black focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </form>

        {/* Right: Language, Auth, Cart */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Cart Icon CTA */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-hairline-light bg-white text-ink transition-colors hover:bg-shade-30/20 active:scale-95 cursor-pointer shadow-xs"
            aria-label="Open Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-hairline-light bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-shade-30/20 cursor-pointer shadow-xs"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[11px] font-bold text-white">
                  {user.fullName.charAt(0)}
                </div>
                <span className="hidden max-w-[90px] truncate sm:inline-block">
                  {user.fullName}
                </span>
                <ChevronDown className="h-3 w-3 text-shade-40" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-hairline-light bg-white p-1.5 shadow-elevation-4 animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="px-3 py-2 border-b border-hairline-light">
                    <p className="text-xs font-semibold text-ink">{user.fullName}</p>
                    <p className="text-[11px] text-shade-50 truncate">{user.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-aloe-10 px-2 py-0.5 text-[10px] font-bold text-black">
                      {user.membershipTier} Member
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href={routes.profile}
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-shade-60 hover:bg-shade-30/30 hover:text-ink"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>{t.profile.title}</span>
                    </Link>
                    <Link
                      href={routes.orderHistory}
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-shade-60 hover:bg-shade-30/30 hover:text-ink"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>{t.orders.title}</span>
                    </Link>
                  </div>

                  <div className="border-t border-hairline-light pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>{t.common.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => router.push(routes.login)}
            >
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{t.common.login}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
