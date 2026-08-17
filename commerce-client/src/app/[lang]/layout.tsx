import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Providers } from "@/app/providers";
import { LOCALES } from "@/i18n/config";

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <Providers>
      <div className="flex min-h-screen flex-col bg-canvas-light text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileNav />
        <CartDrawer />
      </div>
    </Providers>
  );
}
