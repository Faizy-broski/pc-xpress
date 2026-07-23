"use client";

import { useEffect } from "react";

import { useCart } from "@/components/cart/cart-provider";

/** Empties the guest cart once, on mount — used on the checkout success page. */
export function ClearCartOnMount() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // Intentionally runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
