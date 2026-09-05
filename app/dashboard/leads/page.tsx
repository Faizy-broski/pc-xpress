"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusDropdown } from "@/components/dashboard/status-dropdown"
import { RowActions } from "@/components/dashboard/row-actions"
import { RecordModal, type RecordField } from "@/components/dashboard/record-modal"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"
import { useLeads, useLeadActions } from "@/components/dashboard/store"
import type { Lead, LeadStatus } from "@/lib/data/leads"
import type { StatusTone } from "@/components/dashboard/status-badge"

const GRID_COLS = "grid-cols-[1fr_1fr_0.9fr_1.4fr_0.8fr_0.8fr_auto]"

const STATUS_OPTIONS: { value: LeadStatus; tone: StatusTone }[] = [
  { value: "New", tone: "warning" },
  { value: "Contacted", tone: "success" },
  { value: "Closed", tone: "neutral" },
]

const STATUS_TONE: Record<LeadStatus, StatusTone> = {
  New: "warning",
  Contacted: "success",
  Closed: "neutral",
}

function leadFields(lead: Lead): RecordField[] {
  return [
    { key: "id", label: "Lead ID", value: lead.id, editable: false, wide: true },
    { key: "name", label: "Name", value: lead.name, editable: false },
    { key: "email", label: "Email", value: lead.email, editable: false },
    { key: "phone", label: "Phone", value: lead.phone ?? "—", editable: false },
    { key: "message", label: "Message", value: lead.message ?? "—", editable: false, wide: true },
    { key: "date", label: "Submitted", value: lead.date, editable: false },
    {
      key: "status",
      label: "Status",
      value: lead.status,
      type: "select",
      options: STATUS_OPTIONS.map((o) => o.value),
    },
  ]
}

export default function DashboardLeadsPage() {
  const leads = useLeads()
  const { updateLeadStatus, removeLead } = useLeadActions()

  const [search, setSearch] = useState("")
  const [modalLead, setModalLead] = useState<Lead | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase()
    return leads.filter(
      (lead) =>
        query === "" ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.phone ?? "").toLowerCase().includes(query)
    )
  }, [leads, search])

  function handleSave(values: Record<string, string>) {
    if (!modalLead) return
    const status = values.status as LeadStatus
    if (status && status !== modalLead.status) {
      return updateLeadStatus(modalLead.id, status)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submissions from the homepage lead-gen form. No emails are sent — track and follow up
            from here.
          </p>
        </div>
      </Reveal>

      <Reveal viewTrigger={false} delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
          <div className="flex flex-wrap items-center justify-end gap-3 border-b border-border p-4">
            <div className="relative w-full sm:w-60">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or phone"
                className="h-9 rounded-lg pl-8"
              />
            </div>
          </div>

          <div className={cn("hidden gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid", GRID_COLS)}>
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Message</span>
            <span>Status</span>
            <span>Date</span>
            <span></span>
          </div>

          <RevealGroup viewTrigger={false} className="divide-y divide-border">
            {filteredLeads.map((lead) => (
              <RevealItem
                key={lead.id}
                className={cn("flex flex-col gap-2 px-5 py-4 sm:grid sm:items-center sm:gap-4", GRID_COLS)}
              >
                <span className="font-medium text-foreground">{lead.name}</span>
                <span className="text-sm text-muted-foreground">{lead.email}</span>
                <span className="text-sm text-muted-foreground">{lead.phone ?? "—"}</span>
                <span className="line-clamp-2 text-sm text-muted-foreground">{lead.message ?? "—"}</span>
                <StatusDropdown
                  value={lead.status}
                  tone={STATUS_TONE[lead.status]}
                  options={STATUS_OPTIONS}
                  onChange={(status) => updateLeadStatus(lead.id, status as LeadStatus)}
                />
                <span className="text-sm text-muted-foreground">{lead.date}</span>
                <RowActions
                  onView={() => {
                    setModalLead(lead)
                    setModalMode("view")
                  }}
                  onEdit={() => {
                    setModalLead(lead)
                    setModalMode("edit")
                  }}
                  onDelete={() => setDeleteTarget(lead)}
                />
              </RevealItem>
            ))}
          </RevealGroup>

          {filteredLeads.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No leads match your search.
            </p>
          )}
        </div>
      </Reveal>

      <RecordModal
        open={modalLead !== null}
        mode={modalMode}
        title={modalMode === "edit" ? "Edit lead" : "Lead details"}
        subtitle={modalLead ? modalLead.date : undefined}
        fields={modalLead ? leadFields(modalLead) : []}
        onClose={() => setModalLead(null)}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete lead?"
        description={`This will permanently remove ${deleteTarget?.name}'s submission. This can't be undone.`}
        onConfirm={() => (deleteTarget ? removeLead(deleteTarget.id) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
