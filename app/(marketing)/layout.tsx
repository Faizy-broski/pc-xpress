import { Header } from "@/components/layout/header";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
