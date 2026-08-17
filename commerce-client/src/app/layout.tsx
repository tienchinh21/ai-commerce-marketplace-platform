import type { Metadata } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { OrganizationJsonLd } from "@/components/common/SeoHead";

export const metadata: Metadata = {
  title: {
    default: "OKZ Commerce - Nền Tảng Mua Sắm Cao Cấp & Trí Tuệ Nhân Tạo",
    template: "%s | OKZ Commerce",
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: "OKZ Commerce - Nền Tảng Mua Sắm Cao Cấp",
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "OKZ Commerce Marketplace",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OKZ Commerce",
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen bg-canvas-light text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
