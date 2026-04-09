export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sahil Bansal",
    jobTitle: "DevOps & Cloud Infrastructure Engineer",
    url: "https://sahilbansal.dev",
    sameAs: [
      "https://linkedin.com/in/sahilbansal17",
      "https://github.com/sahilb2",
    ],
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
    worksFor: {
      "@type": "Organization",
      name: "Buyogo",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
