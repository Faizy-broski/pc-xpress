import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | PC Xpress",
  description:
    "How PC Xpress collects, uses and protects your personal data when you book a repair, order a PC, or contact us.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "1. Overview",
    body: (
      <p>
        PC Xpress ("we", "us", "our") is committed to protecting your
        privacy. This policy explains what personal data we collect, why we
        collect it, and how we keep it safe when you use our website, book a
        repair, order a PC, or contact us.
      </p>
    ),
  },
  {
    id: "data-we-collect",
    heading: "2. Data we collect",
    body: (
      <>
        <p>We collect information you give us directly, including:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Name, email address and phone number</li>
          <li>Device details and fault descriptions when booking a repair</li>
          <li>Delivery and billing address for orders and deliveries</li>
          <li>Payment information, processed securely by our payment provider</li>
          <li>Messages you send us via the contact form, email or WhatsApp</li>
        </ul>
        <p>
          We also automatically collect limited technical data (such as
          browser type and pages visited) to keep the website working
          reliably — see our{" "}
          <a href="/cookies" className="text-primary hover:underline">
            Cookies Policy
          </a>{" "}
          for details.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "3. How we use your data",
    body: (
      <ul className="list-disc space-y-1.5 pl-5">
        <li>To diagnose, quote and carry out repairs or builds</li>
        <li>To process orders, payments and deliveries</li>
        <li>To respond to enquiries and provide customer support</li>
        <li>To send booking confirmations, updates and warranty information</li>
        <li>To improve our website and services</li>
        <li>To meet our legal and accounting obligations</li>
      </ul>
    ),
  },
  {
    id: "legal-basis",
    heading: "4. Legal basis for processing",
    body: (
      <p>
        We process your data on the basis of contract (to fulfil a repair or
        order you've requested), legitimate interest (to run and improve our
        business), and legal obligation (such as tax and accounting
        records). Where required, we will ask for your consent — for example,
        for optional marketing communications.
      </p>
    ),
  },
  {
    id: "sharing",
    heading: "5. Sharing your data",
    body: (
      <>
        <p>We do not sell your personal data. We may share it with:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Payment processors, to securely handle transactions</li>
          <li>Courier and delivery partners, for shipped orders</li>
          <li>IT and hosting providers, who support our systems</li>
          <li>Authorities, where required by law</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    heading: "6. Data retention",
    body: (
      <p>
        We keep your data only as long as necessary to fulfil the purposes
        described above, honour warranty periods, and meet legal and
        accounting requirements — typically no longer than 6 years after your
        last interaction with us, unless a longer period is required by law.
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "7. Your rights",
    body: (
      <>
        <p>Under UK data protection law, you have the right to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Access the personal data we hold about you</li>
          <li>Ask us to correct inaccurate data</li>
          <li>Ask us to delete your data, subject to legal obligations</li>
          <li>Object to or restrict certain processing</li>
          <li>Request a copy of your data in a portable format</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:info@pcxpress.co.uk" className="text-primary hover:underline">
            info@pcxpress.co.uk
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "security",
    heading: "8. Data security",
    body: (
      <p>
        We use appropriate technical and organisational measures — including
        encrypted payment processing and access controls — to protect your
        personal data from unauthorised access, loss or misuse.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "9. Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. Material changes
        will be reflected by an updated "last updated" date at the top of
        this page.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "10. Contact us",
    body: (
      <p>
        If you have questions about this policy or how we handle your data,
        email{" "}
        <a href="mailto:info@pcxpress.co.uk" className="text-primary hover:underline">
          info@pcxpress.co.uk
        </a>{" "}
        or write to us at 94 The Broadway, Wimbledon SW19 1RH.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="29 July 2026"
      intro="How we collect, use and protect your personal data."
      sections={SECTIONS}
    />
  );
}
