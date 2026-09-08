# Sahil Bansal Portfolio

Production portfolio for Sahil Bansal, a DevOps and cloud infrastructure engineer focused on AWS, Terraform, CI/CD, observability, automation, and reliability engineering.

Live site: `https://sahilbansal.net`

## Product Positioning

This project is not a static profile page. It is a portfolio application designed to do four jobs well:

- Present Sahil's technical profile clearly to recruiters and hiring managers.
- Show depth through structured project case studies instead of shallow project cards.
- Provide a recruiter-friendly interactive resume with skill and experience filtering.
- Answer common portfolio questions through an embedded AI assistant trained on the site's public content.

## Core Features

- App Router-based portfolio with route-level metadata and structured data.
- Interactive home page with hero, skills, terminal, featured projects, experience, certifications, testimonials, and recent posts.
- Projects index with category filtering.
- Project case-study pages with structured sections such as Overview, Problem, Solution, Trade-offs, Results, Decisions, Architecture, Pipeline, and Incidents.
- Interactive resume with search, skill filters, experience timeline, education, and linked project highlights.
- **Recruiter/Engineer view modes** for tailored presentation of content.
- **System status indicators** for operational visibility.
- Embedded AI assistant backed by a multi-provider failover cascade (Google Gemini, Mistral AI, OpenRouter, Groq, and GitHub Models).
- Visitor statistics modal backed by Vercel Analytics.
- Contact form wired to Formspree.
- Privacy page and blog support.

## Architecture Overview

### Rendering model

- `src/app/layout.tsx` provides the global shell, fonts, metadata defaults, analytics, and providers.
- `src/app/page.tsx` is server-rendered and owns home-page metadata plus Person JSON-LD.
- `src/components/HomePageClient.tsx` contains the interactive client-side home experience.
- Project pages are generated from structured JSON content in `src/data/projects.json`.

### State and providers

- `src/components/Providers.tsx` wires theme state, chat state, recruiter/engineer view mode, chat mounting, error boundaries, and toasts.
- `src/contexts/ChatContext.tsx` drives the AI assistant UI state.
- `src/contexts/ViewModeContext.tsx` controls engineer vs recruiter presentation mode with toggle support.

### View Modes

- **Engineer Mode**: Technical depth, architecture diagrams, pipeline details, incidents.
- **Recruiter Mode**: High-level impact, metrics-focused, timeline view.
- Toggle via `ViewModeToggle` component; state persisted across navigation.

### Content model

The site is primarily JSON-driven:

- `src/data/home.json`
- `src/data/projects.json`
- `src/data/skills.json`
- `src/data/career.json`
- `src/data/education.json`
- `src/data/testimonials.json`
- `src/data/socials.json`
- `src/data/blog.json`
- `src/data/blog-content.json` (blog post content)

### API surfaces

- `src/app/api/chat/route.ts`: AI assistant endpoint with prioritized multi-provider cascade and model failover:
  1. Google Gemini (`gemini-2.5-flash`, `gemini-flash-latest`)
  2. Mistral AI (`codestral-latest`, `ministral-8b-latest`, `ministral-14b-latest`, `ministral-3b-latest`, `open-mistral-nemo`)
  3. OpenRouter Free (`nvidia/nemotron-3.5-lightning:free`, `nvidia/nemotron-3-super-120b-a12b:free`, `poolside/laguna-s-2.1:free`)
  4. Groq (`groq/compound-mini`, `groq/compound`, `qwen/qwen3.8-27b`, `qwen/qwen3.6-27b`, `allam-2-7b`, `openai/gpt-oss-120b`)
  5. GitHub Models (`gpt-4o-mini`, `Meta-Llama-3.1-8B-Instruct`, `Phi-3.5-mini-instruct`)
- `src/app/api/stats/route.ts`: visitor and pageview stats endpoint using official Vercel Web Analytics aggregate API (`/v1/query/web-analytics/visits/aggregate`).

## Tech Stack

| Layer | Stack |
| --- | --- |
| Framework | Next.js 14, React 18, App Router |
| Styling | Tailwind CSS, custom UI primitives |
| Motion | Framer Motion |
| Validation | Zod, React Hook Form |
| AI | `@google/generative-ai`, `groq-sdk`, `openai` (Mistral/OpenRouter/GitHub), Vercel AI streaming response format |
| Markdown | react-markdown |
| Analytics | Vercel Analytics, Vercel Speed Insights |
| Forms | Formspree |
| Deployment | Vercel |

## Setup

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/sahilb2/Portfolio.git
cd Portfolio
npm install
cp .env.example .env.local
```

### Environment Variables

Configure `.env.local` with one or more of the following keys:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Recommended | Primary AI provider using Google Gemini (`gemini-2.5-flash`) |
| `MISTRAL_API_KEY` | Optional | Secondary AI failover using Mistral AI |
| `OPENROUTER_API_KEY` | Optional | Tertiary AI failover using verified free models |
| `GROQ_API_KEY` | Optional | High-speed AI failover using Groq |
| `GITHUB_MODELS_TOKEN` | Optional | Standby AI failover using GitHub Models |
| `VERCEL_API_TOKEN` | Optional | Enables visitor statistics in `src/app/api/stats/route.ts` |
| `VERCEL_PROJECT_ID` | Optional | Required with `VERCEL_API_TOKEN` for analytics querying |
| `VERCEL_TEAM_ID` | Optional | Required only if the Vercel project belongs to a team |
| `REVALIDATE_SECRET` | Optional | Secret token for on-demand ISR revalidation endpoints |

Optional Model Overrides:
You can also set `GEMINI_MODEL`, `MISTRAL_MODEL`, `OPENROUTER_MODEL`, `GROQ_MODEL`, or `GITHUB_MODEL` to pin a specific model without editing code.

Notes:

- If none of the AI keys are configured, the chat route gracefully degrades to a helpful portfolio introduction instead of crashing with HTTP 500.
- If Vercel analytics variables are missing, the stats widget safely falls back to a clean baseline.

### Local Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production Checks

```bash
npm run lint
npm run build
```

## Folder Structure

```text
src/
  app/
    api/
      chat/route.ts
      stats/route.ts
    blog/
      [slug]/page.tsx
      page.tsx
    contact/page.tsx
    layout.tsx
    page.tsx
    privacy/page.tsx
    projects/
      [slug]/page.tsx
      page.tsx
    resume/page.tsx
  components/
    ui/
    HomePageClient.tsx
    InteractiveResume.tsx
    InteractiveTerminal.tsx
    ViewModeToggle.tsx
    SystemStatus.tsx
    ArchitectureDiagram.tsx
    CICDPipeline.tsx
    CaseStudyExtras.tsx
    Projects.tsx
    ProjectCard.tsx
    Experience.tsx
    SkillsSection.tsx
    CoreSkillsExpertiseSection.tsx
    SkillDependenciesGraph.tsx
    ContactForm.tsx
    Chat.tsx
    ChatPanel.tsx
    Header.tsx
    Footer.tsx
    Providers.tsx
    JsonLd.tsx
    StatsOverview.tsx
    AboutMe.tsx
  contexts/
    ChatContext.tsx
    ViewModeContext.tsx
  data/
    blog.json
    blog-content.json
    career.json
    education.json
    home.json
    projects.json
    skills.json
    socials.json
    testimonials.json
  hooks/
  lib/
    actions.ts
    blog-utils.ts
    project-utils.ts
    schemas.ts
    tool-icons.ts
    utils.ts
public/
  img/
  Sahil_Bansal_Resume.pdf
```

## Key Design Decisions

- Server/client split on the home route:
  `src/app/page.tsx` owns metadata and JSON-LD, while `src/components/HomePageClient.tsx` owns interactive UI.
- JSON-driven portfolio content:
  projects, skills, career history, testimonials, and most home-page copy live outside components.
- Case-study-first portfolio structure:
  project pages carry detailed decision-making and delivery context instead of only screenshots and tag lists.
- Embedded AI assistant:
  common recruiter questions can be answered without forcing users to scan the entire site manually.
- Recruiter/engineer view model:
  the portfolio can present a narrative site experience or a denser resume-oriented view.

## Updating Content

### Add or edit a project

Update `src/data/projects.json`.

Each project supports:

- `name`, `slug`, `summary`, `description`
- `category`, `metrics`, `tags`, `image`, `links`
- structured `detail` sections including:
  - `overview`
  - `problem`
  - `solution`
  - `tradeoffs`
  - `results`
  - `stackHighlights`
  - `beforeAfter`
  - `architecture`
  - `architectureMermaid`
  - `decisions`
  - `pipeline`
  - `incidents`

### Add or edit skills

Update `src/data/skills.json`.

Each skill entry should include:

- `name`
- `level`
- `description`

### Add or edit work experience

Update `src/data/career.json`.

Each company entry supports one or more positions with:

- `title`
- `start`
- `end`
- `description[]`

## Reliability Notes

- The chat endpoint implements a resilient two-tier cascade across 5 providers (Gemini, Mistral, OpenRouter, Groq, GitHub Models) with automatic model failover and helpful portfolio fallback responses.
- The stats endpoint queries Vercel Web Analytics aggregate endpoint with schema normalization and zero-baseline degradation.
- The contact form depends on Formspree availability.
- All project data is parsed through Zod at runtime before project grids and case-study pages render.

## Future Improvements

- Replace remaining internal anchor tags with `next/link` for client-side navigation consistency.
- Add schema validation for `skills.json`, `education.json`, and `testimonials.json`.
- Replace remaining `<img>` usage for local assets with `next/image` or a documented optimized exception.
- Reduce client bundle size by splitting large interactive surfaces such as the terminal and stats modal.
- Move AI-assistant biography content from the hardcoded system prompt into shared structured data.
- Add view mode persistence to localStorage for cross-session preference retention.
- Enhance case study pages with interactive architecture diagrams.

## License

Personal portfolio project. Reuse code patterns thoughtfully; do not present Sahil's personal branding or content as your own.
