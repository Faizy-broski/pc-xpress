"use client"

import * as React from "react"

import {
  REPAIR_JOBS,
  type RepairJob,
  CUSTOM_BUILD_ORDERS,
  type CustomBuildOrder,
  type PrebuiltOrder,
} from "@/components/dashboard/data"
import {
  type DeviceType,
  type Brand,
  type Fault,
  type DeviceTypeId,
} from "@/components/repair/data"
import { type Category, type CategoryId, type PartOption } from "@/components/build-a-pc/data"
import { type PrebuiltProduct } from "@/components/prebuilt/data"
import { type Review, type ReviewStatus } from "@/lib/data/reviews"

interface DashboardStoreValue {
  repairJobs: RepairJob[]
  updateRepairJob: (id: string, patch: Partial<RepairJob>) => void
  removeRepairJob: (id: string) => void

  deviceTypes: DeviceType[]
  addDeviceType: (deviceType: DeviceType) => Promise<void>
  updateDeviceType: (id: DeviceTypeId, patch: Partial<DeviceType>) => Promise<void>
  removeDeviceType: (id: DeviceTypeId) => Promise<void>

  brands: Record<DeviceTypeId, Brand[]>
  addBrand: (deviceId: DeviceTypeId, brand: Brand) => Promise<void>
  updateBrand: (deviceId: DeviceTypeId, brandId: string, patch: Partial<Brand>) => Promise<void>
  removeBrand: (deviceId: DeviceTypeId, brandId: string) => Promise<void>

  faults: Record<DeviceTypeId, Fault[]>
  addFault: (deviceId: DeviceTypeId, fault: Fault) => Promise<void>
  updateFault: (deviceId: DeviceTypeId, faultId: string, patch: Partial<Fault>) => Promise<void>
  removeFault: (deviceId: DeviceTypeId, faultId: string) => Promise<void>

  prebuiltProducts: PrebuiltProduct[]
  addPrebuiltProduct: (product: PrebuiltProduct) => Promise<void>
  updatePrebuiltProduct: (slug: string, patch: Partial<PrebuiltProduct>) => Promise<void>
  removePrebuiltProduct: (slug: string) => Promise<void>

  prebuiltOrders: PrebuiltOrder[]
  updatePrebuiltOrder: (id: string, patch: Partial<PrebuiltOrder>) => Promise<void>
  removePrebuiltOrder: (id: string) => Promise<void>

  categories: Category[]
  addPart: (categoryId: CategoryId, part: PartOption) => Promise<void>
  updatePart: (categoryId: CategoryId, partId: string, patch: Partial<PartOption>) => Promise<void>
  removePart: (categoryId: CategoryId, partId: string) => Promise<void>

  customBuildOrders: CustomBuildOrder[]
  updateCustomBuildOrder: (id: string, patch: Partial<CustomBuildOrder>) => void
  removeCustomBuildOrder: (id: string) => void

  reviews: Review[]
  updateReviewStatus: (id: string, status: ReviewStatus) => Promise<void>
  removeReview: (id: string) => Promise<void>
}

const DashboardStoreContext = React.createContext<DashboardStoreValue | null>(null)

interface DashboardStoreProviderProps {
  children: React.ReactNode
  /** Catalog data fetched server-side from Supabase (see app/dashboard/layout.tsx). */
  initialDeviceTypes: DeviceType[]
  initialBrands: Record<DeviceTypeId, Brand[]>
  initialFaults: Record<DeviceTypeId, Fault[]>
  initialCategories: Category[]
  initialPrebuiltProducts: PrebuiltProduct[]
  initialPrebuiltOrders: PrebuiltOrder[]
  initialReviews: Review[]
}

async function requestJson<T>(url: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error ?? `Request to ${url} failed.`)
  }
  return payload
}

export function DashboardStoreProvider({
  children,
  initialDeviceTypes,
  initialBrands,
  initialFaults,
  initialCategories,
  initialPrebuiltProducts,
  initialPrebuiltOrders,
  initialReviews,
}: DashboardStoreProviderProps) {
  const [repairJobs, setRepairJobs] = React.useState<RepairJob[]>(REPAIR_JOBS)
  const [deviceTypes, setDeviceTypes] = React.useState<DeviceType[]>(initialDeviceTypes)
  const [brands, setBrands] = React.useState<Record<DeviceTypeId, Brand[]>>(initialBrands)
  const [faults, setFaults] = React.useState<Record<DeviceTypeId, Fault[]>>(initialFaults)
  const [prebuiltProducts, setPrebuiltProducts] = React.useState<PrebuiltProduct[]>(initialPrebuiltProducts)
  const [prebuiltOrders, setPrebuiltOrders] = React.useState<PrebuiltOrder[]>(initialPrebuiltOrders)
  const [categories, setCategories] = React.useState<Category[]>(initialCategories)
  const [customBuildOrders, setCustomBuildOrders] = React.useState<CustomBuildOrder[]>(CUSTOM_BUILD_ORDERS)
  const [reviews, setReviews] = React.useState<Review[]>(initialReviews)

  const addDeviceType = React.useCallback(async (deviceType: DeviceType) => {
    const { deviceType: created } = await requestJson<{ deviceType: DeviceType }>(
      "/api/device-types",
      "POST",
      deviceType
    )
    setDeviceTypes((prev) => [...prev, created])
    setBrands((prev) => ({ ...prev, [created.id]: [] }))
    setFaults((prev) => ({ ...prev, [created.id]: [] }))
  }, [])

  const updateDeviceType = React.useCallback(
    async (id: DeviceTypeId, patch: Partial<DeviceType>) => {
      const { deviceType: updated } = await requestJson<{ deviceType: DeviceType }>(
        `/api/device-types/${id}`,
        "PATCH",
        patch
      )
      setDeviceTypes((prev) => prev.map((d) => (d.id === id ? updated : d)))
    },
    []
  )

  const removeDeviceType = React.useCallback(async (id: DeviceTypeId) => {
    await requestJson(`/api/device-types/${id}`, "DELETE")
    setDeviceTypes((prev) => prev.filter((d) => d.id !== id))
    setBrands((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setFaults((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const addBrand = React.useCallback(async (deviceId: DeviceTypeId, brand: Brand) => {
    const { brand: created } = await requestJson<{ brand: Brand }>(
      `/api/device-types/${deviceId}/brands`,
      "POST",
      brand
    )
    setBrands((prev) => ({ ...prev, [deviceId]: [...(prev[deviceId] ?? []), created] }))
  }, [])

  const updateBrand = React.useCallback(
    async (deviceId: DeviceTypeId, brandId: string, patch: Partial<Brand>) => {
      const { brand: updated } = await requestJson<{ brand: Brand }>(
        `/api/device-types/${deviceId}/brands/${brandId}`,
        "PATCH",
        patch
      )
      setBrands((prev) => ({
        ...prev,
        [deviceId]: (prev[deviceId] ?? []).map((b) => (b.id === brandId ? updated : b)),
      }))
    },
    []
  )

  const removeBrand = React.useCallback(async (deviceId: DeviceTypeId, brandId: string) => {
    await requestJson(`/api/device-types/${deviceId}/brands/${brandId}`, "DELETE")
    setBrands((prev) => ({
      ...prev,
      [deviceId]: (prev[deviceId] ?? []).filter((b) => b.id !== brandId),
    }))
  }, [])

  const addFault = React.useCallback(async (deviceId: DeviceTypeId, fault: Fault) => {
    const { fault: created } = await requestJson<{ fault: Fault }>(
      `/api/device-types/${deviceId}/faults`,
      "POST",
      fault
    )
    setFaults((prev) => ({ ...prev, [deviceId]: [created, ...(prev[deviceId] ?? [])] }))
  }, [])

  const updateFault = React.useCallback(
    async (deviceId: DeviceTypeId, faultId: string, patch: Partial<Fault>) => {
      const { fault: updated } = await requestJson<{ fault: Fault }>(
        `/api/device-types/${deviceId}/faults/${faultId}`,
        "PATCH",
        patch
      )
      setFaults((prev) => ({
        ...prev,
        [deviceId]: (prev[deviceId] ?? []).map((f) => (f.id === faultId ? updated : f)),
      }))
    },
    []
  )

  const removeFault = React.useCallback(async (deviceId: DeviceTypeId, faultId: string) => {
    await requestJson(`/api/device-types/${deviceId}/faults/${faultId}`, "DELETE")
    setFaults((prev) => ({
      ...prev,
      [deviceId]: (prev[deviceId] ?? []).filter((f) => f.id !== faultId),
    }))
  }, [])

  const addPrebuiltProduct = React.useCallback(async (product: PrebuiltProduct) => {
    const { product: created } = await requestJson<{ product: PrebuiltProduct }>(
      "/api/prebuilt-products",
      "POST",
      product
    )
    setPrebuiltProducts((prev) => [created, ...prev])
  }, [])

  const updatePrebuiltProduct = React.useCallback(
    async (slug: string, patch: Partial<PrebuiltProduct>) => {
      const { product: updated } = await requestJson<{ product: PrebuiltProduct }>(
        `/api/prebuilt-products/${slug}`,
        "PATCH",
        patch
      )
      setPrebuiltProducts((prev) => prev.map((p) => (p.slug === slug ? updated : p)))
    },
    []
  )

  const removePrebuiltProduct = React.useCallback(async (slug: string) => {
    await requestJson(`/api/prebuilt-products/${slug}`, "DELETE")
    setPrebuiltProducts((prev) => prev.filter((p) => p.slug !== slug))
  }, [])

  const addPart = React.useCallback(async (categoryId: CategoryId, part: PartOption) => {
    const { part: created } = await requestJson<{ part: PartOption }>(
      `/api/categories/${categoryId}/parts`,
      "POST",
      part
    )
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, options: [created, ...c.options] } : c))
    )
  }, [])

  const updatePart = React.useCallback(
    async (categoryId: CategoryId, partId: string, patch: Partial<PartOption>) => {
      const { part: updated } = await requestJson<{ part: PartOption }>(
        `/api/categories/${categoryId}/parts/${partId}`,
        "PATCH",
        patch
      )
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, options: c.options.map((o) => (o.id === partId ? updated : o)) }
            : c
        )
      )
    },
    []
  )

  const removePart = React.useCallback(async (categoryId: CategoryId, partId: string) => {
    await requestJson(`/api/categories/${categoryId}/parts/${partId}`, "DELETE")
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, options: c.options.filter((o) => o.id !== partId) } : c
      )
    )
  }, [])

  const updateRepairJob = React.useCallback((id: string, patch: Partial<RepairJob>) => {
    setRepairJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...patch } : job)))
  }, [])

  const removeRepairJob = React.useCallback((id: string) => {
    setRepairJobs((prev) => prev.filter((job) => job.id !== id))
  }, [])

  const updateCustomBuildOrder = React.useCallback((id: string, patch: Partial<CustomBuildOrder>) => {
    setCustomBuildOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...patch } : order)))
  }, [])

  const removeCustomBuildOrder = React.useCallback((id: string) => {
    setCustomBuildOrders((prev) => prev.filter((order) => order.id !== id))
  }, [])

  const updatePrebuiltOrder = React.useCallback(async (id: string, patch: Partial<PrebuiltOrder>) => {
    // Order ids contain "#" (e.g. "#PB-A1B2C3"), which must be encoded or the
    // browser treats it as a URL fragment and never sends it to the server.
    const { order: updated } = await requestJson<{ order: PrebuiltOrder }>(
      `/api/orders/${encodeURIComponent(id)}`,
      "PATCH",
      patch
    )
    setPrebuiltOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...updated } : order)))
  }, [])

  const removePrebuiltOrder = React.useCallback(async (id: string) => {
    await requestJson(`/api/orders/${encodeURIComponent(id)}`, "DELETE")
    setPrebuiltOrders((prev) => prev.filter((order) => order.id !== id))
  }, [])

  const updateReviewStatus = React.useCallback(async (id: string, status: ReviewStatus) => {
    const { review: updated } = await requestJson<{ review: Review }>(
      `/api/reviews/${id}`,
      "PATCH",
      { status }
    )
    setReviews((prev) => prev.map((review) => (review.id === id ? updated : review)))
  }, [])

  const removeReview = React.useCallback(async (id: string) => {
    await requestJson(`/api/reviews/${id}`, "DELETE")
    setReviews((prev) => prev.filter((review) => review.id !== id))
  }, [])

  const value = React.useMemo<DashboardStoreValue>(
    () => ({
      repairJobs,
      updateRepairJob,
      removeRepairJob,
      deviceTypes,
      addDeviceType,
      updateDeviceType,
      removeDeviceType,
      brands,
      addBrand,
      updateBrand,
      removeBrand,
      faults,
      addFault,
      updateFault,
      removeFault,
      prebuiltProducts,
      addPrebuiltProduct,
      updatePrebuiltProduct,
      removePrebuiltProduct,
      prebuiltOrders,
      updatePrebuiltOrder,
      removePrebuiltOrder,
      categories,
      addPart,
      updatePart,
      removePart,
      customBuildOrders,
      updateCustomBuildOrder,
      removeCustomBuildOrder,
      reviews,
      updateReviewStatus,
      removeReview,
    }),
    [
      repairJobs,
      updateRepairJob,
      removeRepairJob,
      deviceTypes,
      addDeviceType,
      updateDeviceType,
      removeDeviceType,
      brands,
      addBrand,
      updateBrand,
      removeBrand,
      faults,
      addFault,
      updateFault,
      removeFault,
      prebuiltProducts,
      addPrebuiltProduct,
      updatePrebuiltProduct,
      removePrebuiltProduct,
      prebuiltOrders,
      updatePrebuiltOrder,
      removePrebuiltOrder,
      categories,
      addPart,
      updatePart,
      removePart,
      customBuildOrders,
      updateCustomBuildOrder,
      removeCustomBuildOrder,
      reviews,
      updateReviewStatus,
      removeReview,
    ]
  )

  return <DashboardStoreContext.Provider value={value}>{children}</DashboardStoreContext.Provider>
}

function useDashboardStore() {
  const context = React.useContext(DashboardStoreContext)
  if (!context) {
    throw new Error("useDashboardStore must be used within a DashboardStoreProvider.")
  }
  return context
}

export function useRepairJobs() {
  return useDashboardStore().repairJobs
}

export function useRepairJobActions() {
  const { updateRepairJob, removeRepairJob } = useDashboardStore()
  return { updateRepairJob, removeRepairJob }
}

export function useDeviceTypeCatalog() {
  const { deviceTypes, addDeviceType, updateDeviceType, removeDeviceType, brands, addBrand, updateBrand, removeBrand } =
    useDashboardStore()
  return { deviceTypes, addDeviceType, updateDeviceType, removeDeviceType, brands, addBrand, updateBrand, removeBrand }
}

export function useFaultsCatalog() {
  const { faults, addFault, updateFault, removeFault } = useDashboardStore()
  return { faults, addFault, updateFault, removeFault }
}

export function usePrebuiltCatalog() {
  const { prebuiltProducts, addPrebuiltProduct, updatePrebuiltProduct, removePrebuiltProduct } = useDashboardStore()
  return { products: prebuiltProducts, addPrebuiltProduct, updatePrebuiltProduct, removePrebuiltProduct }
}

export function usePrebuiltOrders() {
  return useDashboardStore().prebuiltOrders
}

export function usePrebuiltOrderActions() {
  const { updatePrebuiltOrder, removePrebuiltOrder } = useDashboardStore()
  return { updatePrebuiltOrder, removePrebuiltOrder }
}

export function usePartCatalog() {
  const { categories, addPart, updatePart, removePart } = useDashboardStore()
  return { categories, addPart, updatePart, removePart }
}

export function useCustomBuildOrders() {
  return useDashboardStore().customBuildOrders
}

export function useCustomBuildOrderActions() {
  const { updateCustomBuildOrder, removeCustomBuildOrder } = useDashboardStore()
  return { updateCustomBuildOrder, removeCustomBuildOrder }
}

export function useReviews() {
  return useDashboardStore().reviews
}

export function useReviewActions() {
  const { updateReviewStatus, removeReview } = useDashboardStore()
  return { updateReviewStatus, removeReview }
}
