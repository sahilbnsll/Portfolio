import Groq from "groq-sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/ai-prompt";

export const runtime = "nodejs";

function formatAIChunk(text: string): string {
  return `0:"${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"\n`;
}

// Fallback message generator when services are unavailable
async function* fallbackMessageGenerator(message: string): AsyncGenerator<string> {
  yield message;
}

// Helper: sanitizes message history for clean LLM conversational memory
function sanitizeMessagesForLLM(messages: any[]): { role: "user" | "assistant"; content: string }[] {
  // Retain the last 10 messages for focused multi-turn context
  const sliced = messages.slice(-10);
  const cleaned: { role: "user" | "assistant"; content: string }[] = [];

  for (const m of sliced) {
    if (!m || !m.content) continue;
    const role: "user" | "assistant" = m.role === "assistant" ? "assistant" : "user";
    // Strip action tokens so previous internal directives don't clutter the LLM context
    const cleanContent = String(m.content)
      .replace(/<<<ACTION:[\s\S]*?>>>/g, "")
      .trim();

    if (!cleanContent) continue;

    // Merge consecutive messages with the same role
    if (cleaned.length > 0 && cleaned[cleaned.length - 1].role === role) {
      cleaned[cleaned.length - 1].content += `\n${cleanContent}`;
    } else {
      cleaned.push({ role, content: cleanContent });
    }
  }

  // Ensure conversation strictly starts with a user message
  while (cleaned.length > 0 && cleaned[0].role !== "user") {
    cleaned.shift();
  }

  return cleaned;
}

// 1. Groq Stream Generator
async function* streamGroq(model: string, messages: any[], systemPrompt: string): AsyncGenerator<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");
  const groq = new Groq({ apiKey });
  const sanitized = sanitizeMessagesForLLM(messages);
  const response = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...sanitized,
    ],
    stream: true,
    temperature: 0.6,
    max_tokens: 1000,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

// 2. Google Gemini Stream Generator
async function* streamGemini(modelName: string, messages: any[], systemPrompt: string): AsyncGenerator<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 1000,
    },
  });

  const sanitized = sanitizeMessagesForLLM(messages);
  if (sanitized.length === 0) {
    sanitized.push({ role: "user", content: "Hello" });
  }

  // Pop the final user prompt to send via sendMessageStream
  const lastUser = sanitized.pop()!;
  const history = sanitized.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const resultStream = await chat.sendMessageStream(lastUser.content);
  for await (const chunk of resultStream.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

// 3. OpenRouter Stream Generator
async function* streamOpenRouter(model: string, messages: any[], systemPrompt: string): AsyncGenerator<string> {
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
  const sanitized = sanitizeMessagesForLLM(messages);
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...sanitized,
    ],
    stream: true,
    temperature: 0.6,
    max_tokens: 1000,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

// 4. Mistral AI Stream Generator
async function* streamMistral(model: string, messages: any[], systemPrompt: string): AsyncGenerator<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("Missing MISTRAL_API_KEY");
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://api.mistral.ai/v1",
  });
  const sanitized = sanitizeMessagesForLLM(messages);
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...sanitized,
    ],
    stream: true,
    temperature: 0.6,
    max_tokens: 1000,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

// 5. GitHub Models Stream Generator
async function* streamGitHubModels(model: string, messages: any[], systemPrompt: string): AsyncGenerator<string> {
  const apiKey = process.env.GITHUB_MODELS_TOKEN || process.env.GITHUB_TOKEN;
  if (!apiKey) throw new Error("Missing GITHUB_MODELS_TOKEN");
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://models.github.ai/inference",
  });
  const sanitized = sanitizeMessagesForLLM(messages);
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...sanitized,
    ],
    stream: true,
    temperature: 0.6,
    max_tokens: 1000,
  });
  for await (const chunk of response) {
    const text = chunk.choices[0]?.delta?.content || "";
    if (text) yield text;
  }
}

type ProviderCandidate = {
  providerName: string;
  models: string[];
  createStream: (model: string, messages: any[], systemPrompt: string) => AsyncGenerator<string>;
};

async function getWorkingStream(
  providers: ProviderCandidate[],
  messages: any[],
  systemPrompt: string,
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
        const gen = provider.createStream(model, messages, systemPrompt);
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
    const systemPrompt = buildSystemPrompt();

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
    const working = await getWorkingStream(providers, messages, systemPrompt, reqId);

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
          ? "Hi! I am Sahil's AI Twin. My inference keys are currently being initialized. In the meantime, you can explore Sahil's case studies, download his resume, or send an inquiry directly to his inbox at connect@sahilbansal.net!\n\n<<<ACTION:{\"type\":\"download_resume\",\"label\":\"Download Resume (PDF)\"}>>>\n<<<ACTION:{\"type\":\"view_mode\",\"mode\":\"recruiter\",\"label\":\"Switch to Recruiter View\"}>>>\n<<<ACTION:{\"type\":\"hire_inquiry\",\"company\":\"\",\"role\":\"\"}>>>"
          : "Hi! The AI inference providers are currently experiencing temporary rate limits. In the meantime, feel free to explore Sahil's case studies, download his resume, or reach out directly to Sahil at connect@sahilbansal.net!\n\n<<<ACTION:{\"type\":\"download_resume\",\"label\":\"Download Resume (PDF)\"}>>>\n<<<ACTION:{\"type\":\"hire_inquiry\",\"company\":\"\",\"role\":\"\"}>>>";

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
          try {
            controller.enqueue(
              encoder.encode(
                formatAIChunk(
                  "\n\n*The response was interrupted due to a temporary provider rate limit. Feel free to re-ask or reach out directly to connect@sahilbansal.net.*"
                )
              )
            );
            controller.close();
          } catch (_) {}
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
