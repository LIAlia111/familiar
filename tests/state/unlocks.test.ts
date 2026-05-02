import { describe, it, expect } from "vitest";
import {
  unlockedVariantIds,
  countMaxedPets,
  earnedSponsorSlots,
  hasUnclaimedSponsorSlot,
} from "../../src/state/unlocks.js";
import { catPet } from "../../src/pets/cat/index.js";
import type { PetState } from "../../src/state/types.js";

function mkState(pets: Partial<Record<string, { affection: number }>>): PetState {
  const out: PetState = {
    schemaVersion: 2,
    activeSpecies: "cat",
    pets: {},
    unlockedSpecies: ["cat", "capybara"],
  };
  for (const [sp, v] of Object.entries(pets)) {
    out.pets[sp as keyof typeof out.pets] = {
      name: "x",
      affection: v?.affection ?? 0,
      mood: "neutral",
      createdAt: "2026-01-01",
      lastInteractionAt: "2026-01-01",
      totalInteractions: 0,
      recentQuotes: [],
      cooldowns: {},
    };
  }
  return out;
}

describe("unlocks", () => {
  it("unlocks variant 0 at affection 0", () => {
    const got = unlockedVariantIds(catPet, 0, false);
    expect(got.has(catPet.variants[0].id)).toBe(true);
    expect(got.size).toBe(1);
  });

  it("unlocks variant 1 at affection 40", () => {
    const got = unlockedVariantIds(catPet, 40, false);
    expect(got.size).toBe(2);
  });

  it("unlocks all 5 at affection 100", () => {
    const got = unlockedVariantIds(catPet, 100, false);
    expect(got.size).toBe(5);
  });

  it("sponsor flag unlocks everything regardless of affection", () => {
    const got = unlockedVariantIds(catPet, 0, true);
    expect(got.size).toBe(5);
  });

  it("countMaxedPets counts pets with affection ≥ 100", () => {
    const s = mkState({ cat: { affection: 100 }, capybara: { affection: 50 } });
    expect(countMaxedPets(s)).toBe(1);
  });

  it("2 maxed pets → 1 sponsor slot earned", () => {
    const s = mkState({ cat: { affection: 100 }, capybara: { affection: 100 } });
    expect(earnedSponsorSlots(s)).toBe(1);
  });

  it("hasUnclaimedSponsorSlot true when earned > already-claimed", () => {
    const s = mkState({ cat: { affection: 100 }, capybara: { affection: 100 } });
    expect(hasUnclaimedSponsorSlot(s)).toBe(true);
  });

  it("after claiming, no more unclaimed slots", () => {
    const s = mkState({ cat: { affection: 100 }, capybara: { affection: 100 } });
    s.unlockedSpecies = ["cat", "capybara", "dragon"]; // dragon claimed
    expect(hasUnclaimedSponsorSlot(s)).toBe(false);
  });
});
