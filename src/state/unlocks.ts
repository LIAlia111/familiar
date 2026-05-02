import type { Pet } from "../pets/types.js";
import type { PetState, Species } from "./types.js";

// Affection thresholds for skin unlocks (index = variant index in pet.variants).
export const SKIN_UNLOCK_LEVELS = [0, 40, 60, 80, 100] as const;

// Returns the set of variant ids the user has access to right now.
// Sponsor flag immediately unlocks all variants (skip the grind).
export function unlockedVariantIds(
  pet: Pet,
  affection: number,
  sponsorUnlocked: boolean,
): Set<string> {
  const out = new Set<string>();
  if (sponsorUnlocked) {
    for (const v of pet.variants) out.add(v.id);
    return out;
  }
  pet.variants.forEach((v, i) => {
    const required = SKIN_UNLOCK_LEVELS[i] ?? 100;
    if (affection >= required) out.add(v.id);
  });
  return out;
}

// How many of the user's pets have hit max affection (≥100).
export function countMaxedPets(state: PetState): number {
  let n = 0;
  for (const sp of Object.keys(state.pets) as Species[]) {
    const p = state.pets[sp];
    if (p && p.affection >= 100) n += 1;
  }
  return n;
}

// How many sponsor pets the user has earned via the grind path.
// Earn 1 sponsor pet per maxed-out pet beyond the starting two.
//   2 maxed → 0 earned (you've maxed your starters; pick one to begin earning)
//   Wait, design says: 2 starters maxed → unlock 1 sponsor pet.
//   3 pets maxed → unlock another, etc.
export function earnedSponsorSlots(state: PetState): number {
  return Math.max(0, countMaxedPets(state) - 1);
}

// True when the user is eligible to claim a new sponsor pet right now.
export function hasUnclaimedSponsorSlot(state: PetState): boolean {
  const earned = earnedSponsorSlots(state);
  const claimed = Math.max(0, state.unlockedSpecies.length - 2);
  return earned > claimed;
}
