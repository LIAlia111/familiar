import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { familiarHome, stateFile } from "../util/paths.js";
import type { PetState, Species } from "./types.js";

export function loadState(): PetState | null {
  const path = stateFile();
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as PetState;
}

export function saveState(state: PetState): void {
  const path = stateFile();
  if (!existsSync(familiarHome())) {
    mkdirSync(familiarHome(), { recursive: true });
  }
  writeFileSync(path, JSON.stringify(state, null, 2));
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
