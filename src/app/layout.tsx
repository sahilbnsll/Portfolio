import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import JsonLd from "@/components/JsonLd";
import { cn } from "@/lib/utils";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, OG_IMAGE_PATH } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { Calistoga, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import MainContentProvider from "@/components/MainContentProvider";
import ParticleBackground from "@/components/ParticleBackground";
import FloatingPathsBackground from "@/components/ui/floating-paths";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Sahil Bansal",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: "Sahil Bansal", url: SITE_URL }],
  creator: "Sahil Bansal",
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/icon-32.png?v=6", type: "image/png", sizes: "32x32" },
      { url: "/icon.png?v=6", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=6", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=6",
    apple: "/apple-touch-icon.png?v=6",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Sahil Bansal — DevOps & Cloud Infrastructure Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
        <JsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to main content
        </a>
        <Providers>
          {/* Full-canvas kinetic floating paths backdrop across all pages */}
          <div
            className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none"
            aria-hidden="true"
          >
            <FloatingPathsBackground className="h-full w-full" />
          </div>
          <ParticleBackground />
          <div className="relative z-0 flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6 md:px-8 lg:px-10">
              <MainContentProvider>
                <PageTransition>{children}</PageTransition>
              </MainContentProvider>
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
