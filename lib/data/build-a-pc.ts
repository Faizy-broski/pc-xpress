import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { IconName } from "@/components/icons/icon-registry"
import { CATEGORIES, type Category, type CategoryId, type PartOption } from "@/components/build-a-pc/data"

interface CategoryRow {
  id: string
  label: string
  icon: string
  description: string
  sort_order: number
}

interface PartRow {
  id: string
  category_id: string
  name: string
  price: number
  specs: string[]
  in_stock: boolean
  badge: string | null
  socket: string | null
}

function partFromRow(row: PartRow): PartOption {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    specs: row.specs ?? [],
    inStock: row.in_stock,
    badge: row.badge ?? undefined,
    socket: row.socket ?? undefined,
  }
}

function partToRow(categoryId: CategoryId, part: PartOption): PartRow {
  return {
    id: part.id,
    category_id: categoryId,
    name: part.name,
    price: part.price,
    specs: part.specs,
    in_stock: part.inStock,
    badge: part.badge ?? null,
    socket: part.socket ?? null,
  }
}

/**
 * Falls back to the bundled static catalog if Supabase isn't reachable yet
 * (schema not applied, table not seeded, env vars missing). This lets the
 * site keep working today and switch over transparently once
 * supabase/schema.sql has been run and /api/admin/seed has been called.
 */
export async function listCategories(): Promise<Category[]> {
  try {
    const supabase = await createSupabaseServerClient()

    const [{ data: categoryRows, error: categoryError }, { data: partRows, error: partError }] =
      await Promise.all([
        supabase.from("categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("parts").select("*").order("created_at", { ascending: false }),
      ])

    if (categoryError) throw new Error(categoryError.message)
    if (partError) throw new Error(partError.message)

    const partsByCategory = new Map<string, PartOption[]>()
    for (const row of partRows as PartRow[]) {
      const list = partsByCategory.get(row.category_id) ?? []
      list.push(partFromRow(row))
      partsByCategory.set(row.category_id, list)
    }

    return (categoryRows as CategoryRow[]).map((row) => ({
      id: row.id,
      label: row.label,
      icon: row.icon as IconName,
      description: row.description,
      options: partsByCategory.get(row.id) ?? [],
    }))
  } catch (error) {
    console.warn("Falling back to static build-a-pc catalog:", error)
    return CATEGORIES
  }
}

export async function getPart(categoryId: CategoryId, partId: string): Promise<PartOption | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .eq("category_id", categoryId)
    .eq("id", partId)
    .maybeSingle()

  if (error) throw new Error(`Failed to load part: ${error.message}`)
  return data ? partFromRow(data as PartRow) : null
}

export async function createPart(categoryId: CategoryId, part: PartOption): Promise<PartOption> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("parts")
    .insert(partToRow(categoryId, part))
    .select("*")
    .single()

  if (error) throw new Error(`Failed to create part: ${error.message}`)
  return partFromRow(data as PartRow)
}

export async function updatePart(
  categoryId: CategoryId,
  partId: string,
  part: PartOption
): Promise<PartOption> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("parts")
    .update(partToRow(categoryId, part))
    .eq("category_id", categoryId)
    .eq("id", partId)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update part: ${error.message}`)
  return partFromRow(data as PartRow)
}

export async function deletePart(categoryId: CategoryId, partId: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("parts")
    .delete()
    .eq("category_id", categoryId)
    .eq("id", partId)

  if (error) throw new Error(`Failed to delete part: ${error.message}`)
}
