"use client"

import { useEffect, useState, type FormEvent } from "react"
import { XIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const EASE = [0.22, 1, 0.36, 1] as const

const selectClass =
  "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

export interface RecordField {
  key: string
  label: string
  value: string
  type?: "text" | "number" | "select"
  options?: string[]
  editable?: boolean
  wide?: boolean
}

interface RecordModalProps {
  open: boolean
  mode: "view" | "edit"
  title: string
  subtitle?: string
  fields: RecordField[]
  onClose: () => void
  onSave?: (values: Record<string, string>) => void | Promise<void>
}

export function RecordModal({
  open,
  mode,
  title,
  subtitle,
  fields,
  onClose,
  onSave,
}: RecordModalProps) {
  const [draft, setDraft] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setDraft(Object.fromEntries(fields.map((field) => [field.key, field.value])))
      setError(null)
    }
    // Re-seed the draft only when the modal opens (or the underlying record
    // changes while open) — not on every keystroke re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fields.map((f) => f.value).join("|")])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSave?.(draft)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md border border-primary p-1 text-primary hover:bg-primary/10"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            {mode === "view" ? (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.key} className={cn(field.wide && "col-span-2")}>
                    <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {field.label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {field.value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3.5">
                {fields.map((field) => (
                  <div key={field.key} className={cn(field.wide && "col-span-2")}>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      {field.label}
                    </label>
                    {field.editable === false ? (
                      <p className="text-sm font-medium text-foreground">{field.value}</p>
                    ) : field.type === "select" ? (
                      <select
                        value={draft[field.key] ?? ""}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))
                        }
                        className={selectClass}
                      >
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        value={draft[field.key] ?? ""}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, [field.key]: event.target.value }))
                        }
                      />
                    )}
                  </div>
                ))}

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="mt-2 flex gap-3">
                  <Button type="button" variant="outline" size="lg" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" disabled={submitting} className="flex-1">
                    {submitting ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
