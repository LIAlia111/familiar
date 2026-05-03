import { loadState, getActivePet } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { affectionLabel } from "../state/affection.js";
import { SPECIES_ICON } from "../util/constants.js";
import { resolveVariant } from "../pets/variant-render.js";

function heartBar(affection: number): string {
  const filled = Math.min(5, Math.floor(affection / 20));
  return "♥".repeat(filled) + "♡".repeat(5 - filled);
}

function main(): void {
  const state = loadState();
  if (!state) {
    process.stdout.write("[familiar not set up — run: npx claude-familiar install]\n");
    return;
  }
  const active = getActivePet(state);
  const pet = getPet(state.activeSpecies);
  if (!active || !pet) {
    process.stdout.write("[familiar pet missing]\n");
    return;
  }

  resolveVariant(pet, active.variantId);
  const icon = SPECIES_ICON[state.activeSpecies] ?? "🐾";
  const text = pickBubble(pet, active);
  const bubble = text ? `  💭 ${truncate(text, 40)}` : "";
  process.stdout.write(
    `${icon} ${active.name} Lv.${active.affection}  ${heartBar(active.affection)} · ${affectionLabel(active.affection)}${bubble}`,
  );
}

// Statusline speech bubble. For the first 20s after the pet speaks the
// bubble shows that quote; after that it falls through to a rotating
// ambient line (also 20s per slot), so the pet feels alive even when
// idle. Pure function of clock + state — no extra writes.
const STICKY_QUOTE_MS = 20_000;
const AMBIENT_ROTATION_MS = 20_000;
function pickBubble(
  pet: ReturnType<typeof getPet> & object,
  active: { recentQuotes: string[]; lastInteractionAt: string },
): string {
  const last = active.recentQuotes[0];
  const age = Date.now() - new Date(active.lastInteractionAt).getTime();
  if (last && age < STICKY_QUOTE_MS) return last;
  const ambient = pet.personality.templates.ambient_random ?? [];
  if (ambient.length === 0) return last ?? "";
  const bucket = Math.floor(Date.now() / AMBIENT_ROTATION_MS);
  return ambient[bucket % ambient.length];
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

try {
  main();
} catch (e) {
  process.stdout.write(`[familiar error: ${(e as Error).message}]`);
}
