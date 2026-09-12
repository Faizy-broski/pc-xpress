import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/mail";
import { createLead } from "@/lib/data/leads";

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Partial<ContactRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
  const subject = typeof body.subject === "string" ? body.subject.trim() : undefined;
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json(
      { error: "Please provide a valid name, email, and message." },
      { status: 400 }
    );
  }

  try {
    await sendContactEmail({ name, email, phone, subject, message });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json(
      { error: "Could not send your message right now. Please try again or call us." },
      { status: 502 }
    );
  }

  try {
    await createLead({
      name,
      email,
      phone,
      message: subject ? `${subject}\n\n${message}` : message,
    });
  } catch (error) {
    console.error("Failed to save contact submission as a lead", error);
  }

  return NextResponse.json({ ok: true });
}
