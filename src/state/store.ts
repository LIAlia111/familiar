import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { familiarHome, stateFile } from "../util/paths.js";
import { atomicWrite } from "../util/safe-write.js";
import type { PetState, Species } from "./types.js";

export function loadState(): PetState | null {
  try {
    const parsed = JSON.parse(readFileSync(stateFile(), "utf8")) as PetState;
    if (!isValidState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isValidState(s: unknown): s is PetState {
  if (typeof s !== "object" || s === null) return false;
  const v = s as Record<string, unknown>;
  return (
    v.schemaVersion === 1 &&
    typeof v.species === "string" &&
    typeof v.name === "string" &&
    typeof v.affection === "number" &&
    typeof v.mood === "string" &&
    Array.isArray(v.recentQuotes) &&
    typeof v.totalInteractions === "number"
  );
}

export function saveState(state: PetState): void {
  const home = familiarHome();
  if (!existsSync(home)) mkdirSync(home, { recursive: true, mode: 0o700 });
  atomicWrite(stateFile(), JSON.stringify(state, null, 2), 0o600);
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
