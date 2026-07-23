"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Menu, Search, ShoppingCart, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  // { label: "Prebuilt PCs", href: "/prebuilt-pcs" },
  // { label: "Build a PC", href: "/build-a-pc" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function CartButton({ className }: { className?: string }) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`View cart${itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? "" : "s"})` : ""}`}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10",
        className
      )}
    >
      <ShoppingCart className="size-4.5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-primary shadow-glow">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/pc-xpress.png"
        alt="PCXpress"
        width={404}
        height={110}
        loading="eager"
        className="h-9 w-auto sm:h-10"
      />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  return (
    <div
      className={cn(
        "fixed z-40 mx-auto overflow-hidden bg-gradient-brand transition-[top,left,right,max-width,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[top,left,right,max-width,border-radius,box-shadow]",
        scrolled
          ? "inset-x-0 top-0 max-w-7xl rounded-none shadow-lg shadow-black/20"
          : "inset-x-0 top-0 rounded-none md:inset-x-6 md:top-6 md:my-9 md:max-w-6xl md:rounded lg:inset-x-8"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo className="md:hidden" />

        <div className="hidden flex-1 items-center gap-3 lg:gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-white/75 transition-colors hover:text-white",
                  active && "font-semibold text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Logo className="hidden md:flex" />

        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <Search />
          </Button>

          <CartButton />

          <Button
            className="rounded bg-none bg-white p-6 text-primary shadow-none hover:bg-white/90"
            nativeButton={false}
            render={<Link href="/repair-a-device" />}
          >
            <span className="gradient-text-brand">Book Your Repair</span>
            <ArrowRight />
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartButton />
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                      active && "bg-white/10 font-semibold text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button
                className="mt-2 w-full rounded bg-none bg-white text-primary shadow-none hover:bg-white/90"
                nativeButton={false}
                render={<Link href="/repair-a-device" onClick={() => setOpen(false)} />}
              >
                <span className="gradient-text-brand">Book Your Repair</span>
                <ArrowRight />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
