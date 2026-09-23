import { personSchema, websiteSchema } from "@/lib/seo";

/** Site-wide structured data: one Person + WebSite graph, rendered once in the root layout. */
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [personSchema(), websiteSchema()],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
