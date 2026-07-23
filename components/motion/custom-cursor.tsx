"use client"

import { useEffect, useRef, useState } from "react"

type CursorVariant = "default" | "interactive" | "text" | "disabled"

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label, input[type="checkbox"], input[type="radio"], input[type="submit"], input[type="button"], [data-cursor="pointer"]'
const TEXT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable]:not([contenteditable="false"])'
const DISABLED_SELECTOR = ':disabled, [aria-disabled="true"], [data-disabled="true"]'

/**
 * Brand-themed replacement for the native pointer: a small dot + trailing
 * ring that morph over links/buttons (grows, fills) and text fields
 * (collapses to a caret). Only mounts on fine-pointer (mouse/trackpad)
 * devices — touch devices never see `cursor: none` applied, so nothing
 * changes for them. Position is driven by rAF + lerp for a smooth trail;
 * `prefers-reduced-motion` disables the trailing easing (snaps instantly)
 * but keeps the themed shapes, since they're not motion-heavy on their own.
 */
export function CustomCursor() {
  const dotWrapRef = useRef<HTMLDivElement>(null)
  const ringWrapRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<CursorVariant>("default")
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches
    if (!isFinePointer) return

    setEnabled(true)
    document.documentElement.setAttribute("data-custom-cursor", "true")

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ease = reduceMotion ? 1 : 0.2

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let raf = 0
    let lastVariant: CursorVariant = "default"

    function tick() {
      ringX += (mouseX - ringX) * ease
      ringY += (mouseY - ringY) * ease
      if (dotWrapRef.current) {
        dotWrapRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
      if (ringWrapRef.current) {
        ringWrapRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    function handleMove(event: MouseEvent) {
      mouseX = event.clientX
      mouseY = event.clientY
      setVisible(true)

      const target = event.target as Element | null
      let next: CursorVariant = "default"
      if (target?.closest?.(DISABLED_SELECTOR)) next = "disabled"
      else if (target?.closest?.(TEXT_SELECTOR)) next = "text"
      else if (target?.closest?.(INTERACTIVE_SELECTOR)) next = "interactive"

      if (next !== lastVariant) {
        lastVariant = next
        setVariant(next)
      }
    }

    function handleDown() {
      setPressed(true)
    }
    function handleUp() {
      setPressed(false)
    }
    function handleLeave() {
      setVisible(false)
    }
    function handleEnter() {
      setVisible(true)
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mousedown", handleDown)
    window.addEventListener("mouseup", handleUp)
    document.documentElement.addEventListener("mouseleave", handleLeave)
    document.documentElement.addEventListener("mouseenter", handleEnter)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mousedown", handleDown)
      window.removeEventListener("mouseup", handleUp)
      document.documentElement.removeEventListener("mouseleave", handleLeave)
      document.documentElement.removeEventListener("mouseenter", handleEnter)
      document.documentElement.removeAttribute("data-custom-cursor")
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotWrapRef}
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 2147483647, willChange: "transform" }}
      >
        <div className="cursor-dot" data-variant={variant} data-pressed={pressed} data-visible={visible} />
      </div>
      <div
        ref={ringWrapRef}
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 2147483647, willChange: "transform" }}
      >
        <div className="cursor-ring" data-variant={variant} data-pressed={pressed} data-visible={visible} />
      </div>
    </>
  )
}
