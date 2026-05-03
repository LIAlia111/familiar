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
  const last = active.recentQuotes[0];
  // Cap the speech bubble so a long LLM-generated reply doesn't blow up
  // the statusline width on narrow terminals.
  const bubble = last ? `  💭 ${truncate(last, 40)}` : "";
  process.stdout.write(
    `${icon} ${active.name} Lv.${active.affection}  ${heartBar(active.affection)} · ${affectionLabel(active.affection)}${bubble}`,
  );
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
