import type { PetState, PetStateV1, Species } from "./types.js";

const FREE_STARTER_SPECIES: Species[] = ["cat", "capybara"];

export function migrateV1ToV2(v1: PetStateV1): PetState {
  return {
    schemaVersion: 2,
    activeSpecies: v1.species,
    unlockedSpecies: dedupe([v1.species, ...FREE_STARTER_SPECIES]),
    pets: {
      [v1.species]: {
        name: v1.name,
        variantId: v1.variantId,
        affection: v1.affection,
        mood: v1.mood,
        createdAt: v1.createdAt,
        lastInteractionAt: v1.lastInteractionAt,
        totalInteractions: v1.totalInteractions,
        recentQuotes: v1.recentQuotes,
        cooldowns: {}, // v1 cooldowns used ISO strings; drop them — small cost
      },
    },
  };
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// Inspects a parsed JSON object and migrates to current schema.
// Returns null on schema version we can't recognize.
export function ensureCurrentSchema(raw: unknown): PetState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const v = raw as { schemaVersion?: number };
  if (v.schemaVersion === 2) return raw as PetState;
  if (v.schemaVersion === 1) return migrateV1ToV2(raw as PetStateV1);
  return null;
}
