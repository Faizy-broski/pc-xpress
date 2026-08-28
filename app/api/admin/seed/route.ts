import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"
import { PREBUILT_PCS } from "@/components/prebuilt/data"
import { CATEGORIES } from "@/components/build-a-pc/data"
import { DEVICE_TYPES, BRANDS, FAULTS } from "@/components/repair/data"

/**
 * One-time (idempotent) seed of the existing static catalog data into
 * Supabase, so the tables aren't empty the first time the site switches
 * over to reading from the database. Safe to re-run — every insert is an
 * upsert keyed on each table's primary key.
 *
 * Run once after applying supabase/schema.sql:
 *   curl -X POST http://localhost:3000/api/admin/seed
 */
export async function POST() {
  const supabase = await createSupabaseServerClient()

  try {
    const { error: prebuiltError } = await supabase.from("prebuilt_products").upsert(
      PREBUILT_PCS.map((product) => ({
        slug: product.slug,
        sku: product.sku,
        name: product.name,
        category: product.category,
        badge: product.badge ?? null,
        tagline: product.tagline,
        description: product.description,
        images: product.images,
        os: product.os,
        rating: product.rating,
        review_count: product.reviewCount,
        price: product.price,
        was_price: product.wasPrice ?? null,
        dispatch_date: product.dispatchDate,
        in_stock: product.inStock,
        highlights: product.highlights,
        specs: product.specs,
        whats_included: product.whatsIncluded,
      })),
      { onConflict: "slug" }
    )
    if (prebuiltError) throw new Error(`prebuilt_products: ${prebuiltError.message}`)

    const { error: categoriesError } = await supabase.from("categories").upsert(
      CATEGORIES.map((category, index) => ({
        id: category.id,
        label: category.label,
        icon: category.icon,
        description: category.description,
        sort_order: index,
      })),
      { onConflict: "id" }
    )
    if (categoriesError) throw new Error(`categories: ${categoriesError.message}`)

    const partRows = CATEGORIES.flatMap((category) =>
      category.options.map((part) => ({
        id: part.id,
        category_id: category.id,
        name: part.name,
        price: part.price,
        specs: part.specs,
        in_stock: part.inStock,
        badge: part.badge ?? null,
        socket: part.socket ?? null,
      }))
    )
    const { error: partsError } = await supabase
      .from("parts")
      .upsert(partRows, { onConflict: "category_id,id" })
    if (partsError) throw new Error(`parts: ${partsError.message}`)

    const { error: deviceTypesError } = await supabase.from("device_types").upsert(
      DEVICE_TYPES.map((device, index) => ({
        id: device.id,
        label: device.label,
        icon: device.icon,
        description: device.description,
        sort_order: index,
      })),
      { onConflict: "id" }
    )
    if (deviceTypesError) throw new Error(`device_types: ${deviceTypesError.message}`)

    const brandRows = Object.entries(BRANDS).flatMap(([deviceTypeId, brands]) =>
      brands.map((brand, index) => ({
        id: brand.id,
        device_type_id: deviceTypeId,
        label: brand.label,
        sort_order: index,
      }))
    )
    const { error: brandsError } = await supabase
      .from("brands")
      .upsert(brandRows, { onConflict: "device_type_id,id" })
    if (brandsError) throw new Error(`brands: ${brandsError.message}`)

    const faultRows = Object.entries(FAULTS).flatMap(([deviceTypeId, faults]) =>
      faults.map((fault, index) => ({
        id: fault.id,
        device_type_id: deviceTypeId,
        label: fault.label,
        description: fault.description,
        price_from: fault.priceFrom,
        eta_label: fault.etaLabel,
        sort_order: index,
      }))
    )
    const { error: faultsError } = await supabase
      .from("faults")
      .upsert(faultRows, { onConflict: "device_type_id,id" })
    if (faultsError) throw new Error(`faults: ${faultsError.message}`)

    return NextResponse.json({
      ok: true,
      seeded: {
        prebuiltProducts: PREBUILT_PCS.length,
        categories: CATEGORIES.length,
        parts: partRows.length,
        deviceTypes: DEVICE_TYPES.length,
        brands: brandRows.length,
        faults: faultRows.length,
      },
    })
  } catch (error) {
    console.error("Seed failed", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed." },
      { status: 500 }
    )
  }
}
