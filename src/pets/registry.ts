import type { Pet, Tier } from "./types.js";
import type { Species } from "../state/types.js";
import { catPet } from "./cat/index.js";
import { capybaraPet } from "./capybara/index.js";
import { dragonPet } from "./dragon/index.js";
import { ghostPet } from "./ghost/index.js";
import { octopusPet } from "./octopus/index.js";
import { pandaPet } from "./panda/index.js";
import { pigPet } from "./pig/index.js";

interface RegistryEntry {
  pet: Pet;
  tier: Tier;
}

const REGISTRY: RegistryEntry[] = [
  { pet: catPet, tier: "free" },
  { pet: capybaraPet, tier: "free" },
  { pet: dragonPet, tier: "sponsor" },
  { pet: ghostPet, tier: "sponsor" },
  { pet: octopusPet, tier: "sponsor" },
  { pet: pandaPet, tier: "sponsor" },
  { pet: pigPet, tier: "sponsor" },
];

// Returns a pet regardless of tier — caller decides whether sponsor pets
// are usable based on activation status.
export function getPet(species: Species): Pet | undefined {
  return REGISTRY.find((e) => e.pet.species === species)?.pet;
}

export function getPetTier(species: Species): Tier | undefined {
  return REGISTRY.find((e) => e.pet.species === species)?.tier;
}

export function listAvailable(opts?: { sponsorUnlocked?: boolean }): Species[] {
  const sponsor = opts?.sponsorUnlocked ?? false;
  return REGISTRY.filter((e) => sponsor || e.tier === "free").map((e) => e.pet.species);
}

export function listAll(): Species[] {
  return REGISTRY.map((e) => e.pet.species);
}
