import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Calistoga, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import MainContentProvider from "@/components/MainContentProvider";
import ParticleBackground from "@/components/ParticleBackground";

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
  description:
    "DevOps & cloud infrastructure engineer: AWS, Terraform, CI/CD, observability, and data platforms. Building reliable systems at Buyogo; workflow automation & AI integrations.",
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
          <ParticleBackground />
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-8">
              <MainContentProvider>{children}</MainContentProvider>
            </div>
            <Footer />
          </div>
          <ScrollToTop />
          <div className="grain-overlay" aria-hidden="true" />
        </Providers>
        {process.env.NODE_ENV === "production" ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
