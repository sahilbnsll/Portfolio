# Sahil Bansal - Portfolio

A data-driven developer portfolio built with Next.js 14, Tailwind CSS, and Shadcn UI. Features an AI chatbot (Groq), interactive terminal, skill dependency graph, project case studies, blog, and more.

**Live:** [sahilbansal.vercel.app](https://sahilbansal.vercel.app)

---

## Tech Stack

| Layer         | Tech                                                    |
| ------------- | ------------------------------------------------------- |
| Framework     | Next.js 14 (App Router)                                 |
| Styling       | Tailwind CSS + Shadcn UI                                |
| Animations    | Framer Motion                                           |
| AI Chatbot    | Groq SDK (Llama 3.1 8B)                                 |
| Visualizations| D3 (skill graph), Mermaid (architecture diagrams)       |
| Markdown      | react-markdown + remark-gfm                             |
| Hosting       | Vercel                                                  |
| Theme         | next-themes (light/dark)                                |

---

## Getting Started

```bash
git clone https://github.com/sahilbansal/portfolio.git
cd portfolio
npm install
cp .env.example .env.local
# Fill in your API keys (see below)
npm run dev
```

### Environment Variables

Create `.env.local` from `.env.example`:

| Variable           | Required | Description                     |
| ------------------ | -------- | ------------------------------- |
| `GROQ_API_KEY`     | Yes      | Groq API key for AI chatbot     |
| `REVALIDATE_SECRET`| No       | Secret for on-demand revalidation |

---

## Project Structure

```
src/
  app/
    page.tsx                          # Home page (hero, skills, projects, experience, etc.)
    layout.tsx                        # Root layout + providers
    projects/
      page.tsx                        # Projects listing with filters
      [slug]/page.tsx                 # Individual project case study
    blog/
      page.tsx                        # Blog listing
      [slug]/page.tsx                 # Individual blog post
    contact/page.tsx                  # Contact form
    privacy/page.tsx                  # Privacy policy
    not-found.tsx                     # 404 page
    api/
      chat/route.ts                   # AI chatbot API (Groq)
      stats/route.ts                  # Stats endpoint
  data/                               # ALL content lives here (JSON-driven)
    home.json                         # Hero intro, "currently building", escalation CTA
    projects.json                     # Portfolio projects with case studies
    skills.json                       # Skills by category with proficiency levels
    career.json                       # Work experience timeline
    education.json                    # Education history
    certifications.json               # Certifications & badges
    testimonials.json                 # Social proof quotes
    socials.json                      # Social media links
    blog.json                         # Blog post metadata
    blog-content.json                 # Blog post markdown content
    routes.json                       # Navigation routes config
  components/                         # React components
    ui/                               # Shadcn UI primitives
    Header.tsx, Footer.tsx            # Layout
    Chat.tsx                          # AI chatbot UI
    Projects.tsx, ProjectCard.tsx     # Project display
    Experience.tsx                    # Career + education timeline
    SkillsSection.tsx                 # Skills grid
    SkillDependenciesGraph.tsx        # D3 skill graph
    InteractiveTerminal.tsx           # CLI-style terminal
    SwipeCards.tsx                    # Profile photo carousel
    StatsOverview.tsx                 # DevOps impact stats
    CertificationsSection.tsx         # Certifications display
    TestimonialsSection.tsx           # Testimonials carousel
    ...                               # 50+ components
  lib/
    utils.ts                          # Utility functions (cn, formatDate, etc.)
    schemas.ts                        # Zod validation schemas
    blog-utils.ts                     # Blog slug/link helpers
    project-utils.ts                  # Project slug/link helpers
    tool-icons.ts                     # Tool icon mappings (key -> SVG path)
public/
  img/                                # Project images, company logos, profile photos
  icons/tools/                        # SVG tool/tech icons (AWS, Docker, K8s, etc.)
  sounds/                             # UI sound effects
  Sahil_Bansal_Resume.pdf             # Downloadable resume
```

---

## Content Update Guide

All content is JSON-driven. No code changes needed for most updates.

---

### Update Personal Intro / Hero

**File:** `src/data/home.json`

```json
{
  "currentlyBuilding": {
    "title": "Currently building",
    "headline": "Short headline",
    "body": "Description of current work",
    "tags": ["Tag1", "Tag2"]
  },
  "introduction": {
    "greeting": "infrastructure that scales automatically.",
    "description": "Full intro paragraph shown on hero section.",
    "chatPrompt": "Questions about DevOps, reliability, or cloud infrastructure? Ask the chat.",
    "escalation": {
      "text": "For anything else, let's",
      "linkText": "connect directly",
      "suffix": "."
    }
  },
  "escalationLink": {
    "href": "mailto:your@email.com",
    "title": "Get in touch"
  }
}
```

**What maps where:**
- `greeting` -> Hero subtitle after "hi, sahil here."
- `description` -> Paragraph below the subtitle
- `chatPrompt` -> Bold white heading text in hero
- `escalation` -> Gray "connect directly" link text below it
- `escalationLink.href` -> Where "connect directly" links to
- `currentlyBuilding` -> "Currently building" section (shown on home page)

---

### Add / Update Projects

**File:** `src/data/projects.json`

```json
{
  "projects": [
    {
      "name": "Project Name",
      "slug": "project-slug",
      "description": "**Problem:** X\n**Solution:** Y\n**Impact:** Z",
      "summary": "One-liner impact summary",
      "image": "/img/project-image.png",
      "category": "Infrastructure & DevOps",
      "metrics": ["99.9% uptime", "40% cost reduction"],
      "tags": ["AWS", "Terraform", "Docker"],
      "href": "/projects/project-slug",
      "links": [],
      "detail": {
        "overview": "Longer overview paragraph",
        "stackHighlights": ["AWS ECS", "Terraform", "GitHub Actions"],
        "beforeAfter": [
          { "label": "Deploy time", "before": "45 min", "after": "8 min" }
        ],
        "architectureMermaid": "flowchart LR\n  A[Client] --> B[Load Balancer]"
      }
    }
  ]
}
```

**Steps to add a new project:**
1. Add entry to `projects` array in `src/data/projects.json`
2. Add project image to `public/img/` (recommended: 1200x630px)
3. Set `slug` to desired URL path (page auto-generated at `/projects/<slug>`)
4. Use markdown in `description` with `**Problem:**`, `**Solution:**`, `**Impact:**` sections
5. `tags` should match skill names for cross-referencing
6. `detail.architectureMermaid` is optional (Mermaid diagram syntax)

**Valid categories:** `"Infrastructure & DevOps"`, `"CI/CD"`, `"Security"`, `"Data & Analytics"`, `"Automation & AI"`

**Image path:** `public/img/<name>.png` -> referenced as `/img/<name>.png`

---

### Add / Update Skills

**File:** `src/data/skills.json`

```json
{
  "categories": [
    {
      "name": "Cloud & Infrastructure",
      "skills": [
        {
          "name": "AWS",
          "level": 90,
          "description": "ECS, Lambda, S3, RDS, CloudFormation, IAM, CloudWatch. Managed 30+ services across 3 environments."
        }
      ]
    }
  ]
}
```

- `level`: 0-100, shown as progress bar percentage
- `description`: Include concrete achievements/tools
- Skills appear on home page + skill dependencies graph

---

### Add / Update Work Experience

**File:** `src/data/career.json`

```json
{
  "career": [
    {
      "name": "Company Name",
      "href": "https://company.com",
      "logo": "/img/company-logo.png",
      "positions": [
        {
          "title": "Job Title",
          "start": "Jun 2024",
          "end": null,
          "description": [
            "Achievement bullet 1",
            "Achievement bullet 2"
          ]
        }
      ]
    }
  ]
}
```

- Order: most recent company first
- Omit `end` (or set `null`) for current role
- `logo`: Add square logo (100x100px recommended) to `public/img/`
- Multiple positions per company supported (for promotions)

**Logo path:** `public/img/<company>.png` -> referenced as `/img/<company>.png`

---

### Add / Update Education

**File:** `src/data/education.json`

Same structure as `career.json`. `name` = school, `positions[].title` = degree/program.

---

### Add / Update Certifications

**File:** `src/data/certifications.json`

```json
{
  "certifications": [
    {
      "name": "AWS Solutions Architect Associate",
      "organization": "Amazon Web Services",
      "issueDate": "February 2024",
      "credentialId": "ABC123XYZ",
      "credentialUrl": "https://www.credly.com/badges/...",
      "logo": "/img/cert-logo.png"
    }
  ]
}
```

**Logo path:** `public/img/<cert-org>.png` -> referenced as `/img/<cert-org>.png`

---

### Add / Update Testimonials

**File:** `src/data/testimonials.json`

```json
{
  "testimonials": [
    {
      "name": "Person Name",
      "title": "Role at Company",
      "quote": "Testimonial text...",
      "avatar": "PN",
      "rating": 5
    }
  ]
}
```

- `avatar`: 2-letter initials (used as fallback avatar)
- `rating`: 1-5 stars

---

### Add / Update Blog Posts

**Metadata:** `src/data/blog.json`

```json
{
  "intro": "Sometimes I write about things I've built or broken...",
  "posts": [
    {
      "title": "Post Title",
      "description": "Short teaser",
      "date": "2026-02-26",
      "comingSoon": false,
      "external": false,
      "href": "/blog/post-slug"
    }
  ]
}
```

**Content:** `src/data/blog-content.json`

```json
{
  "posts": [
    {
      "slug": "post-slug",
      "title": "Post Title",
      "content": "## Heading\n\nMarkdown content here..."
    }
  ]
}
```

**Steps to add a blog post:**
1. Add metadata to `blog.json` `posts` array
2. For internal posts: set `href` to `/blog/<slug>` and add matching entry in `blog-content.json`
3. For external posts (Medium, Dev.to): set `external: true` and `href` to full URL
4. Set `comingSoon: true` to show a "soon" badge without making it clickable

---

### Update Social Links

**File:** `src/data/socials.json`

```json
{
  "socials": [
    { "name": "LinkedIn", "href": "https://linkedin.com/in/...", "icon": "linkedin" },
    { "name": "GitHub", "href": "https://github.com/...", "icon": "github" },
    { "name": "Email", "href": "mailto:you@email.com", "icon": "mail" }
  ]
}
```

- `icon`: Uses [lucide-react](https://lucide.dev/icons/) icon names

---

### Update Navigation

**File:** `src/data/routes.json`

```json
{
  "routes": [
    { "path": "/", "name": "home", "description": "Portfolio overview", "showInNav": true },
    { "path": "/projects", "name": "projects", "description": "All projects", "showInNav": true },
    { "path": "/blog", "name": "blog", "description": "Blog posts", "showInNav": true },
    { "path": "/contact", "name": "contact", "description": "Contact form", "showInNav": true }
  ],
  "externalLinks": [
    { "path": "https://linkedin.com/in/...", "name": "linkedin", "description": "LinkedIn", "isExternal": true }
  ]
}
```

---

### Update Resume

Replace `public/Sahil_Bansal_Resume.pdf` with your updated PDF. The download button in the hero section links to this file.

---

### Add Tool/Tech Icons

Icons are SVG files in `public/icons/tools/`.

**Steps:**
1. Add SVG file to `public/icons/tools/YourTool.svg`
2. Register it in `src/lib/tool-icons.ts`:
   ```ts
   YourTool: {
     name: "Your Tool",
     url: `${LOCAL}/YourTool.svg`,
   },
   ```
3. Use the key (`"YourTool"`) in project `tags` or skill names

**Existing icons:** AWS, Kubernetes, Docker, Terraform, Prometheus, Grafana, Supabase, PostgreSQL, MySQL, MongoDB, Python, Bash, Jenkins, Auth0, ClickHouse, Git, GitHub Actions, AWS CloudFormation, AWS CodeBuild, AWS CloudWatch, IAM, HCL, YAML, n8n, DLT, DBT, Dagster, LinkedIn API, Discord Bots, DevSecOps

---

### Add Profile Photos

Profile photos for the swipe card carousel go in `public/img/`.

**Naming convention:** `sahil1.jpeg` through `sahil8.jpeg`

To change the photos, replace files with the same names or update the component in `src/components/SwipeCards.tsx`.

---

### Update AI Chatbot

**File:** `src/app/api/chat/route.ts`

The system prompt contains all the knowledge the chatbot uses. Update it when you:
- Change jobs or roles
- Add new projects
- Update skills
- Change contact info

The chatbot does NOT auto-read from JSON files. Keep the system prompt in sync with `src/data/*.json`.

---

### Add Company/School Logos

1. Add logo image to `public/img/<name>.png` (square, ~100x100px recommended)
2. Reference in `career.json` or `education.json` as `/img/<name>.png`

**Existing logos:** `Capgemini.png`, `buyogo.png`, `qapita.png`, `xebia.png`, `zabe.png`, `upes.png`

---

### Add Project Images

1. Add image to `public/img/<project>.png` (recommended: 1200x630px)
2. Reference in `projects.json` as `/img/<project>.png`

**Existing images:** `zabesync.png`, `merchant_project.png`, `data_pipeline.png`, `IAC_migration.png`, `cicd_optimize.png`, `monitoring.png`, `auth0_tenant.png`

---

## Quick Reference: File Paths

| What to update          | File(s)                                    |
| ----------------------- | ------------------------------------------ |
| Hero / intro text       | `src/data/home.json`                       |
| Projects                | `src/data/projects.json`                   |
| Skills                  | `src/data/skills.json`                     |
| Work experience         | `src/data/career.json`                     |
| Education               | `src/data/education.json`                  |
| Certifications          | `src/data/certifications.json`             |
| Testimonials            | `src/data/testimonials.json`               |
| Blog posts              | `src/data/blog.json` + `src/data/blog-content.json` |
| Social links            | `src/data/socials.json`                    |
| Navigation              | `src/data/routes.json`                     |
| Resume PDF              | `public/Sahil_Bansal_Resume.pdf`           |
| Project images          | `public/img/`                              |
| Company/school logos    | `public/img/`                              |
| Tool/tech SVG icons     | `public/icons/tools/` + `src/lib/tool-icons.ts` |
| Profile photos          | `public/img/sahil1-8.jpeg`                 |
| AI chatbot knowledge    | `src/app/api/chat/route.ts`                |
| Contact email (CTA)     | `src/data/home.json` -> `escalationLink.href` |
| Theme / colors          | `src/app/globals.css` (CSS variables)      |

---

## Deployment

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com/)
3. Add environment variables (`GROQ_API_KEY`)
4. Deploy

**Costs:** Groq API (free beta), Vercel (free tier), Domain (~$20/yr)

---

## License

MIT
