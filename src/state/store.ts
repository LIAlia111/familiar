import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { familiarHome, stateFile } from "../util/paths.js";
import { atomicWrite } from "../util/safe-write.js";
import { ensureCurrentSchema } from "./migrate.js";
import { sanitizeState } from "./sanitize.js";
import type { PetEntry, PetState, Species } from "./types.js";

export function loadState(): PetState | null {
  try {
    const raw = JSON.parse(readFileSync(stateFile(), "utf8"));
    const migrated = ensureCurrentSchema(raw);
    if (!migrated) return null;
    if (!isValidV2(migrated)) return null;
    return sanitizeState(migrated);
  } catch {
    return null;
  }
}

function isValidV2(s: PetState): boolean {
  return (
    s.schemaVersion === 2 &&
    typeof s.activeSpecies === "string" &&
    typeof s.pets === "object" &&
    Array.isArray(s.unlockedSpecies)
  );
}

export function saveState(state: PetState): void {
  const home = familiarHome();
  if (!existsSync(home)) mkdirSync(home, { recursive: true, mode: 0o700 });
  atomicWrite(stateFile(), JSON.stringify(state, null, 2), 0o600);
}

export function newPetEntry(opts: { name: string }): PetEntry {
  const now = new Date().toISOString();
  return {
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

// Build the very first state.json. Active species owns the default starter.
export function defaultState(opts: { species: Species; name: string }): PetState {
  return {
    schemaVersion: 2,
    activeSpecies: opts.species,
    unlockedSpecies: ["cat", "capybara"], // free starter pair
    pets: {
      [opts.species]: newPetEntry({ name: opts.name }),
    },
  };
}

export function getActivePet(state: PetState): PetEntry | undefined {
  return state.pets[state.activeSpecies];
}
