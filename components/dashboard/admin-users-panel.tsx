"use client"

import { useActionState, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  CrownIcon,
  KeyRoundIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  PlusIcon,
  ShieldIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import {
  addAdminUser,
  listAdminUsers,
  removeAdminUser,
  resetAdminPassword,
  type AdminUserRow,
  type AdminUsersActionState,
} from "@/app/actions/admin-users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"

const EASE = [0.22, 1, 0.36, 1] as const
const emptyState: AdminUsersActionState = {}

function generatePassword() {
  const bytes = new Uint8Array(9)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, "").slice(0, 12)
}

function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose])

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
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-card"
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
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AddAdminModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean
  onClose: () => void
  onAdded: () => void
}) {
  const [state, formAction, pending] = useActionState(addAdminUser, emptyState)
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (open) setPassword("")
  }, [open])

  useEffect(() => {
    if (state.success) onAdded()
  }, [state.success, onAdded])

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Add admin"
      subtitle="Creates a real account with the password below — no email required."
    >
      {state.success ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-foreground">{state.success}</p>
          <Button type="button" size="lg" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form action={formAction} className="mt-4 flex flex-col gap-3.5">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" name="email" placeholder="teammate@example.com" required className="pl-8" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Temporary password</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LockIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                  className="pl-8"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPassword(generatePassword())}
              >
                Generate
              </Button>
            </div>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="mt-2 flex gap-3">
            <Button type="button" variant="outline" size="lg" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={pending} className="flex-1">
              {pending && <Loader2Icon className="animate-spin" />}
              {pending ? "Adding…" : "Add admin"}
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  )
}

function ResetPasswordModal({
  row,
  onClose,
}: {
  row: AdminUserRow | null
  onClose: () => void
}) {
  const [state, formAction, pending] = useActionState(resetAdminPassword, emptyState)
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (row) setPassword("")
  }, [row])

  return (
    <ModalShell open={Boolean(row)} onClose={onClose} title="Reset password" subtitle={row?.email}>
      {state.success ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-sm text-foreground">{state.success}</p>
          <Button type="button" size="lg" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form action={formAction} className="mt-4 flex flex-col gap-3.5">
          <input type="hidden" name="id" value={row?.id ?? ""} />
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">New password</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRoundIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                  className="pl-8"
                />
              </div>
              <Button type="button" variant="outline" onClick={() => setPassword(generatePassword())}>
                Generate
              </Button>
            </div>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="mt-2 flex gap-3">
            <Button type="button" variant="outline" size="lg" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={pending} className="flex-1">
              {pending && <Loader2Icon className="animate-spin" />}
              {pending ? "Saving…" : "Set password"}
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  )
}

function initialsFor(email: string) {
  return email.slice(0, 2).toUpperCase()
}

export function AdminUsersPanel({
  initialUsers,
  currentUserEmail,
}: {
  initialUsers: AdminUserRow[]
  currentUserEmail: string
}) {
  const [users, setUsers] = useState(initialUsers)
  const [addOpen, setAddOpen] = useState(false)
  const [resetRow, setResetRow] = useState<AdminUserRow | null>(null)
  const [removeRow, setRemoveRow] = useState<AdminUserRow | null>(null)

  async function refresh() {
    setUsers(await listAdminUsers())
  }

  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldIcon className="size-4" />
            Admin users
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everyone who can sign in to this dashboard. There's no public sign-up — add
            teammates here instead.
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <PlusIcon />
          Add admin
        </Button>
      </div>

      <div className="mt-5 flex flex-col divide-y divide-border">
        {users.map((row) => (
          <div key={row.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {initialsFor(row.email)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                {row.email}
                {row.email.toLowerCase() === currentUserEmail.toLowerCase() && (
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    You
                  </span>
                )}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                {row.isOwner ? (
                  <>
                    <CrownIcon className="size-3" />
                    Owner — set via ADMIN_EMAILS
                  </>
                ) : (
                  "Team admin"
                )}
              </p>
            </div>
            {!row.isOwner && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Reset password"
                  onClick={() => setResetRow(row)}
                >
                  <KeyRoundIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setRemoveRow(row)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <AddAdminModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={() => {
          void refresh()
        }}
      />
      <ResetPasswordModal row={resetRow} onClose={() => setResetRow(null)} />
      <ConfirmDeleteDialog
        open={Boolean(removeRow)}
        title="Remove admin?"
        description={`${removeRow?.email ?? ""} will immediately lose access to the dashboard.`}
        onClose={() => setRemoveRow(null)}
        onConfirm={async () => {
          if (!removeRow) return
          await removeAdminUser(removeRow.id)
          await refresh()
        }}
      />
    </div>
  )
}
