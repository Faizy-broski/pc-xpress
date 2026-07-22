import { NextResponse } from "next/server";

import { sendBookingEmail, type BookingSummaryLine } from "@/lib/mail";

interface BookingRequestBody {
  kind: "repair" | "build";
  name: string;
  email: string;
  phone: string;
  notes?: string;
  summary: BookingSummaryLine[];
  totalText?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Partial<BookingRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const kind = body.kind;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : undefined;
  const summary = Array.isArray(body.summary) ? body.summary : [];
  const totalText = typeof body.totalText === "string" ? body.totalText.trim() : undefined;

  if (kind !== "repair" && kind !== "build") {
    return NextResponse.json({ error: "Invalid booking type." }, { status: 400 });
  }
  if (!name || !phone || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid name, email, and phone number." },
      { status: 400 }
    );
  }
  if (summary.length === 0 || summary.some((line) => !line?.label || !line?.value)) {
    return NextResponse.json({ error: "Booking details are incomplete." }, { status: 400 });
  }

  try {
    await sendBookingEmail({ kind, name, email, phone, notes, summary, totalText });
  } catch (error) {
    console.error("Failed to send booking email", error);
    return NextResponse.json(
      { error: "Could not send your booking right now. Please try again or call us." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
