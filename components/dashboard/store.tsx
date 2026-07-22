"use client"

import * as React from "react"

import {
  REPAIR_JOBS,
  type RepairJob,
  CUSTOM_BUILD_ORDERS,
  type CustomBuildOrder,
  PREBUILT_ORDERS,
  type PrebuiltOrder,
} from "@/components/dashboard/data"
import {
  DEVICE_TYPES,
  BRANDS,
  FAULTS,
  type DeviceType,
  type Brand,
  type Fault,
  type DeviceTypeId,
} from "@/components/repair/data"
import { CATEGORIES, type Category, type CategoryId, type PartOption } from "@/components/build-a-pc/data"
import { PREBUILT_PCS, type PrebuiltProduct } from "@/components/prebuilt/data"

interface DashboardStoreValue {
  repairJobs: RepairJob[]

  deviceTypes: DeviceType[]
  addDeviceType: (deviceType: DeviceType) => void

  brands: Record<DeviceTypeId, Brand[]>
  addBrand: (deviceId: DeviceTypeId, brand: Brand) => void

  faults: Record<DeviceTypeId, Fault[]>
  addFault: (deviceId: DeviceTypeId, fault: Fault) => void

  prebuiltProducts: PrebuiltProduct[]
  addPrebuiltProduct: (product: PrebuiltProduct) => void

  prebuiltOrders: PrebuiltOrder[]

  categories: Category[]
  addPart: (categoryId: CategoryId, part: PartOption) => void

  customBuildOrders: CustomBuildOrder[]
}

const DashboardStoreContext = React.createContext<DashboardStoreValue | null>(null)

export function DashboardStoreProvider({ children }: { children: React.ReactNode }) {
  const [repairJobs] = React.useState<RepairJob[]>(REPAIR_JOBS)
  const [deviceTypes, setDeviceTypes] = React.useState<DeviceType[]>(() => [...DEVICE_TYPES])
  const [brands, setBrands] = React.useState<Record<DeviceTypeId, Brand[]>>(() => ({ ...BRANDS }))
  const [faults, setFaults] = React.useState<Record<DeviceTypeId, Fault[]>>(() => ({ ...FAULTS }))
  const [prebuiltProducts, setPrebuiltProducts] = React.useState<PrebuiltProduct[]>(PREBUILT_PCS)
  const [prebuiltOrders] = React.useState<PrebuiltOrder[]>(PREBUILT_ORDERS)
  const [categories, setCategories] = React.useState<Category[]>(() =>
    CATEGORIES.map((c) => ({ ...c, options: [...c.options] }))
  )
  const [customBuildOrders] = React.useState<CustomBuildOrder[]>(CUSTOM_BUILD_ORDERS)

  const addDeviceType = React.useCallback((deviceType: DeviceType) => {
    setDeviceTypes((prev) => [...prev, deviceType])
    setBrands((prev) => ({ ...prev, [deviceType.id]: [] }))
    setFaults((prev) => ({ ...prev, [deviceType.id]: [] }))
  }, [])

  const addBrand = React.useCallback((deviceId: DeviceTypeId, brand: Brand) => {
    setBrands((prev) => ({ ...prev, [deviceId]: [...(prev[deviceId] ?? []), brand] }))
  }, [])

  const addFault = React.useCallback((deviceId: DeviceTypeId, fault: Fault) => {
    setFaults((prev) => ({ ...prev, [deviceId]: [fault, ...prev[deviceId]] }))
  }, [])

  const addPrebuiltProduct = React.useCallback((product: PrebuiltProduct) => {
    setPrebuiltProducts((prev) => [product, ...prev])
  }, [])

  const addPart = React.useCallback((categoryId: CategoryId, part: PartOption) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, options: [part, ...c.options] } : c))
    )
  }, [])

  const value = React.useMemo<DashboardStoreValue>(
    () => ({
      repairJobs,
      deviceTypes,
      addDeviceType,
      brands,
      addBrand,
      faults,
      addFault,
      prebuiltProducts,
      addPrebuiltProduct,
      prebuiltOrders,
      categories,
      addPart,
      customBuildOrders,
    }),
    [
      repairJobs,
      deviceTypes,
      addDeviceType,
      brands,
      addBrand,
      faults,
      addFault,
      prebuiltProducts,
      addPrebuiltProduct,
      prebuiltOrders,
      categories,
      addPart,
      customBuildOrders,
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

export function useDeviceTypeCatalog() {
  const { deviceTypes, addDeviceType, brands, addBrand } = useDashboardStore()
  return { deviceTypes, addDeviceType, brands, addBrand }
}

export function useFaultsCatalog() {
  const { faults, addFault } = useDashboardStore()
  return { faults, addFault }
}

export function usePrebuiltCatalog() {
  const { prebuiltProducts, addPrebuiltProduct } = useDashboardStore()
  return { products: prebuiltProducts, addPrebuiltProduct }
}

export function usePrebuiltOrders() {
  return useDashboardStore().prebuiltOrders
}

export function usePartCatalog() {
  const { categories, addPart } = useDashboardStore()
  return { categories, addPart }
}

export function useCustomBuildOrders() {
  return useDashboardStore().customBuildOrders
}
