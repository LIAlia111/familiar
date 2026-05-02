import type { PersonalityProfile, TemplateKey } from "../pets/types.js";

export function pickTemplate(
  personality: PersonalityProfile,
  key: TemplateKey,
  recentQuotes: string[],
): string {
  const candidates = personality.templates[key];
  const fresh = candidates.filter((c) => !recentQuotes.includes(c));
  const pool = fresh.length > 0 ? fresh : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}
