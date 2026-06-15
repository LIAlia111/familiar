import Anthropic from "@anthropic-ai/sdk";
import { spawn } from "node:child_process";
import type { PersonalityProfile } from "../pets/types.js";
import type { MemoryContext } from "../memory/backend.js";
import { DEFAULT_MODEL } from "../util/constants.js";

export interface SpeakRequest {
  personality: PersonalityProfile;
  context: MemoryContext;
  trigger: string;
  petName: string;
  affection: number;
}

// Two ways the pet can think:
//   - "cli"  → spawn `claude -p` and reuse the user's Claude Code login.
//             No API key needed; works on any plan including Max.
//   - "api"  → call the Anthropic SDK directly with ANTHROPIC_API_KEY.
//   - "template" → skip the LLM entirely, force speak() to fall back to
//                  the personality's template lines.
// Default is "cli" because anyone using this package is already running
// Claude Code, which means `claude` is on PATH.
type BrainMode = "cli" | "api" | "template";
const CLI_TIMEOUT_MS = 30_000;

function buildPrompt(req: SpeakRequest): string {
  const userNotes = req.context.userPreferences.join("\n").trim();
  return `${req.personality.systemPrompt}

Pet name: ${req.petName}
Affection: ${req.affection}/100
Trigger: ${req.trigger}
Project context:
${req.context.projectSummary || "(none)"}

User notes:
${userNotes || "(none)"}

Reply in Chinese, 1–2 short sentences, fully in character. Output only the spoken line, no preamble, no quotes, no markdown.`;
}

function callBrainCli(req: SpeakRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("claude", ["-p", buildPrompt(req)], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      proc.kill("SIGTERM");
      reject(new Error("claude cli timeout"));
    }, CLI_TIMEOUT_MS);
    proc.stdout.on("data", (d) => {
      out += d.toString();
    });
    proc.stderr.on("data", (d) => {
      err += d.toString();
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`claude cli exit ${code}: ${err.slice(0, 200)}`));
        return;
      }
      const cleaned = out.trim().replace(/^["「『]|["」』]$/g, "").trim();
      if (!cleaned) reject(new Error("claude cli empty output"));
      else resolve(cleaned);
    });
  });
}

let cachedSdk: Anthropic | null = null;
function sdk(): Anthropic {
  if (!cachedSdk) cachedSdk = new Anthropic();
  return cachedSdk;
}

async function callBrainApi(req: SpeakRequest): Promise<string> {
  const c = sdk();
  const resp = await c.messages.create({
    model: process.env.FAMILIAR_MODEL ?? DEFAULT_MODEL,
    max_tokens: 80,
    system: req.personality.systemPrompt,
    messages: [
      {
        role: "user",
        content: buildPrompt(req).slice(req.personality.systemPrompt.length).trim(),
      },
    ],
  });
  return resp.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("")
    .trim();
}

// Fallback to any OpenAI-compatible API when the primary brain fails.
// Env vars:
//   FAMILIAR_FALLBACK_API_KEY   — required to activate fallback
//   FAMILIAR_FALLBACK_BASE_URL  — default: https://api.openai.com/v1
//                                  DashScope: https://dashscope.aliyuncs.com/compatible-mode/v1
//   FAMILIAR_FALLBACK_MODEL     — default: gpt-4o-mini  (DashScope: qwen-turbo)
async function callBrainFallback(req: SpeakRequest): Promise<string> {
  const apiKey = process.env.FAMILIAR_FALLBACK_API_KEY;
  if (!apiKey) throw new Error("FAMILIAR_FALLBACK_API_KEY not set");

  const baseUrl =
    process.env.FAMILIAR_FALLBACK_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.FAMILIAR_FALLBACK_MODEL ?? "gpt-4o-mini";

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 80,
      messages: [
        { role: "system", content: req.personality.systemPrompt },
        {
          role: "user",
          content: buildPrompt(req)
            .slice(req.personality.systemPrompt.length)
            .trim(),
        },
      ],
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(
      `fallback API error ${resp.status}: ${body.slice(0, 120)}`
    );
  }

  type OAIResponse = { choices: Array<{ message: { content: string } }> };
  const data = (await resp.json()) as OAIResponse;
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("fallback empty response");
  return text;
}

export async function callBrain(req: SpeakRequest): Promise<string> {
  const mode = (process.env.FAMILIAR_BRAIN ?? "cli") as BrainMode;

  // "template" explicitly disables the LLM — skip fallback too.
  if (mode !== "cli" && mode !== "api") {
    throw new Error(`brain disabled (FAMILIAR_BRAIN=${mode})`);
  }

  try {
    return await (mode === "cli" ? callBrainCli(req) : callBrainApi(req));
  } catch (primaryErr) {
    // If a fallback key is configured, try an OpenAI-compatible provider.
    if (process.env.FAMILIAR_FALLBACK_API_KEY) {
      try {
        return await callBrainFallback(req);
      } catch {
        // Both failed — fall through and throw the original error.
      }
    }
    throw primaryErr;
  }
}
