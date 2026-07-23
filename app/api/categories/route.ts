import { NextResponse } from "next/server"

import { listCategories } from "@/lib/data/build-a-pc"

export async function GET() {
  try {
    const categories = await listCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Failed to list categories", error)
    return NextResponse.json({ error: "Could not load categories." }, { status: 500 })
  }
}
