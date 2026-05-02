import Anthropic from "@anthropic-ai/sdk";
import type { PersonalityProfile } from "../pets/types.js";
import type { MemoryContext } from "../memory/backend.js";

let cached: Anthropic | null = null;

function client(): Anthropic {
  if (!cached) {
    cached = new Anthropic();
  }
  return cached;
}

export interface SpeakRequest {
  personality: PersonalityProfile;
  context: MemoryContext;
  trigger: string;
  petName: string;
  affection: number;
}

export async function callBrain(req: SpeakRequest): Promise<string> {
  const c = client();
  const resp = await c.messages.create({
    model: process.env.FAMILIAR_MODEL ?? "claude-sonnet-4-6",
    max_tokens: 80,
    system: req.personality.systemPrompt,
    messages: [
      {
        role: "user",
        content: `Pet name: ${req.petName}
Affection: ${req.affection}/100
Trigger: ${req.trigger}
Project context: ${req.context.projectSummary || "(none)"}
User notes: ${req.context.userPreferences.join("\n") || "(none)"}

Reply in Chinese, 1–2 sentences max, in character.`,
      },
    ],
  });
  const text = resp.content
    .filter((b) => b.type === "text")
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
  return text.trim();
}
