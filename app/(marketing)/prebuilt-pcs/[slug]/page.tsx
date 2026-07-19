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
import { PREBUILT_PCS, getPrebuiltProduct, toProductCardData } from "@/components/prebuilt/data";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PREBUILT_PCS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = getPrebuiltProduct(slug);

  if (!product) return {};

  return {
    title: `${product.name} | PC Xpress`,
    description: product.tagline,
  };
}

export default async function PrebuiltPcDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const product = getPrebuiltProduct(slug);

  if (!product) notFound();

  const others = PREBUILT_PCS.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.category === product.category);
  const otherCategory = others.filter((p) => p.category !== product.category);
  const related = [...sameCategory, ...otherCategory].slice(0, 4).map(toProductCardData);

  return (
    <div className="pt-28 pb-4 md:pt-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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
          <ProductDetail product={product} />
        </div>
      </div>

      {related.length > 0 && (
        <FeaturedProducts heading="You Might Also Like" products={related} className="mt-8" />
      )}
    </div>
  );
}
