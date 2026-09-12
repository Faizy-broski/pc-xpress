import nodemailer from "nodemailer";

export interface BookingSummaryLine {
  label: string;
  value: string;
}

export interface BookingEmailInput {
  kind: "repair" | "build" | "prebuilt";
  name: string;
  email: string;
  phone: string;
  notes?: string;
  summary: BookingSummaryLine[];
  totalText?: string;
}

export interface ContactEmailInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
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

// Brand red used across the site's UI (oklch(0.628 0.25 23.7)); email clients
// need a plain hex since inline styles can't reference CSS custom properties.
const BRAND_RED = "#FC0E34";
const BRAND_RED_DARK = "#1f0a09";
const BORDER = "#e7e2e0";
const MUTED = "#6b6461";
const INK = "#1c1815";

function renderSummaryRows(summary: BookingSummaryLine[]) {
  return summary
    .map(
      (line, index) => `
        <tr>
          <td style="padding:11px 16px;border-top:${index === 0 ? "none" : `1px solid ${BORDER}`};font-size:13px;color:${MUTED};vertical-align:top;">${escapeHtml(line.label)}</td>
          <td style="padding:11px 16px;border-top:${index === 0 ? "none" : `1px solid ${BORDER}`};font-size:13px;font-weight:600;color:${INK};text-align:right;vertical-align:top;">${escapeHtml(line.value)}</td>
        </tr>`
    )
    .join("");
}

function renderInfoRow(label: string, value: string, href?: string) {
  const content = href
    ? `<a href="${href}" style="color:${INK};text-decoration:none;font-weight:600;">${escapeHtml(value)}</a>`
    : `<span style="font-weight:600;color:${INK};">${escapeHtml(value)}</span>`;
  return `
    <tr>
      <td style="padding:6px 0;font-size:13px;color:${MUTED};width:90px;">${label}</td>
      <td style="padding:6px 0;font-size:13px;">${content}</td>
    </tr>`;
}

export async function sendBookingEmail(input: BookingEmailInput) {
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL ?? process.env.SMTP_USER;
  if (!adminEmail) {
    throw new Error("No admin recipient configured (set BOOKING_ADMIN_EMAIL).");
  }

  const heading =
    input.kind === "repair"
      ? "New Repair Booking"
      : input.kind === "build"
        ? "New Custom PC Build Order"
        : "New Pre-built PC Order";
  const eyebrow = input.kind === "repair" ? "Repair Request" : input.kind === "build" ? "Build Order" : "PC Order";
  const detailsHeading =
    input.kind === "repair" ? "Repair Details" : input.kind === "build" ? "Build Details" : "Order Details";
  const tel = input.phone.replace(/[^\d+]/g, "");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f1ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ef;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${BORDER};">

            <!-- Header -->
            <tr>
              <td style="background-color:${BRAND_RED_DARK};background-image:linear-gradient(90deg, ${BRAND_RED_DARK} 0%, ${BRAND_RED} 100%);padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:19px;font-weight:800;letter-spacing:0.02em;color:#ffffff;">
                      PC&nbsp;<span style="color:#ffd9d3;">Xpress</span>
                    </td>
                    <td align="right">
                      <span style="display:inline-block;padding:5px 12px;border-radius:999px;background-color:rgba(255,255,255,0.14);color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
                        ${escapeHtml(eyebrow)}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="padding:28px 32px 4px;">
                <h1 style="margin:0;font-size:21px;line-height:1.3;color:${INK};font-weight:700;">${escapeHtml(heading)}</h1>
                <p style="margin:6px 0 0;font-size:13px;color:${MUTED};">Submitted just now via the PC Xpress website.</p>
              </td>
            </tr>

            <!-- Customer info -->
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f6;border:1px solid ${BORDER};border-radius:10px;padding:16px 18px;">
                  ${renderInfoRow("Name", input.name)}
                  ${renderInfoRow("Email", input.email, `mailto:${input.email}`)}
                  ${renderInfoRow("Phone", input.phone, `tel:${tel}`)}
                </table>
              </td>
            </tr>

            <!-- Details -->
            <tr>
              <td style="padding:24px 32px 0;">
                <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};">${escapeHtml(detailsHeading)}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:10px;overflow:hidden;">
                  ${renderSummaryRows(input.summary)}
                  ${
                    input.totalText
                      ? `<tr>
                          <td style="padding:13px 16px;border-top:2px solid ${INK};font-size:14px;font-weight:700;color:${INK};background-color:#f9f7f6;">Total</td>
                          <td style="padding:13px 16px;border-top:2px solid ${INK};font-size:15px;font-weight:800;color:${BRAND_RED};text-align:right;background-color:#f9f7f6;">${escapeHtml(input.totalText)}</td>
                        </tr>`
                      : ""
                  }
                </table>
              </td>
            </tr>

            ${
              input.notes
                ? `<tr>
                    <td style="padding:22px 32px 0;">
                      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};">Notes</p>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid ${BRAND_RED};background-color:#f9f7f6;border-radius:0 8px 8px 0;">
                        <tr><td style="padding:12px 16px;font-size:13px;line-height:1.6;color:${INK};white-space:pre-wrap;">${escapeHtml(input.notes)}</td></tr>
                      </table>
                    </td>
                  </tr>`
                : ""
            }

            <!-- CTA -->
            <tr>
              <td style="padding:26px 32px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background-color:${BRAND_RED};">
                      <a href="mailto:${input.email}" style="display:inline-block;padding:11px 22px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;">
                        Reply to ${escapeHtml(input.name.split(" ")[0] || "customer")} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 32px 28px;border-top:1px solid ${BORDER};margin-top:8px;">
                <p style="margin:16px 0 0;font-size:12px;color:${MUTED};">
                  This message was generated automatically from a booking form submission — reply directly to respond to the customer.
                </p>
                <p style="margin:10px 0 0;font-size:12px;color:${MUTED};">
                  PC Xpress &middot; 94 The Broadway, Wimbledon SW19 1RH &middot; +44 7307 093007
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

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
    subject:
      input.kind === "repair"
        ? `New Repair Booking — ${input.name}`
        : input.kind === "build"
          ? `New Custom PC Build Order — ${input.name}`
          : `New Pre-built PC Order — ${input.name}`,
    text,
    html,
  });
}

export interface LeadEmailInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
}

export async function sendLeadEmail(input: LeadEmailInput) {
  await sendContactEmail({
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: `New Lead — ${input.source}`,
    message: input.message?.trim() || "(No message provided.)",
  });
}

export async function sendContactEmail(input: ContactEmailInput) {
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL ?? process.env.SMTP_USER;
  if (!adminEmail) {
    throw new Error("No admin recipient configured (set BOOKING_ADMIN_EMAIL).");
  }

  const tel = input.phone?.replace(/[^\d+]/g, "");
  const subject = input.subject?.trim() || "New Contact Form Message";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f1ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1ef;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${BORDER};">

            <!-- Header -->
            <tr>
              <td style="background-color:${BRAND_RED_DARK};background-image:linear-gradient(90deg, ${BRAND_RED_DARK} 0%, ${BRAND_RED} 100%);padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:19px;font-weight:800;letter-spacing:0.02em;color:#ffffff;">
                      PC&nbsp;<span style="color:#ffd9d3;">Xpress</span>
                    </td>
                    <td align="right">
                      <span style="display:inline-block;padding:5px 12px;border-radius:999px;background-color:rgba(255,255,255,0.14);color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
                        Contact Form
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Heading -->
            <tr>
              <td style="padding:28px 32px 4px;">
                <h1 style="margin:0;font-size:21px;line-height:1.3;color:${INK};font-weight:700;">${escapeHtml(subject)}</h1>
                <p style="margin:6px 0 0;font-size:13px;color:${MUTED};">Submitted just now via the PC Xpress website.</p>
              </td>
            </tr>

            <!-- Customer info -->
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f6;border:1px solid ${BORDER};border-radius:10px;padding:16px 18px;">
                  ${renderInfoRow("Name", input.name)}
                  ${renderInfoRow("Email", input.email, `mailto:${input.email}`)}
                  ${input.phone ? renderInfoRow("Phone", input.phone, `tel:${tel}`) : ""}
                </table>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="padding:22px 32px 0;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};">Message</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid ${BRAND_RED};background-color:#f9f7f6;border-radius:0 8px 8px 0;">
                  <tr><td style="padding:12px 16px;font-size:13px;line-height:1.6;color:${INK};white-space:pre-wrap;">${escapeHtml(input.message)}</td></tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:26px 32px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:8px;background-color:${BRAND_RED};">
                      <a href="mailto:${input.email}" style="display:inline-block;padding:11px 22px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;">
                        Reply to ${escapeHtml(input.name.split(" ")[0] || "customer")} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 32px 28px;border-top:1px solid ${BORDER};margin-top:8px;">
                <p style="margin:16px 0 0;font-size:12px;color:${MUTED};">
                  This message was generated automatically from a contact form submission — reply directly to respond to the customer.
                </p>
                <p style="margin:10px 0 0;font-size:12px;color:${MUTED};">
                  PC Xpress &middot; 94 The Broadway, Wimbledon SW19 1RH &middot; +44 7307 093007
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    subject,
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : "",
    "",
    "Message:",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: adminEmail,
    replyTo: input.email,
    subject: `${subject} — ${input.name}`,
    text,
    html,
  });
}
