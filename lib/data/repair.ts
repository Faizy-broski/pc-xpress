import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { IconName } from "@/components/icons/icon-registry"
import {
  BRANDS,
  DEVICE_TYPES,
  FAULTS,
  type Brand,
  type DeviceType,
  type DeviceTypeId,
  type Fault,
} from "@/components/repair/data"

interface DeviceTypeRow {
  id: string
  label: string
  icon: string
  description: string
  sort_order: number
}

interface BrandRow {
  id: string
  device_type_id: string
  label: string
  sort_order: number
}

interface FaultRow {
  id: string
  device_type_id: string
  label: string
  description: string
  price_from: number
  eta_label: string
  sort_order: number
}

/**
 * These three list* functions fall back to the bundled static repair
 * catalog if Supabase isn't reachable yet (schema not applied, tables not
 * seeded, env vars missing). This lets the site keep working today and
 * switch over transparently once supabase/schema.sql has been run and
 * /api/admin/seed has been called.
 */
export async function listDeviceTypes(): Promise<DeviceType[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("device_types")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) throw new Error(error.message)
    return (data as DeviceTypeRow[]).map((row) => ({
      id: row.id,
      label: row.label,
      icon: row.icon as IconName,
      description: row.description,
    }))
  } catch (error) {
    console.warn("Falling back to static device type catalog:", error)
    return DEVICE_TYPES
  }
}

export async function listBrandsByDevice(): Promise<Record<DeviceTypeId, Brand[]>> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) throw new Error(error.message)

    const byDevice: Record<DeviceTypeId, Brand[]> = {}
    for (const row of data as BrandRow[]) {
      const list = byDevice[row.device_type_id] ?? []
      list.push({ id: row.id, label: row.label })
      byDevice[row.device_type_id] = list
    }
    return byDevice
  } catch (error) {
    console.warn("Falling back to static brand catalog:", error)
    return BRANDS
  }
}

export async function listFaultsByDevice(): Promise<Record<DeviceTypeId, Fault[]>> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from("faults")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) throw new Error(error.message)

    const byDevice: Record<DeviceTypeId, Fault[]> = {}
    for (const row of data as FaultRow[]) {
      const list = byDevice[row.device_type_id] ?? []
      list.push({
        id: row.id,
        label: row.label,
        description: row.description,
        priceFrom: row.price_from,
        etaLabel: row.eta_label,
      })
      byDevice[row.device_type_id] = list
    }
    return byDevice
  } catch (error) {
    console.warn("Falling back to static fault catalog:", error)
    return FAULTS
  }
}

export async function getDeviceType(id: DeviceTypeId): Promise<DeviceType | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.from("device_types").select("*").eq("id", id).maybeSingle()

  if (error) throw new Error(`Failed to load device type: ${error.message}`)
  if (!data) return null
  const row = data as DeviceTypeRow
  return { id: row.id, label: row.label, icon: row.icon as IconName, description: row.description }
}

export async function getBrand(deviceTypeId: DeviceTypeId, brandId: string): Promise<Brand | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("device_type_id", deviceTypeId)
    .eq("id", brandId)
    .maybeSingle()

  if (error) throw new Error(`Failed to load brand: ${error.message}`)
  if (!data) return null
  const row = data as BrandRow
  return { id: row.id, label: row.label }
}

export async function getFault(deviceTypeId: DeviceTypeId, faultId: string): Promise<Fault | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("faults")
    .select("*")
    .eq("device_type_id", deviceTypeId)
    .eq("id", faultId)
    .maybeSingle()

  if (error) throw new Error(`Failed to load fault: ${error.message}`)
  if (!data) return null
  const row = data as FaultRow
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    priceFrom: row.price_from,
    etaLabel: row.eta_label,
  }
}

export async function createDeviceType(deviceType: DeviceType): Promise<DeviceType> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("device_types")
    .insert({
      id: deviceType.id,
      label: deviceType.label,
      icon: deviceType.icon,
      description: deviceType.description,
    })
    .select("*")
    .single()

  if (error) throw new Error(`Failed to create device type: ${error.message}`)
  const row = data as DeviceTypeRow
  return { id: row.id, label: row.label, icon: row.icon as IconName, description: row.description }
}

export async function createBrand(deviceTypeId: DeviceTypeId, brand: Brand): Promise<Brand> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("brands")
    .insert({ id: brand.id, device_type_id: deviceTypeId, label: brand.label })
    .select("*")
    .single()

  if (error) throw new Error(`Failed to create brand: ${error.message}`)
  const row = data as BrandRow
  return { id: row.id, label: row.label }
}

export async function createFault(deviceTypeId: DeviceTypeId, fault: Fault): Promise<Fault> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("faults")
    .insert({
      id: fault.id,
      device_type_id: deviceTypeId,
      label: fault.label,
      description: fault.description,
      price_from: fault.priceFrom,
      eta_label: fault.etaLabel,
    })
    .select("*")
    .single()

  if (error) throw new Error(`Failed to create fault: ${error.message}`)
  const row = data as FaultRow
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    priceFrom: row.price_from,
    etaLabel: row.eta_label,
  }
}

export async function updateDeviceType(id: DeviceTypeId, deviceType: DeviceType): Promise<DeviceType> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("device_types")
    .update({
      label: deviceType.label,
      icon: deviceType.icon,
      description: deviceType.description,
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update device type: ${error.message}`)
  const row = data as DeviceTypeRow
  return { id: row.id, label: row.label, icon: row.icon as IconName, description: row.description }
}

export async function deleteDeviceType(id: DeviceTypeId): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("device_types").delete().eq("id", id)
  if (error) throw new Error(`Failed to delete device type: ${error.message}`)
}

export async function updateBrand(deviceTypeId: DeviceTypeId, brandId: string, brand: Brand): Promise<Brand> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("brands")
    .update({ label: brand.label })
    .eq("device_type_id", deviceTypeId)
    .eq("id", brandId)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update brand: ${error.message}`)
  const row = data as BrandRow
  return { id: row.id, label: row.label }
}

export async function deleteBrand(deviceTypeId: DeviceTypeId, brandId: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("brands")
    .delete()
    .eq("device_type_id", deviceTypeId)
    .eq("id", brandId)

  if (error) throw new Error(`Failed to delete brand: ${error.message}`)
}

export async function updateFault(deviceTypeId: DeviceTypeId, faultId: string, fault: Fault): Promise<Fault> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("faults")
    .update({
      label: fault.label,
      description: fault.description,
      price_from: fault.priceFrom,
      eta_label: fault.etaLabel,
    })
    .eq("device_type_id", deviceTypeId)
    .eq("id", faultId)
    .select("*")
    .single()

  if (error) throw new Error(`Failed to update fault: ${error.message}`)
  const row = data as FaultRow
  return {
    id: row.id,
    label: row.label,
    description: row.description,
    priceFrom: row.price_from,
    etaLabel: row.eta_label,
  }
}

export async function deleteFault(deviceTypeId: DeviceTypeId, faultId: string): Promise<void> {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from("faults")
    .delete()
    .eq("device_type_id", deviceTypeId)
    .eq("id", faultId)

  if (error) throw new Error(`Failed to delete fault: ${error.message}`)
}
