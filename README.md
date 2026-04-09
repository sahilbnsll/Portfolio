# Sahil Bansal Portfolio

Production portfolio for Sahil Bansal, a DevOps and cloud infrastructure engineer focused on AWS, Terraform, CI/CD, observability, automation, and reliability engineering.

Live site: `https://sahilbansal.dev`

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
- Embedded AI assistant backed by Groq.
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

- `src/app/api/chat/route.ts`: AI assistant endpoint using Groq streaming.
- `src/app/api/stats/route.ts`: visitor and pageview stats endpoint using Vercel Analytics APIs.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Framework | Next.js 14, React 18, App Router |
| Styling | Tailwind CSS, custom UI primitives |
| Motion | Framer Motion |
| Validation | Zod, React Hook Form |
| AI | Groq SDK, Vercel AI streaming response format |
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

Set the following in `.env.local`:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | Enables the AI assistant in `src/app/api/chat/route.ts` |
| `VERCEL_API_TOKEN` | Optional | Enables visitor statistics in `src/app/api/stats/route.ts` |
| `VERCEL_PROJECT_ID` | Optional | Required with `VERCEL_API_TOKEN` for stats |
| `VERCEL_TEAM_ID` | Optional | Required only if the Vercel project belongs to a team |

Notes:

- If the Vercel analytics variables are missing, the stats widget will not have live data.
- The contact form uses a hardcoded Formspree endpoint today, so no mail env var is required for local development.

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

- The chat endpoint depends on `GROQ_API_KEY`.
- The stats endpoint depends on Vercel Analytics credentials.
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
