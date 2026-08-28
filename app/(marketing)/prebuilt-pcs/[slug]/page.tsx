import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { FeaturedProducts } from "@/components/marketing/featured-products";
import { ProductDetail } from "@/components/prebuilt/product-detail";
import { toProductCardData } from "@/components/prebuilt/data";
import { getPrebuiltProductBySlug, listPrebuiltProducts } from "@/lib/data/prebuilt";
import { listPublishedReviews } from "@/lib/data/reviews";

interface PageParams {
  params: Promise<{ slug: string }>;
}

// Admin-added products (via the dashboard) must be reachable immediately,
// without a rebuild â€” so this page is fully dynamic rather than statically
// generated from a fixed list of known slugs.
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPrebuiltProductBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.name} | PC Xpress`,
    description: product.tagline,
  };
}

export default async function PrebuiltPcDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const product = await getPrebuiltProductBySlug(slug);

  if (!product) notFound();

  const reviews = await listPublishedReviews("Pre-built PC", product.slug);
  const allProducts = await listPrebuiltProducts();
  const others = allProducts.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.category === product.category);
  const otherCategory = others.filter((p) => p.category !== product.category);
  const related = [...sameCategory, ...otherCategory].slice(0, 4).map(toProductCardData);

  return (
    <div className="pt-28 pb-4 md:pt-40">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/prebuilt-pcs">Prebuilt PCs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Reveal>

        <div className="mt-6">
          <ProductDetail product={product} reviews={reviews} />
        </div>
      </div>

      {related.length > 0 && (
        <FeaturedProducts heading="You Might Also Like" products={related} className="mt-8" />
      )}
    </div>
  );
}
