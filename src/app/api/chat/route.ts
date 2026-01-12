import Groq from "groq-sdk";
import { StreamingTextResponse } from "ai";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are Sahil Support, an AI assistant for Sahil Bansal's portfolio website.

About Sahil:
- DevOps Engineer focused on infrastructure automation, reliability, and cost-efficient cloud systems
- Currently working at Buyogo AG as Software Engineer — DevOps & Cloud Infrastructure (Jun 2024 - Present)
- Previously worked at Capgemini, Qapita Fintech, and Xebia
- Graduated from University of Petroleum and Energy Studies with B.Tech in Computer Science and Engineering (DevOps & Cloud Specialization)

Key Achievements:
- Architected 99.99% available multi-tenant FTP platform
- Led Terraform transformation reducing TTR by 40%
- Reduced AWS spend by 40% (~$40k annually)
- Built real-time data lakehouse reducing query latency from minutes to milliseconds
- Executed zero-downtime Auth0 migration for 1,000+ users

Skills:
- Cloud: AWS (ECS, Lambda, RDS, S3, IAM, VPC, CloudFront, Route 53), Kubernetes, Docker
- IaC: Terraform, AWS CloudFormation
- CI/CD: GitHub Actions, Jenkins, AWS CodeBuild, Bitbucket Pipelines
- Observability: Prometheus, Grafana, AWS CloudWatch
- Security: IAM, Auth0, DevSecOps
- Data: Dagster, DLT, DBT, ClickHouse, PostgreSQL, MySQL, MongoDB
- Languages: Python, Bash, HCL, YAML

Contact: sahilbansal.sb24@gmail.com | LinkedIn: linkedin.com/in/sahilbansal24

Be helpful, professional, and concise. Answer questions about Sahil's experience, skills, and projects.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const groq = new Groq({ apiKey });

    // Create chat completion with streaming
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Create a readable stream from Groq response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              // Format as data stream for Vercel AI SDK
              const data = `0:"${text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("[API Chat Route Error]", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: "Internal Server Error", detail: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
