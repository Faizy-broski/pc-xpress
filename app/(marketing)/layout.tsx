import { Header } from "@/components/layout/header";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsappButton } from "@/components/layout/whatsapp-button";
import { CartProvider } from "@/components/cart/cart-provider";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappButton />
    </CartProvider>
  );
}
