import { pickTemplate } from "./templates.js";
import { callBrain } from "./client.js";
import type { PersonalityProfile, TemplateKey } from "../pets/types.js";
import type { MemoryContext } from "../memory/backend.js";

export interface SpeakOpts {
  personality: PersonalityProfile;
  templateKey: TemplateKey;
  trigger: string;
  petName: string;
  affection: number;
  recentQuotes: string[];
  context: MemoryContext;
  useApi: boolean;
}

export async function speak(opts: SpeakOpts): Promise<string> {
  if (!opts.useApi) {
    return pickTemplate(opts.personality, opts.templateKey, opts.recentQuotes);
  }
  try {
    return await callBrain({
      personality: opts.personality,
      context: opts.context,
      trigger: opts.trigger,
      petName: opts.petName,
      affection: opts.affection,
    });
  } catch {
    return pickTemplate(opts.personality, opts.templateKey, opts.recentQuotes);
  }
}
