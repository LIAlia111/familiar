#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { loadState } from "../state/store.js";
import { getPet } from "../pets/registry.js";
import { renderSprite } from "../render/halfblock.js";
import { pickFrameIndex } from "./frames.js";
import { affectionLabel } from "../state/affection.js";
import { parseSessionInput } from "../util/claude-code.js";

function heartBar(affection: number): string {
  const filled = Math.min(5, Math.floor(affection / 20));
  return "♥".repeat(filled) + "♡".repeat(5 - filled);
}

function readStdin(): string {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

async function main(): Promise<void> {
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

  // Read Claude Code session info (currently unused but available for future state)
  parseSessionInput(readStdin());

  const frameIdx = pickFrameIndex(pet.small);
  // Statusline is one line — flatten the small sprite to a single emoji-like icon.
  // For now use a species emoji as the visible icon; full pixel icon shows in /pet.
  const speciesIcon: Record<string, string> = {
    cat: "🐱",
    capybara: "🦫",
    dragon: "🐉",
    ghost: "👻",
    octopus: "🦑",
    panda: "🐼",
    pig: "🐷",
  };
  const icon = speciesIcon[state.species] ?? "🐾";
  // Frame index is reserved for future statusline animation (e.g. blink suffix).
  const blinkSuffix = frameIdx % 2 === 1 ? "·" : "";
  const line = `${icon} ${state.name}${blinkSuffix}  ${heartBar(state.affection)} · ${affectionLabel(state.affection)}`;
  process.stdout.write(line);
}

main().catch((e) => {
  process.stdout.write(`[familiar error: ${(e as Error).message}]`);
});
