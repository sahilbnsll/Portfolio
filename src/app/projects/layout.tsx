import type { Metadata } from "next";
import { SITE_URL, OG_IMAGE_PATH } from "@/lib/seo";

const title = "Infrastructure Projects & Case Studies";
const description =
  "Case studies of cloud systems Sahil Bansal has architected: zero-downtime migrations, Kubernetes platforms, CI/CD pipelines, and cost optimizations.";

export const metadata: Metadata = {
  title: { default: title, template: "%s | Sahil Bansal" },
  description,
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/projects`,
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE_PATH],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
