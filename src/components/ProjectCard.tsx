import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  project: Project;
}

const categoryColors: Record<string, string> = {
  "Infrastructure & DevOps": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "CI/CD": "bg-green-500/10 text-green-600 dark:text-green-400",
  "Security": "bg-red-500/10 text-red-600 dark:text-red-400",
  "Data & Analytics": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
};

// Function to generate key features based on description and tags
function generateKeyFeatures(description: string, tags: string[], name: string): string[] {
  const features: string[] = [];

  // General features based on description keywords
  if (description.toLowerCase().includes("automate")) features.push("Automated Workflows & Operations");
  if (description.toLowerCase().includes("scale")) features.push("Scalable Architecture Design");
  if (description.toLowerCase().includes("optimize cost")) features.push("Cloud Cost Optimization");
  if (description.toLowerCase().includes("monitor") || description.toLowerCase().includes("observability")) features.push("Advanced Monitoring & Observability");
  if (description.toLowerCase().includes("deploy")) features.push("Streamlined Deployment Process");
  if (description.toLowerCase().includes("secure")) features.push("Enhanced Security Measures");
  if (description.toLowerCase().includes("data pipeline")) features.push("Robust Data Pipelines");
  if (description.toLowerCase().includes("real-time")) features.push("Real-time Data Processing");
  if (description.toLowerCase().includes("zero-downtime")) features.push("Zero-Downtime Migrations/Deployments");

  // Tech-specific features from tags
  if (tags.includes("Kubernetes")) features.push("Kubernetes Orchestration");
  if (tags.includes("Docker")) features.push("Containerization with Docker");
  if (tags.includes("Terraform")) features.push("Infrastructure as Code with Terraform");
  if (tags.includes("AWS")) features.push("Leveraged AWS Cloud Services");
  if (tags.includes("GitHub Actions")) features.push("CI/CD with GitHub Actions");
  if (tags.includes("Prometheus") && tags.includes("Grafana")) features.push("Integrated Monitoring with Prometheus & Grafana");
  if (tags.includes("Python")) features.push("Python Scripting & Automation");
  if (tags.includes("Auth0")) features.push("Auth0 Integration for Auth/AuthZ");

  // Add a generic feature if not many are found
  if (features.length < 2 && name) {
    features.push(`Key aspects of ${name} implementation`);
  }
  if (features.length === 0) {
    features.push("Innovative solutions and technical excellence.");
  }


  // Ensure uniqueness and limit to 3-5 features for conciseness
  return Array.from(new Set(features)).slice(0, 5);
}

export function ProjectCard({ project }: Props) {
  const { name, description, image, tags, category, links } = project;
  const prefersReducedMotion = usePrefersReducedMotion();
  const keyFeatures = generateKeyFeatures(description, tags || [], name);

  return (
    <Card className={`flex flex-col overflow-hidden transition-shadow duration-500 hover:shadow-lg group ${prefersReducedMotion ? '' : '[transform-style:preserve-3d] [perspective:1000px]'}`}>
      <div className={`relative ${prefersReducedMotion ? '' : '[transform-style:preserve-3d] transition-transform duration-500 group-hover:[transform:rotateY(180deg)]'}`}>
        <div className={`relative ${prefersReducedMotion ? '' : '[backface-visibility:hidden]'}`}>
          <CardHeader className="p-0">
            {image && (
              <div className="group relative overflow-hidden block">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 transition-opacity duration-500 group-hover:from-black/40" />
                <ImageWithSkeleton
                  src={image}
                  alt={name}
                  width={500}
                  height={300}
                  sizes="(max-width: 640px) calc(100vw - 4rem), 344px"
                  quality={75}
                  containerClassName="h-48 w-full"
                  className="h-48 w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-6">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="transition-colors duration-500 group-hover:text-primary">{name}</CardTitle>
              {category && (
                <Badge
                  className={`whitespace-nowrap text-xs px-2 py-0.5 ${categoryColors[category] || "bg-gray-500/10 text-gray-600 dark:text-gray-400"}`}
                  variant="secondary"
                >
                  {category}
                </Badge>
              )}
            </div>
            <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert leading-relaxed whitespace-pre-line">
              {description}
            </Markdown>
          </CardContent>
        </div>
        <div className={`absolute top-0 left-0 w-full h-full p-6 bg-card rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-scroll custom-scrollbar`}>
          <h3 className="text-lg font-bold mb-2">{name}</h3>
          
          {category && (
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-1">Category</h4>
              <Badge
                className={`whitespace-nowrap text-xs px-2 py-0.5 ${categoryColors[category] || "bg-gray-500/10 text-gray-600 dark:text-gray-400"}`}
                variant="secondary"
              >
                {category}
              </Badge>
            </div>
          )}

          <h4 className="text-md font-semibold mb-1">Description</h4>
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert leading-relaxed whitespace-pre-line mb-4">
            {description}
          </Markdown>
            
          {keyFeatures.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-1">Key Features</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                {keyFeatures.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-1">Tech Stack & Tools</h4>
              <div className="flex flex-wrap gap-1">
                  {tags?.toSorted().map((tag) => (
                    <Badge
                      key={tag}
                      className="px-2 py-1 text-xs"
                      variant="secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
            </div>
          )}
        </div>
      </div>
      <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links.toSorted().map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  <Icon name={link.icon} className="size-3" />
                  {link.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
