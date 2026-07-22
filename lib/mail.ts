import nodemailer from "nodemailer";

export interface BookingSummaryLine {
  label: string;
  value: string;
}

export interface BookingEmailInput {
  kind: "repair" | "build";
  name: string;
  email: string;
  phone: string;
  notes?: string;
  summary: BookingSummaryLine[];
  totalText?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT ?? 587);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendBookingEmail(input: BookingEmailInput) {
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL ?? process.env.SMTP_USER;
  if (!adminEmail) {
    throw new Error("No admin recipient configured (set BOOKING_ADMIN_EMAIL).");
  }

  const heading = input.kind === "repair" ? "New Repair Booking" : "New Custom PC Build Order";
  const detailsHeading = input.kind === "repair" ? "Repair Details" : "Build Details";

  const detailRows = input.summary
    .map(
      (line) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;">${escapeHtml(line.label)}</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(line.value)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#111;">
      <h2 style="margin:0 0 12px;">${heading}</h2>
      <table style="border-collapse:collapse;margin-bottom:16px;">
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Name</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(input.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(input.email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666;">Phone</td><td style="padding:4px 0;font-weight:600;">${escapeHtml(input.phone)}</td></tr>
      </table>
      <h3 style="margin:0 0 8px;">${detailsHeading}</h3>
      <table style="border-collapse:collapse;margin-bottom:16px;">
        ${detailRows}
        ${
          input.totalText
            ? `<tr><td style="padding:8px 12px 4px 0;color:#666;border-top:1px solid #ddd;">Total</td><td style="padding:8px 0 4px;font-weight:700;border-top:1px solid #ddd;">${escapeHtml(input.totalText)}</td></tr>`
            : ""
        }
      </table>
      ${
        input.notes
          ? `<h3 style="margin:0 0 8px;">Notes</h3><p style="white-space:pre-wrap;margin:0 0 16px;">${escapeHtml(input.notes)}</p>`
          : ""
      }
      <p style="color:#888;font-size:12px;">Submitted via the PC Xpress website booking form.</p>
    </div>
  `;

  const text = [
    `${heading}`,
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    "",
    `${detailsHeading}:`,
    ...input.summary.map((line) => `- ${line.label}: ${line.value}`),
    input.totalText ? `Total: ${input.totalText}` : "",
    input.notes ? `\nNotes:\n${input.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: adminEmail,
    replyTo: input.email,
    subject: input.kind === "repair" ? `New Repair Booking — ${input.name}` : `New Custom PC Build Order — ${input.name}`,
    text,
    html,
  });
}
