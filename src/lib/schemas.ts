import { z } from "zod";
import { isSupportedIconName } from "@/lib/lucide-icons";

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .min(2, { message: "Must be at least 2 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email."),
  message: z.string().min(1, { message: "Message is required." }),
});

const iconLink = z.object({
  name: z.string(),
  href: z.string().url(),
  icon: z.string().refine(isSupportedIconName, {
    message: "Unsupported icon name.",
  }),
});
export type IconLink = z.infer<typeof iconLink>;

const projectDetail = z.object({
  overview: z.string().optional(),
  architectureMermaid: z.string().optional(),
  beforeAfter: z
    .array(
      z.object({
        label: z.string(),
        before: z.string(),
        after: z.string(),
      }),
    )
    .optional(),
  stackHighlights: z.array(z.string()).optional(),
});

const project = z.object({
  name: z.string(),
  description: z.string(),
  /** Short impact line for cards (rendered on the project grid). */
  summary: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()),
  category: z
    .enum([
      "Infrastructure & DevOps",
      "CI/CD",
      "Security",
      "Data & Analytics",
      "Automation & AI",
    ])
    .optional(),
  /** Internal case-study path, e.g. /projects/zabesync */
  href: z.string().optional(),
  /** Explicit slug; otherwise derived from href */
  slug: z.string().optional(),
  /** Short impact lines for cards (legacy) */
  metrics: z.array(z.string()).optional(),
  detail: projectDetail.optional(),
  links: z.array(iconLink),
});
export const projectSchema = z.object({ projects: z.array(project) });
export type Project = z.infer<typeof project>;

const experiencePosition = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string().optional(),
  description: z.array(z.string()).optional(),
  links: z.array(iconLink).optional(),
});
export type ExperiencePosition = z.infer<typeof experiencePosition>;

const experience = z.object({
  name: z.string(),
  href: z.string(),
  logo: z.string(),
  positions: z.array(experiencePosition).min(1),
});
export type Experience = z.infer<typeof experience>;

export const careerSchema = z.object({ career: z.array(experience) });
export const educationSchema = z.object({ education: z.array(experience) });
export const socialSchema = z.object({ socials: z.array(iconLink) });
