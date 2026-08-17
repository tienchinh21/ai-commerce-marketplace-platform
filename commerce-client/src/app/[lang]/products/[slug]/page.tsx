import { notFound } from "next/navigation";
import { productService } from "@/services/product.service";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.titleEn} | ${product.brand}`,
    description: product.shortDescriptionEn,
    openGraph: {
      title: product.titleEn,
      description: product.shortDescriptionEn,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductDetailEnPage({
  params,
}: {
  params: Promise<{ slug: string; lang: string }>;
}) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await productService.getRelatedProducts(
    product.category.id,
    product.id
  );

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
