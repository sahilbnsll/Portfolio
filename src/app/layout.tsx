import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Calistoga, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import MainContentProvider from "@/components/MainContentProvider"; // Import the new component

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
const calistoga = Calistoga({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Sahil Bansal - DevOps Engineer",
  description: "DevOps Engineer focused on infrastructure automation, reliability, and cost-efficient cloud systems.",

  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          calistoga.variable,
        )}
      >
        <Providers>
          <Header />
          <div className="mx-auto flex max-w-3xl flex-col px-8">
            <MainContentProvider>{children}</MainContentProvider> {/* Use the new component here */}
          </div>
          <Footer />
          <ScrollToTop />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
