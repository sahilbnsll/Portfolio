import type { Metadata } from "next";
import { SITE_URL, OG_IMAGE_PATH } from "@/lib/seo";

const title = "Blog";
const description =
  "Notes on cloud migrations, infrastructure automation, and observability — written from production incidents and real deployments.";

export const metadata: Metadata = {
  title: { default: title, template: "%s | Sahil Bansal" },
  description,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/blog`,
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE_PATH],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
