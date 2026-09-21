import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import { cn } from "@/lib/utils";
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
  metadataBase: new URL("https://sahilbansal.net"),
  title: {
    default: "Sahil Bansal | DevOps & Cloud Infrastructure Engineer",
    template: "%s | Sahil Bansal",
  },
  description:
    "DevOps and cloud infrastructure engineer specializing in AWS, Terraform, Kubernetes, CI/CD automation, observability, and reliable cost-efficient systems.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.png?v=5", type: "image/png" },
      { url: "/favicon.ico?v=5", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=5",
    apple: "/apple-touch-icon.png?v=5",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sahilbansal.net",
    siteName: "Sahil Bansal",
    title: "Sahil Bansal | DevOps & Cloud Infrastructure Engineer",
    description:
      "DevOps and cloud infrastructure engineer specializing in AWS, Terraform, Kubernetes, CI/CD automation, observability, and reliable cost-efficient systems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sahil Bansal — DevOps Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahil Bansal | DevOps & Cloud Infrastructure Engineer",
    description:
      "DevOps and cloud infrastructure engineer specializing in AWS, Terraform, Kubernetes, CI/CD automation, observability, and reliable cost-efficient systems.",
    images: ["/og-image.png"],
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
