import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

const portfolioUrl = "https://sahilbansal.dev";
const pageTitle = "Sahil Bansal | DevOps & Cloud Infrastructure Engineer";
const pageDescription =
  "DevOps and cloud infrastructure engineer focused on AWS, Terraform, Kubernetes, CI/CD automation, observability, and cost-efficient production systems.";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sahil Bansal",
  jobTitle: "DevOps & Cloud Infrastructure Engineer",
  knowAbout: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Petroleum and Energy Studies",
    url: "https://www.upes.ac.in",
  },
  url: portfolioUrl,
};

export const metadata: Metadata = {
  title: {
    absolute: pageTitle,
  },
  description: pageDescription,
  alternates: {
    canonical: portfolioUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: portfolioUrl,
    siteName: "Sahil Bansal",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: pageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <HomePageClient />
    </>
  );
}
