import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NotFoundPanel } from "@/components/marketing/not-found-panel";
import { CartProvider } from "@/components/cart/cart-provider";

export const metadata: Metadata = {
  title: "Page Not Found | PC Xpress",
};

export default function GlobalNotFound() {
  return (
    <CartProvider>
      <Header />
      <Navbar />
      <main className="flex-1 pt-28 md:pt-40">
        <NotFoundPanel />
      </main>
      <Footer />
    </CartProvider>
  );
}
