"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * This Next.js build's <Link> defaults to *maintaining* scroll position
 * across navigations (rather than resetting to top) whenever the
 * previous route's DOM is still considered "visible" — which is always
 * true here since the marketing/dashboard layouts keep a persistent
 * header/footer mounted across routes. Without this, clicking a link
 * while scrolled down lands on the new page at the same scroll offset,
 * which can show that page's footer instead of its top.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
