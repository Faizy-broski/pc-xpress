import { BuildAPcClient } from "@/components/build-a-pc/build-a-pc-client";
import { listCategories } from "@/lib/data/build-a-pc";
import { listPublishedReviews } from "@/lib/data/reviews";

export const dynamic = "force-dynamic";

export default async function BuildAPcPage() {
  const [categories, reviews] = await Promise.all([
    listCategories(),
    listPublishedReviews("Custom Build"),
  ]);

  return <BuildAPcClient categories={categories} reviews={reviews} />;
}
