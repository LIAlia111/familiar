import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { familiarHome, stateFile } from "../util/paths.js";
import type { PetState, Species } from "./types.js";

export function loadState(): PetState | null {
  try {
    const parsed = JSON.parse(readFileSync(stateFile(), "utf8")) as PetState;
    if (parsed.schemaVersion !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: PetState): void {
  const home = familiarHome();
  if (!existsSync(home)) mkdirSync(home, { recursive: true });
  writeFileSync(stateFile(), JSON.stringify(state, null, 2));
}

export function defaultState(opts: { species: Species; name: string }): PetState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    species: opts.species,
    name: opts.name,
    affection: 20,
    mood: "neutral",
    createdAt: now,
    lastInteractionAt: now,
    totalInteractions: 0,
    recentQuotes: [],
    cooldowns: {},
  };
}
