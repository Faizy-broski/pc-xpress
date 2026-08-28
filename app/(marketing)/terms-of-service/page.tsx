import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service | PC Xpress",
  description:
    "The terms that govern repairs, custom PC builds, pre-built PC purchases and use of the PC Xpress website.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of terms",
    body: (
      <p>
        By booking a repair, ordering a custom or pre-built PC, or otherwise
        using the PC Xpress website and services, you agree to be bound by
        these Terms of Service. If you do not agree, please do not use our
        services.
      </p>
    ),
  },
  {
    id: "repairs",
    heading: "2. Repair services",
    body: (
      <>
        <p>
          All repairs begin with a free diagnostic assessment. We will
          provide a quote before any chargeable work starts, and no work is
          carried out without your approval.
        </p>
        <p>
          Devices left with us for more than 60 days after we notify you that
          work is complete may be treated as abandoned, in line with our
          in-studio collection policy communicated at drop-off.
        </p>
        <p>
          Some repairs carry inherent risk (for example, data loss on failing
          drives, or pre-existing damage becoming apparent mid-repair). We
          will always flag known risks before proceeding.
        </p>
      </>
    ),
  },
  {
    id: "builds",
    heading: "3. Custom & pre-built PCs",
    body: (
      <>
        <p>
          Custom PC builds are configured to the specification agreed with
          you at the time of order. Component availability may change parts
          or lead times; we will contact you before substituting any
          component that affects performance or price.
        </p>
        <p>
          Pre-built PCs are supplied as described on the product listing at
          the time of purchase, tested prior to dispatch or collection.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    heading: "4. Pricing & payment",
    body: (
      <p>
        Prices shown on the website and in quotes are in GBP and include VAT
        where applicable. Payment is due on completion of a repair or before
        dispatch/collection of an order, unless otherwise agreed in writing.
        We reserve the right to correct pricing errors before work begins or
        an order is confirmed.
      </p>
    ),
  },
  {
    id: "warranty",
    heading: "5. Warranty",
    body: (
      <p>
        Repairs and custom builds are covered by a 12-month warranty on
        parts and workmanship, unless a shorter period is stated for a
        specific part (e.g. third-party or refurbished components). The
        warranty does not cover damage from misuse, liquid ingress after
        repair, or unauthorised third-party work.
      </p>
    ),
  },
  {
    id: "cancellations",
    heading: "6. Cancellations & refunds",
    body: (
      <p>
        You may cancel a repair before chargeable work begins at no cost. Once
        work has started, you may be liable for parts already ordered or
        labour already carried out. Custom PC build orders may be cancelled
        for a full refund before components are ordered; once build has
        started, cancellation is subject to the cost of parts and labour
        incurred.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "7. Limitation of liability",
    body: (
      <p>
        We recommend backing up your data before any repair. While we take
        reasonable care to protect your data and device, PC Xpress is not
        liable for data loss, pre-existing faults, or indirect losses arising
        from the use of a repaired or purchased device, except where caused
        by our negligence.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "8. Changes to these terms",
    body: (
      <p>
        We may update these Terms of Service from time to time. Continued use
        of our services after changes are posted constitutes acceptance of
        the revised terms.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "9. Contact",
    body: (
      <p>
        Questions about these terms can be sent to{" "}
        <a href="mailto:info@pcxpress.co.uk" className="text-primary hover:underline">
          info@pcxpress.co.uk
        </a>{" "}
        or by visiting us at 94 The Broadway, Wimbledon SW19 1RH.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="29 July 2026"
      intro="The terms that govern repairs, builds, purchases and use of this website."
      sections={SECTIONS}
    />
  );
}
