import { Product } from "@/types/product";
import { SITE_CONFIG } from "@/lib/constants";

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    description: SITE_CONFIG.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_CONFIG.hotline,
      contactType: "customer service",
      availableLanguage: ["Vietnamese", "English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({ product, lang = "vi" }: { product: Product; lang?: string }) {
  const isVi = lang === "vi";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: isVi ? product.title : product.titleEn,
    image: product.images,
    description: isVi ? product.shortDescription : product.shortDescriptionEn,
    sku: product.variants[0]?.sku || product.id,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}/${lang}/san-pham/${product.slug}`,
      priceCurrency: isVi ? "VND" : "USD",
      price: isVi ? product.price : Math.round(product.price / 25000),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
