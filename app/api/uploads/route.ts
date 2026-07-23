import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

const BUCKET = "prebuilt-images"
const MAX_SIZE = 8 * 1024 * 1024 // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]

export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Use JPEG, PNG, WebP, AVIF, or GIF." }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large (max 8MB)." }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg"
  const path = `${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  })

  if (uploadError) {
    console.error("Failed to upload image", uploadError)
    return NextResponse.json({ error: `Could not upload the photo: ${uploadError.message}` }, { status: 500 })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "url is required." }, { status: 400 })
  }

  const marker = `/object/public/${BUCKET}/`
  const markerIndex = url.indexOf(marker)
  if (markerIndex === -1) {
    // Not a file this bucket manages (e.g. a seeded placeholder URL) — nothing to clean up.
    return NextResponse.json({ ok: true })
  }
  const path = decodeURIComponent(url.slice(markerIndex + marker.length))

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) {
    console.error("Failed to delete image", error)
    return NextResponse.json({ error: `Could not delete the photo: ${error.message}` }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
