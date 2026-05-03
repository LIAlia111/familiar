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

export async function callBrain(req: SpeakRequest): Promise<string> {
  const mode = (process.env.FAMILIAR_BRAIN ?? "cli") as BrainMode;
  if (mode === "cli") return callBrainCli(req);
  if (mode === "api") return callBrainApi(req);
  // "template" or unknown → throw so speak() falls back to canned lines.
  throw new Error(`brain disabled (FAMILIAR_BRAIN=${mode})`);
}
