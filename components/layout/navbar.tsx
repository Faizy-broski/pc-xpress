"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Menu, Search, ShoppingCart, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-provider";
import { AdminNavMenu } from "@/components/layout/admin-nav-menu";
import { LogoMark } from "@/components/layout/logo-mark";

const NAV_LINKS: { label: string; href: string; highlight?: boolean }[] = [
  { label: "Home", href: "/" },
  // { label: "Prebuilt PCs", href: "/prebuilt-pcs" },
  // { label: "Build a PC", href: "/build-a-pc" },
  { label: "PC Repair", href: "/repair-a-device?device=desktop", highlight: true },
  { label: "Laptop Repair", href: "/repair-a-device?device=laptop", highlight: true },
  { label: "Mobile Repair", href: "/repair-a-device?device=phone", highlight: true },
  { label: "MacBook Repair", href: "/repair-a-device?device=laptop", highlight: true },
  { label: "Console Repair", href: "/repair-a-device?device=console", highlight: true },
  { label: "Custom Build", href: "/build-a-pc", highlight: true },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  // { label: "Blog", href: "/blog" },
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
      <LogoMark className="h-9 sm:h-10" />
    </Link>
  );
}

type AdminUser = { name: string; email: string };

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
  });

  // Checked client-side (rather than in the shared layout) so marketing
  // pages keep rendering statically instead of opting into per-request
  // dynamic rendering just to read the auth cookie.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : { admin: null }))
      .then((data) => {
        if (!cancelled) setAdmin(data.admin ?? null);
      })
      .catch(() => {
        if (!cancelled) setAdmin(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed z-40 mx-auto overflow-hidden bg-gradient-brand transition-[top,left,right,max-width,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[top,left,right,max-width,border-radius,box-shadow]",
        scrolled
          ? "inset-x-0 top-0 max-w-screen-2xl rounded-none shadow-lg shadow-black/20"
          : "inset-x-0 top-0 rounded-none md:inset-x-6 md:top-6 md:my-9 md:max-w-screen-2xl md:rounded lg:inset-x-8"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Logo className="lg:hidden" />

        <Logo className="hidden lg:flex lg:justify-self-start" />

        <div className="hidden items-center justify-center gap-4 xl:gap-6 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "whitespace-nowrap text-sm font-medium text-white/75 transition-colors hover:text-white",
                  active && "font-semibold text-white",
                  link.highlight && "font-semibold text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center justify-end gap-2 lg:flex lg:justify-self-end">
          <CartButton />

          <Button
            className="shrink-0 rounded bg-none bg-white px-5 py-5 text-primary shadow-none hover:bg-white/90"
            nativeButton={false}
            render={<Link href="/repair-a-device" />}
          >
            <span className="gradient-text-brand text-xs whitespace-nowrap">Book Your Repair</span>
            <ArrowRight />
          </Button>

          {admin && <AdminNavMenu user={admin} className="ml-1" />}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <CartButton />
          {admin && <AdminNavMenu user={admin} />}
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
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                      active && "bg-white/10 font-semibold text-white",
                      link.highlight && "text-base font-bold text-white"
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
                <span className="gradient-text-brand text-xs">Book Your Repair</span>
                <ArrowRight />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
