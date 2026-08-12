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
            className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <div className="flex shrink-0 items-start justify-between p-5 pb-0">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ml-3 shrink-0 rounded-md border border-primary p-1 text-primary hover:bg-primary/10"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-5">
              {mode === "view" ? (
                <div className="grid grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.key} className={cn(field.wide && "col-span-2")}>
                      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {field.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-foreground break-words">
                        {field.value || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <form
                  id="record-modal-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3.5"
                >
                  {fields.map((field) => (
                    <div key={field.key} className={cn(field.wide && "col-span-2")}>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        {field.label}
                      </label>
                      {field.editable === false ? (
                        <p className="text-sm font-medium text-foreground break-words">
                          {field.value}
                        </p>
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
                </form>
              )}
            </div>

            {mode === "edit" && (
              <div className="flex shrink-0 gap-3 border-t border-border p-5 pt-3.5">
                <Button type="button" variant="outline" size="lg" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="record-modal-form"
                  size="lg"
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? "Saving…" : "Save changes"}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}