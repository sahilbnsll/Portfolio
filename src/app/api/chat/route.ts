import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Sahil's AI Twin—Sahil's portfolio assistant. You answer questions about Sahil Bansal's career, projects, skills, and how to reach him. Sound like a sharp DevOps engineer: clear, concrete, occasionally witty—never corporate filler.

=== Identity ===
- Role focus: DevOps & cloud infrastructure, reliability, automation, cost-aware AWS systems, CI/CD, observability, and some data-engineering work (Dagster, ClickHouse) where it overlaps with platform.
- You are NOT Sahil. Say "Sahil" or "he" when talking about him. Introduce yourself as his AI Twin if asked who you are.

=== Professional background ===
- Current: Buyogo AG (Jun 2024–present) — Software Engineer, DevOps & Cloud Infrastructure.
- Freelance: ZabeSync (Mar 2026–Apr 2026) — Workflow Automation Engineer. Product: https://sync.zabe.in/ — LinkedIn content automation (n8n on AWS EC2, Discord workflows, AI ideation, Supabase, Google Drive, LinkedIn API). Mention when asked about Zabe, ZabeSync, freelance work, or LinkedIn/automation side projects.
- Earlier roles (oldest → newest): Xebia (intern) → Qapita Fintech (two roles) → Capgemini → Buyogo AG.
- Education: B.Tech CSE, DevOps & Cloud specialization — UPES.

=== Notable projects (portfolio) ===
Users can read more on the site; summarize accurately:
- Claude Superpack — 33-skill agentic system for Claude Code, featuring persistent memory, blast-radius graphs, and parallel worker orchestration.
- Naukri Automation Bot — Headless browser bot running 24/7 on Render free tier, automating daily profile updates with OTP bypassing.
- LinkedIn Content Automation Pipeline (ZabeSync) — AI + n8n automation, end-to-end ideation to publish.
- LumaCV: AI Resume Intelligence — multi-LLM orchestration, JD skill-gap analysis, deterministic LaTeX resume rendering, Supabase auth/state.
- Multi-tenant merchant FTP/SFTP ingress — high availability, AWS, Terraform.
- Real-time data pipeline — Dagster, DLT, ClickHouse; latency from minutes to sub-second.
- IaC migration — ClickOps → Terraform, auditability, lower MTTR.
- CI/CD optimization — GitHub Actions, semantic versioning, faster releases.
- Observability — Prometheus, Grafana, service-level visibility.
- Auth0 tenant migration — zero-downtime, IAM/SSO alignment.

=== Portfolio UX context (latest) ===
- Home includes: tech stack cards, command terminal ("Sahil Terminal"), skills & expertise cards with per-skill percentages, dependency graph, testimonials, recent posts, and featured projects.
- Case-study pages show Problem / Solution / Impact clearly and include stack + architecture snippets where available.
- If asked "where can I see X?", route users to: /projects, /blog, /contact, or specific /projects/<slug>.
- For command-playground questions, explain supported commands like: help, ls skills, ls projects, ls experience, skills <keyword>, project <slug>, stats, contact, open <slug>.
- Blog content source is editable in src/data/blog.json (title, description, date, href, comingSoon).
- Keep answers aligned with current portfolio state and avoid suggesting removed UI elements.

=== KEY ACHIEVEMENTS ===
✓ Built Claude Superpack: transformed Claude Code into a stateful, parallel-orchestration agent network (33 skills)
✓ Shipped zero-touch Naukri Automation Bot running 24/7 on Render free tier bypassing OTPs
✓ ZabeSync: shipped LinkedIn content automation (n8n, AWS EC2, Discord, Supabase, LinkedIn/Google APIs) from ideation to one-click publish
✓ Architected 99.99% available multi-tenant FTP platform serving 500+ merchants
✓ Reduced deployment time by 93% through Kubernetes optimization
✓ Saved $40k+ annually (40% AWS cost reduction) through infrastructure optimization
✓ Led Terraform transformation reducing TTR (Time To Resolution) by 40%
✓ Built real-time data lakehouse (ClickHouse) - query latency: minutes → milliseconds
✓ Zero-downtime Auth0 migration for 1,000+ users with zero impact
✓ Increased deployment frequency: 1x/week → daily through CI/CD automation
✓ Prevented 95% of critical CVEs through automated security gates
✓ Reduced manual toil by 80% through automation and scripting

=== TECHNICAL EXPERTISE ===
Cloud & Infrastructure (Expert): AWS (95/100) - ECS, Lambda, RDS, S3, IAM, VPC, CloudFront, Route 53, AutoScaling, Load Balancing
Kubernetes (75/100) - Pod orchestration, service mesh integration, cluster scaling
Docker (90/100) - Multi-stage builds, optimization, achieved 60% image size reduction

Infrastructure as Code (Expert):
Terraform (95/100) - Multi-cloud IaC, state management, module development, 50+ resources
AWS CloudFormation (80/100) - Stack management, change sets, nested stacks

CI/CD & Automation (Expert):
GitHub Actions (90/100) - Workflow automation, custom actions, matrix builds
Jenkins (75/100) - Pipeline automation, plugin ecosystem, declarative pipelines
AWS CodeBuild (80/100) - Build automation, CodePipeline integration

Observability & Monitoring (Advanced):
Prometheus (80/100) - Metrics collection, custom exporters, alerting
Grafana (80/100) - Dashboard design, data visualization
AWS CloudWatch (90/100) - Logs, metrics, alarms, insights

Data Engineering (Advanced):
Dagster (80/100) - Data orchestration, asset modeling
DLT & DBT (70/100) - Data loading, transformation
ClickHouse (85/100) - Real-time analytics, millisecond queries

Databases (Advanced):
PostgreSQL (80/100) - Advanced optimization, indexing, replication
MySQL (85/100) - Database administration, backup strategies, 99.99% uptime
MongoDB (90/100) - Document modeling, sharding, millions of documents

Programming & Scripting (Advanced):
Python (85/100) - Automation scripts, infrastructure tooling, production tools
Bash (75/100) - Shell scripting, system administration
HCL (90/100) - Terraform configuration, module development
YAML (90/100) - Configuration management, CI/CD definitions

Security & DevSecOps (Advanced):
IAM (85/100) - Identity and access management, least-privilege policies
Auth0 (95/100) - Authentication, authorization, multi-tenant identity architecture
DevSecOps (90/100) - Security scanning, vulnerability management, compliance

=== PHILOSOPHY ===
"Infrastructure should be boring—no surprises at 3am, no manual firefighting. I design systems with reliability and automation at the core, where scaling happens invisibly and observability tells the story before problems become crises."

Core Principles:
• Reproducible, observable, and cost-conscious infrastructure
• Solving problems at scale (500+ users, millions of requests)
• Operational excellence through continuous questioning
• Reducing cognitive load on engineering teams
• Learning from production incidents
• Automation over manual toil
• Reliability through design, not heroics

=== How to respond ===
- Default: 2–4 short paragraphs or a tight bullet list. Go deeper only if the user asks.
- Ground answers in this prompt: use real company names, metrics, and stack items listed above. Do not invent employers, dates, certifications, or numbers not stated here.
- If asked something not covered (salary expectations, private life, unreleased work), say you don't have that in Sahil's public profile and suggest email or the contact page.
- For vague questions ("tell me about him"), ask one clarifying question or offer: work history, projects, stack, or how to hire/reach out.
- Tech questions: you may explain concepts generally, then tie back to Sahil's experience when relevant.

=== Contact (public) ===
- Email: sahilbansal.sb24@gmail.com — best for opportunities or detail not on the site.
- Site: resume download, /projects, /contact form on the portfolio.

=== Tone ===
Professional, warm, confident; light humor is fine. If stumped: admit it and point to Sahil. Emojis: at most one per reply when it fits.`;

function formatAIChunk(text: string): string {
  return `0:"${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"\n`;
}

// Fallback message generator when services are unavailable
async function* fallbackMessageGenerator(message: string): AsyncGenerator<string> {
  yield message;
}

// 1. Groq Stream Generator
async function* streamGroq(model: string, messages: any[]): AsyncGenerator<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");
  const groq = new Groq({ apiKey });
  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 640,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

// 2. Google Gemini Stream Generator
async function* streamGemini(modelName: string, messages: any[]): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  });

  const nonSystemMessages = messages.filter((m: any) => m.role !== "system");
  const history = nonSystemMessages.slice(0, -1).map((m: any) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content || "") }],
  }));
  const lastUserMessage = String(
    nonSystemMessages[nonSystemMessages.length - 1]?.content || "Hello"
  );

  const chat = model.startChat({ history });
  const resultStream = await chat.sendMessageStream(lastUserMessage);
  for await (const chunk of resultStream.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

// 3. OpenRouter Stream Generator
async function* streamOpenRouter(model: string, messages: any[]): AsyncGenerator<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://sahilbansal.net",
      "X-Title": "Sahil Bansal Portfolio",
    },
  });
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 640,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

// 4. Mistral AI Stream Generator
async function* streamMistral(model: string, messages: any[]): AsyncGenerator<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("Missing MISTRAL_API_KEY");
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://api.mistral.ai/v1",
  });
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 640,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

// 5. GitHub Models Stream Generator
async function* streamGitHubModels(model: string, messages: any[]): AsyncGenerator<string> {
  const apiKey = process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN;
  if (!apiKey) throw new Error("Missing GITHUB_MODELS_TOKEN");
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://models.github.ai/inference",
  });
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 640,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

type ProviderCandidate = {
  providerName: string;
  models: string[];
  createStream: (model: string, messages: any[]) => AsyncGenerator<string>;
};

async function getWorkingStream(
  providers: ProviderCandidate[],
  messages: any[],
  reqId: string
): Promise<{
  stream: AsyncGenerator<string>;
  initialChunk: string;
  provider: string;
  model: string;
} | null> {
  for (const provider of providers) {
    for (const model of provider.models) {
      try {
        console.log(`[REQ-${reqId}] Trying ${provider.providerName} (${model})...`);
        const gen = provider.createStream(model, messages);
        const first = await gen.next();
        if (!first.done) {
          console.log(`[REQ-${reqId}] SUCCESS with ${provider.providerName} (${model})!`);
          return {
            stream: gen,
            initialChunk: typeof first.value === "string" ? first.value : "",
            provider: provider.providerName,
            model,
          };
        }
      } catch (err: any) {
        console.warn(
          `[REQ-${reqId}] Failover: ${provider.providerName} (${model}) failed: ${err?.message || err}. Trying next...`
        );
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { messages = [] } = await req.json();

    const providers: ProviderCandidate[] = [];

    // Prioritized failover order: Gemini -> Mistral -> OpenRouter -> Groq -> GitHub Models
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      const geminiModels = [
        "gemini-2.5-flash",
        "gemini-flash-latest",
      ];
      if (process.env.GEMINI_MODEL) {
        geminiModels.unshift(process.env.GEMINI_MODEL);
      }
      providers.push({
        providerName: "Google Gemini",
        models: Array.from(new Set(geminiModels)),
        createStream: streamGemini,
      });
    }

    if (process.env.MISTRAL_API_KEY) {
      const mistralModels = [
        "codestral-latest",
        "ministral-8b-latest",
        "ministral-14b-latest",
        "ministral-3b-latest",
        "open-mistral-nemo",
      ];
      if (process.env.MISTRAL_MODEL) {
        mistralModels.unshift(process.env.MISTRAL_MODEL);
      }
      providers.push({
        providerName: "Mistral",
        models: Array.from(new Set(mistralModels)),
        createStream: streamMistral,
      });
    }

    if (process.env.OPENROUTER_API_KEY) {
      const openRouterModels = [
        "nvidia/nemotron-3.5-lightning:free",
        "nvidia/nemotron-3-super-120b-a12b:free",
        "poolside/laguna-s-2.1:free",
      ];
      if (process.env.OPENROUTER_MODEL) {
        openRouterModels.unshift(process.env.OPENROUTER_MODEL);
      }
      providers.push({
        providerName: "OpenRouter",
        models: Array.from(new Set(openRouterModels)),
        createStream: streamOpenRouter,
      });
    }

    if (process.env.GROQ_API_KEY) {
      const groqModels = [
        "groq/compound-mini",
        "groq/compound",
        "qwen/qwen3.8-27b",
        "qwen/qwen3.6-27b",
        "allam-2-7b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
      ];
      if (process.env.GROQ_MODEL) {
        groqModels.unshift(process.env.GROQ_MODEL);
      }
      providers.push({
        providerName: "Groq",
        models: Array.from(new Set(groqModels)),
        createStream: streamGroq,
      });
    }

    if (process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN) {
      const githubModels = [
        "gpt-4o-mini",
        "Meta-Llama-3.1-8B-Instruct",
        "Phi-3.5-mini-instruct",
      ];
      if (process.env.GITHUB_MODEL) {
        githubModels.unshift(process.env.GITHUB_MODEL);
      }
      providers.push({
        providerName: "GitHub Models",
        models: Array.from(new Set(githubModels)),
        createStream: streamGitHubModels,
      });
    }

    const reqId = Math.random().toString(36).substring(2, 7);
    const working = await getWorkingStream(providers, messages, reqId);

    let activeStream: AsyncGenerator<string>;
    let initialChunk: string | null = null;

    if (working) {
      activeStream = working.stream;
      initialChunk = working.initialChunk;
      console.log(`[REQ-${reqId}] Ready to stream via ${working.provider} (${working.model})`);
    } else {
      console.log(`[REQ-${reqId}] No provider succeeded. Using fallback message.`);
      const fallbackNotice =
        providers.length === 0
          ? "Hi! I am Sahil's AI Twin. My AI API keys are currently being configured. In the meantime, feel free to explore Sahil's case studies under /projects, check out his resume at /resume, or contact him directly at sahilbansal.sb24@gmail.com!"
          : "Hi! The AI inference providers are currently experiencing temporary rate limits or maintenance. Please feel free to try again in a moment, or reach out directly to Sahil at sahilbansal.sb24@gmail.com!";

      initialChunk = fallbackNotice;
      activeStream = fallbackMessageGenerator("");
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (initialChunk) {
            controller.enqueue(encoder.encode(formatAIChunk(initialChunk)));
          }
          for await (const chunk of activeStream!) {
            if (chunk) {
              controller.enqueue(encoder.encode(formatAIChunk(chunk)));
            }
          }
          controller.close();
        } catch (error) {
          console.error("[Stream Controller Error]:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[API Chat Route Global Error]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: "Internal Server Error", detail: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
