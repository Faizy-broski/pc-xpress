"use client"

import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal"
import { StatusDropdown } from "@/components/dashboard/status-dropdown"
import { RowActions } from "@/components/dashboard/row-actions"
import { RecordModal, type RecordField } from "@/components/dashboard/record-modal"
import { ConfirmDeleteDialog } from "@/components/dashboard/confirm-delete-dialog"
import { useReviews, useReviewActions } from "@/components/dashboard/store"
import { StarRating } from "@/components/marketing/star-rating"
import type { Review, ReviewCategory, ReviewStatus } from "@/lib/data/reviews"
import type { StatusTone } from "@/components/dashboard/status-badge"

const GRID_COLS = "grid-cols-[1fr_0.9fr_1.4fr_0.7fr_0.8fr_0.8fr_auto]"

const CATEGORY_FILTERS = ["All", "Pre-built PC", "Custom Build", "Repair"] as const

const STATUS_OPTIONS: { value: ReviewStatus; tone: StatusTone }[] = [
  { value: "Pending", tone: "warning" },
  { value: "Published", tone: "success" },
  { value: "Rejected", tone: "danger" },
]

const STATUS_TONE: Record<ReviewStatus, StatusTone> = {
  Pending: "warning",
  Published: "success",
  Rejected: "danger",
}

function reviewFields(review: Review): RecordField[] {
  return [
    { key: "id", label: "Review ID", value: review.id, editable: false, wide: true },
    { key: "customerName", label: "Customer", value: review.customerName, editable: false },
    { key: "customerEmail", label: "Email", value: review.customerEmail, editable: false },
    { key: "category", label: "Category", value: review.category, editable: false },
    { key: "referenceLabel", label: "Item", value: review.referenceLabel ?? "—", editable: false, wide: true },
    { key: "rating", label: "Rating", value: `${review.rating} / 5`, editable: false },
    { key: "date", label: "Date", value: review.date, editable: false },
    { key: "comment", label: "Comment", value: review.comment, editable: false, wide: true },
    {
      key: "status",
      label: "Status",
      value: review.status,
      type: "select",
      options: STATUS_OPTIONS.map((o) => o.value),
    },
  ]
}

export default function DashboardReviewsPage() {
  const reviews = useReviews()
  const { updateReviewStatus, removeReview } = useReviewActions()

  const [filter, setFilter] = useState<(typeof CATEGORY_FILTERS)[number]>("All")
  const [search, setSearch] = useState("")

  const [modalReview, setModalReview] = useState<Review | null>(null)
  const [modalMode, setModalMode] = useState<"view" | "edit">("view")
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase()
    return reviews.filter(
      (review) =>
        (filter === "All" || review.category === (filter as ReviewCategory)) &&
        (query === "" ||
          review.customerName.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          (review.referenceLabel ?? "").toLowerCase().includes(query))
    )
  }, [reviews, filter, search])

  function handleSave(values: Record<string, string>) {
    if (!modalReview) return
    const status = values.status as ReviewStatus
    if (status && status !== modalReview.status) {
      return updateReviewStatus(modalReview.id, status)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Reveal viewTrigger={false}>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customer feedback submitted for Pre-built PCs, Custom Builds, and Repairs. Publish
            the ones you want shown on the public site.
          </p>
        </div>
      </Reveal>

      <Reveal viewTrigger={false} delay={0.05}>
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    filter === f
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-60">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer or comment"
                className="h-9 rounded-lg pl-8"
              />
            </div>
          </div>

          <div className={cn("hidden gap-4 border-b border-border px-5 py-3 text-xs font-medium text-muted-foreground sm:grid", GRID_COLS)}>
            <span>Customer</span>
            <span>Category</span>
            <span>Comment</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Date</span>
            <span></span>
          </div>

          <RevealGroup viewTrigger={false} className="divide-y divide-border">
            {filteredReviews.map((review) => (
              <RevealItem
                key={review.id}
                className={cn("flex flex-col gap-2 px-5 py-4 sm:grid sm:items-center sm:gap-4", GRID_COLS)}
              >
                <div>
                  <p className="font-medium text-foreground">{review.customerName}</p>
                  <p className="text-xs text-muted-foreground">{review.referenceLabel ?? review.category}</p>
                </div>
                <Badge variant="soft" className="w-fit">
                  {review.category}
                </Badge>
                <span className="line-clamp-2 text-sm text-muted-foreground">{review.comment}</span>
                <StarRating value={review.rating} />
                <StatusDropdown
                  value={review.status}
                  tone={STATUS_TONE[review.status]}
                  options={STATUS_OPTIONS}
                  onChange={(status) => updateReviewStatus(review.id, status as ReviewStatus)}
                />
                <span className="text-sm text-muted-foreground">{review.date}</span>
                <RowActions
                  onView={() => {
                    setModalReview(review)
                    setModalMode("view")
                  }}
                  onEdit={() => {
                    setModalReview(review)
                    setModalMode("edit")
                  }}
                  onDelete={() => setDeleteTarget(review)}
                />
              </RevealItem>
            ))}
          </RevealGroup>

          {filteredReviews.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              No reviews match your search.
            </p>
          )}
        </div>
      </Reveal>

      <RecordModal
        open={modalReview !== null}
        mode={modalMode}
        title={modalMode === "edit" ? "Edit review" : "Review details"}
        subtitle={modalReview ? `${modalReview.category} · ${modalReview.date}` : undefined}
        fields={modalReview ? reviewFields(modalReview) : []}
        onClose={() => setModalReview(null)}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        title="Delete review?"
        description={`This will permanently remove ${deleteTarget?.customerName}'s review. This can't be undone.`}
        onConfirm={() => (deleteTarget ? removeReview(deleteTarget.id) : undefined)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
