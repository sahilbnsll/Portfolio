import type { Metadata } from "next";
import { SITE_URL, OG_IMAGE_PATH } from "@/lib/seo";

const title = "Contact";
const description =
  "Get in touch with Sahil Bansal about infrastructure reliability, cost optimization, cloud migrations, or DevOps collaboration.";

export const metadata: Metadata = {
  title: { default: title, template: "%s | Sahil Bansal" },
  description,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/contact`,
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE_PATH],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
