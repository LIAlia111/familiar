import { describe, it, expect } from "vitest";
import { ensureCurrentSchema, migrateV1ToV2 } from "../../src/state/migrate.js";

describe("schema migration", () => {
  const v1 = {
    schemaVersion: 1 as const,
    species: "cat" as const,
    name: "mimi",
    variantId: "tuxedo",
    affection: 50,
    mood: "content" as const,
    createdAt: "2026-05-01T00:00:00.000Z",
    lastInteractionAt: "2026-05-02T10:00:00.000Z",
    totalInteractions: 12,
    recentQuotes: ["..."],
    cooldowns: {},
  };

  it("migrates v1 to v2", () => {
    const v2 = migrateV1ToV2(v1);
    expect(v2.schemaVersion).toBe(2);
    expect(v2.activeSpecies).toBe("cat");
    expect(v2.pets.cat?.name).toBe("mimi");
    expect(v2.pets.cat?.affection).toBe(50);
    expect(v2.pets.cat?.variantId).toBe("tuxedo");
  });

  it("v2 unlockedSpecies always contains starter pair", () => {
    const v2 = migrateV1ToV2(v1);
    expect(v2.unlockedSpecies).toContain("cat");
    expect(v2.unlockedSpecies).toContain("capybara");
  });

  it("ensureCurrentSchema passes v2 through unchanged", () => {
    const v2 = { schemaVersion: 2, activeSpecies: "cat", pets: {}, unlockedSpecies: ["cat"] };
    expect(ensureCurrentSchema(v2)).toEqual(v2);
  });

  it("ensureCurrentSchema returns null for unknown schema", () => {
    expect(ensureCurrentSchema({ schemaVersion: 99 })).toBeNull();
    expect(ensureCurrentSchema(null)).toBeNull();
    expect(ensureCurrentSchema("string")).toBeNull();
  });
});
