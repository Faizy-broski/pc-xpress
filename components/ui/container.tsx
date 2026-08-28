import type { ComponentProps, ElementType } from "react"

import { cn } from "@/lib/utils"

type ContainerProps<T extends ElementType> = ComponentProps<T> & {
  as?: T
}

/**
 * Global page container. Caps content at max-w-screen-2xl and applies a
 * consistent, fully responsive gutter across every breakpoint (xs -> 2xl).
 */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Comp = as ?? "div"
  return (
    <Comp
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12",
        className
      )}
      {...props}
    />
  )
}
