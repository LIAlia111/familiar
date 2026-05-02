import { loadState } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { pickFrameIndex } from "./frames.js";
import { affectionLabel } from "../state/affection.js";
import { SPECIES_ICON } from "../util/constants.js";

function heartBar(affection: number): string {
  const filled = Math.min(5, Math.floor(affection / 20));
  return "♥".repeat(filled) + "♡".repeat(5 - filled);
}

function main(): void {
  const state = loadState();
  if (!state) {
    process.stdout.write("[familiar not set up — run: npx familiar install]\n");
    return;
  }
  const pet = getPet(state.species);
  if (!pet) {
    process.stdout.write("[familiar pet missing]\n");
    return;
  }

  const icon = SPECIES_ICON[state.species] ?? "🐾";
  // Frame index drives a subtle blink suffix; full sprite animation is in /pet.
  const blinkSuffix = pickFrameIndex(pet.small) % 2 === 1 ? "·" : "";
  process.stdout.write(
    `${icon} ${state.name}${blinkSuffix}  ${heartBar(state.affection)} · ${affectionLabel(state.affection)}`,
  );
}

try {
  main();
} catch (e) {
  process.stdout.write(`[familiar error: ${(e as Error).message}]`);
}
