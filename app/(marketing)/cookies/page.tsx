import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";

export const metadata: Metadata = {
  title: "Cookies Policy | PC Xpress",
  description:
    "How PC Xpress uses cookies and similar technologies on our website, and how you can manage your preferences.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "what-are-cookies",
    heading: "1. What are cookies",
    body: (
      <p>
        Cookies are small text files placed on your device when you visit a
        website. They help the site function correctly, remember your
        preferences, and give us insight into how the site is used.
      </p>
    ),
  },
  {
    id: "how-we-use-cookies",
    heading: "2. How we use cookies",
    body: (
      <p>
        We use cookies to keep your cart and checkout working, remember your
        preferences (like a chosen theme), keep you signed in where
        applicable, and understand how visitors use our site so we can
        improve it.
      </p>
    ),
  },
  {
    id: "types-of-cookies",
    heading: "3. Types of cookies we use",
    body: (
      <ul className="flex flex-col gap-3">
        <li>
          <span className="font-semibold text-foreground">Strictly necessary — </span>
          required for core functionality such as your shopping cart,
          checkout and security. These cannot be switched off.
        </li>
        <li>
          <span className="font-semibold text-foreground">Functional — </span>
          remember choices you make (like display preferences) to give you a
          more personalised experience.
        </li>
        <li>
          <span className="font-semibold text-foreground">Analytics — </span>
          help us understand how visitors use the site, so we can identify
          and fix issues and improve the experience.
        </li>
      </ul>
    ),
  },
  {
    id: "third-party",
    heading: "4. Third-party cookies",
    body: (
      <p>
        Some cookies may be set by trusted third parties we work with, such
        as payment processors, for the purposes described above. We don't
        control these cookies directly — please refer to the relevant third
        party's own policy for more detail.
      </p>
    ),
  },
  {
    id: "managing-cookies",
    heading: "5. Managing your preferences",
    body: (
      <p>
        Most browsers let you view, manage, delete and block cookies for a
        website. Visit your browser's settings or help menu to adjust your
        preferences — note that blocking strictly necessary cookies may
        affect core features like checkout.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "6. Changes to this policy",
    body: (
      <p>
        We may update this Cookies Policy occasionally to reflect changes to
        the cookies we use or for legal reasons. Please revisit this page
        periodically to stay informed.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "7. Contact us",
    body: (
      <p>
        Questions about our use of cookies can be sent to{" "}
        <a href="mailto:info@pcxpress.co.uk" className="text-primary hover:underline">
          info@pcxpress.co.uk
        </a>
        .
      </p>
    ),
  },
];

export default function CookiesPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookies Policy"
      updated="29 July 2026"
      intro="How we use cookies and similar technologies on this site."
      sections={SECTIONS}
    />
  );
}
