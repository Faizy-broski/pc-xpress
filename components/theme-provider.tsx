"use client"

import * as React from "react"

export type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "dashboard-theme"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function isDarkFor(theme: Theme) {
  return (
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  )
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", isDarkFor(theme))
}

/**
 * Scoped to the admin dashboard only: mounted from app/dashboard/layout.tsx,
 * not the root layout. It still flips the `dark` class on <html> (so portaled
 * menus/dialogs, which attach to document.body, inherit it correctly), but
 * only while a dashboard route is mounted — unmounting (navigating back to
 * the marketing site) clears the class so the public site is never affected.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "system"
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system"
  })

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }, [])

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  React.useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  React.useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = () => applyTheme("system")
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [theme])

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var isDark=t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(isDark)document.documentElement.classList.add("dark")}catch(e){}})()`
