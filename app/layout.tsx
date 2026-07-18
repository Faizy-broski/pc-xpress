import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PCXpress | Expert PC Repairs in Wimbledon",
  description:
    "Fast diagnostics, expert repairs, and custom PC builds in Wimbledon. Book your repair with PCXpress today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <Navbar />
        <main className="flex-1">
          {children}
          </main>
        <Footer />
      </body>
    </html>
  );
}
