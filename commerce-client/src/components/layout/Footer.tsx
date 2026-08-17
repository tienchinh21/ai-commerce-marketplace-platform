"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Headphones, RotateCcw } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export function Footer() {
  const { t, isVi, lang } = useTranslation();
  const routes = isVi ? ROUTES.vi : ROUTES.en;

  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  const trustBadges = [
    { icon: ShieldCheck, title: t.home.badgeAuthentic, desc: "Cam kết 100% chính hãng" },
    { icon: Truck, title: t.home.badgeDelivery, desc: "Hỏa tốc nội thành 2h" },
    { icon: RotateCcw, title: t.home.badgeWarranty, desc: "Đổi trả linh hoạt 15 ngày" },
    { icon: Headphones, title: t.home.badgeSupport, desc: "Tư vấn chuyên gia 24/7" },
  ];

  return (
    <footer className="w-full border-t border-hairline-light bg-black text-white">
      {/* Trust Badges Strip */}
      <div className="border-b border-surface-elevated-dark py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated-dark text-aloe-10">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h6 className="text-xs font-semibold text-white">{badge.title}</h6>
                  <p className="text-[11px] text-shade-40">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1-2: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link href={routes.home} className="inline-block">
              <span className="font-display text-2xl font-bold tracking-tighter text-white">
                OKZ<span className="text-aloe-10">.</span>
              </span>
            </Link>
            <p className="text-xs text-shade-40 max-w-sm leading-relaxed">
              {t.footer.tagline}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h6 className="text-xs font-semibold uppercase tracking-wider text-white mb-1.5">
                {t.footer.newsletterTitle}
              </h6>
              <p className="text-[11px] text-shade-40 mb-3">
                {t.footer.newsletterSubtitle}
              </p>
              {subscribed ? (
                <div className="rounded-full bg-aloe-10/20 border border-aloe-10/40 px-4 py-2 text-xs font-medium text-aloe-10 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Cảm ơn bạn đã đăng ký nhận bản tin!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="flex-1 rounded-full border border-surface-elevated-dark bg-canvas-night-elevated px-4 py-2.5 text-xs text-white placeholder:text-shade-50 focus:border-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-aloe-10 px-5 py-2.5 text-xs font-semibold text-black hover:bg-pistachio-10 transition-colors cursor-pointer"
                  >
                    <span>{t.footer.subscribeBtn}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h6 className="text-xs font-semibold uppercase tracking-wider text-white">
              {t.nav.categories}
            </h6>
            <ul className="space-y-2 text-xs text-shade-40">
              <li>
                <Link href={`${routes.products}?category=tech-audio`} className="hover:text-white transition-colors">
                  Công Nghệ & Âm Thanh
                </Link>
              </li>
              <li>
                <Link href={`${routes.products}?category=watches`} className="hover:text-white transition-colors">
                  Đồng Hồ & Trang Sức
                </Link>
              </li>
              <li>
                <Link href={`${routes.products}?category=fashion`} className="hover:text-white transition-colors">
                  Thời Trang Cao Cấp
                </Link>
              </li>
              <li>
                <Link href={`${routes.products}?category=living`} className="hover:text-white transition-colors">
                  Không Gian Sống
                </Link>
              </li>
              <li>
                <Link href={`${routes.products}?category=leather`} className="hover:text-white transition-colors">
                  Phụ Kiện Da
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div className="space-y-3">
            <h6 className="text-xs font-semibold uppercase tracking-wider text-white">
              {t.footer.customerCare}
            </h6>
            <ul className="space-y-2 text-xs text-shade-40">
              <li>
                <Link href={routes.orderHistory} className="hover:text-white transition-colors">
                  {t.footer.trackOrder}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.helpCenter}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.returns}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.contactUs}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Company */}
          <div className="space-y-3">
            <h6 className="text-xs font-semibold uppercase tracking-wider text-white">
              OKZ Platform
            </h6>
            <ul className="space-y-2 text-xs text-shade-40">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.aboutUs}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.careers}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.privacyPolicy}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.footer.termsOfService}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-surface-elevated-dark pt-8 sm:flex-row text-xs text-shade-40">
          <p>{t.footer.copyright}</p>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <span className="text-[11px] text-shade-50">VietQR • Visa • Mastercard • MoMo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
