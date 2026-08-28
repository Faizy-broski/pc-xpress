import { NextResponse } from "next/server"

import {
  createReview,
  listPublishedReviews,
  listReviews,
  type ReviewCategory,
} from "@/lib/data/reviews"

const CATEGORIES: ReviewCategory[] = ["Pre-built PC", "Custom Build", "Repair"]

function isCategory(value: unknown): value is ReviewCategory {
  return typeof value === "string" && (CATEGORIES as string[]).includes(value)
}

// GET without a category returns everything the caller's session can see
// (used by the admin dashboard). GET with a category is the public feed for
// a marketing page — RLS restricts an unauthenticated caller to Published
// rows regardless, so this is safe to expose without checking auth here.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const reference = searchParams.get("reference") ?? undefined

  try {
    if (isCategory(category)) {
      const reviews = await listPublishedReviews(category, reference)
      return NextResponse.json({ reviews })
    }

    const reviews = await listReviews()
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Failed to list reviews", error)
    return NextResponse.json({ error: "Could not load reviews." }, { status: 500 })
  }
}

interface CreateReviewBody {
  category?: string
  reference?: string
  referenceLabel?: string
  customerName?: string
  customerEmail?: string
  rating?: number
  comment?: string
}

export async function POST(request: Request) {
  let body: CreateReviewBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (
    !isCategory(body.category) ||
    !body.customerName?.trim() ||
    !body.customerEmail?.trim() ||
    !body.comment?.trim() ||
    typeof body.rating !== "number" ||
    !Number.isInteger(body.rating) ||
    body.rating < 1 ||
    body.rating > 5
  ) {
    return NextResponse.json(
      { error: "category, customerName, customerEmail, a 1-5 rating, and comment are required." },
      { status: 400 }
    )
  }

  try {
    const review = await createReview({
      category: body.category,
      reference: body.reference?.trim() || undefined,
      referenceLabel: body.referenceLabel?.trim() || undefined,
      customerName: body.customerName.trim(),
      customerEmail: body.customerEmail.trim(),
      rating: body.rating,
      comment: body.comment.trim(),
    })
    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error("Failed to submit review", error)
    return NextResponse.json({ error: "Could not submit the review." }, { status: 500 })
  }
}
