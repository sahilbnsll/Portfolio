/** Canonical production origin. Vercel redirects the apex domain here. */
export const SITE_URL = "https://www.sahilbansal.net";
export const SITE_NAME = "Sahil Bansal";
export const SITE_TITLE = "Sahil Bansal | DevOps & Cloud Infrastructure Engineer";
export const SITE_DESCRIPTION =
  "DevOps and cloud infrastructure engineer specializing in AWS, Terraform, Kubernetes, CI/CD automation, observability, and reliable cost-efficient systems.";
export const OG_IMAGE_PATH = "/og-image.png";

export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/sahilbansal24",
  github: "https://github.com/sahilbnsll",
  x: "https://x.com/sahilbansalll",
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/** Person schema shared across the site (rendered once, site-wide). */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "DevOps & Cloud Infrastructure Engineer",
    knowsAbout: [
      "Amazon Web Services (AWS)",
      "Terraform",
      "Kubernetes",
      "Docker",
      "CI/CD",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
      "Infrastructure as Code",
      "Cloud Architecture",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of Petroleum and Energy Studies",
      url: "https://www.upes.ac.in",
    },
    sameAs: [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.github, SOCIAL_LINKS.x],
  };
}

/** WebSite schema, enables sitelinks search box eligibility metadata. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}
