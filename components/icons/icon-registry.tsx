import {
  Smartphone,
  Tablet,
  Laptop,
  Computer,
  Gamepad2,
  Cpu,
  CircuitBoard,
  Layers,
  HardDrive,
  Zap,
  Box,
  Fan,
  Watch,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Webcam,
  Speaker,
  Server,
  type LucideIcon,
} from "lucide-react"

export const ICON_REGISTRY = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  computer: Computer,
  "gamepad-2": Gamepad2,
  cpu: Cpu,
  "circuit-board": CircuitBoard,
  layers: Layers,
  "hard-drive": HardDrive,
  zap: Zap,
  box: Box,
  fan: Fan,
  watch: Watch,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  headphones: Headphones,
  webcam: Webcam,
  speaker: Speaker,
  server: Server,
} as const satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICON_REGISTRY
export const ICON_NAMES = Object.keys(ICON_REGISTRY) as IconName[]

export function CatalogIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICON_REGISTRY[name]
  return <Icon className={className} />
}
