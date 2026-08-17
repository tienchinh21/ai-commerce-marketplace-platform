"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/ui/sheet";
import { useUiStore } from "@/stores/useUiStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import {
  Home,
  ShoppingBag,
  Clock,
  User,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUiStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { t, isVi, lang } = useTranslation();
  const router = useRouter();

  const routes = isVi ? ROUTES.vi : ROUTES.en;

  const navItems = [
    { label: t.nav.home, href: routes.home, icon: Home },
    { label: t.nav.products, href: routes.products, icon: ShoppingBag },
    { label: t.orders.title, href: routes.orderHistory, icon: Clock },
    { label: t.profile.title, href: routes.profile, icon: User },
  ];

  return (
    <Sheet
      isOpen={isMobileNavOpen}
      onClose={closeMobileNav}
      side="left"
      title={<span className="font-bold tracking-tight text-ink">OKZ Commerce</span>}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-6">
          {/* User quick status */}
          <div className="rounded-xl border border-hairline-light bg-shade-30/20 p-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-black text-white flex items-center justify-center font-bold">
                  {user.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-ink">{user.fullName}</h5>
                  <p className="text-xs text-shade-50">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-shade-50">{t.auth.loginSubtitle}</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    closeMobileNav();
                    router.push(routes.login);
                  }}
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  {t.common.login} / {t.common.register}
                </Button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-shade-60 transition-colors hover:bg-shade-30/30 hover:text-ink active:bg-shade-30/50"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom controls */}
        <div className="border-t border-hairline-light pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-shade-50">{t.common.language}</span>
            <LanguageSwitcher />
          </div>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                closeMobileNav();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{t.common.logout}</span>
            </button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
