import { NextResponse } from "next/server"

import { deleteReview, updateReviewStatus, type ReviewStatus } from "@/lib/data/reviews"

interface RouteParams {
  params: Promise<{ id: string }>
}

const STATUSES: ReviewStatus[] = ["Pending", "Published", "Rejected"]

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.status || !(STATUSES as string[]).includes(body.status)) {
    return NextResponse.json({ error: "A valid status is required." }, { status: 400 })
  }

  try {
    const review = await updateReviewStatus(id, body.status as ReviewStatus)
    return NextResponse.json({ review })
  } catch (error) {
    console.error("Failed to update review", error)
    return NextResponse.json({ error: "Could not update the review." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params

  try {
    await deleteReview(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete review", error)
    return NextResponse.json({ error: "Could not delete the review." }, { status: 500 })
  }
}
