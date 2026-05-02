import { describe, it, expect } from "vitest";
import { getPet, listAvailable } from "../../src/pets/registry.js";

describe("pet registry", () => {
  it("returns cat by species key", () => {
    const cat = getPet("cat");
    expect(cat?.species).toBe("cat");
    expect(cat?.personality.defaultName).toBe("mimi");
  });

  it("returns capybara by species key", () => {
    const k = getPet("capybara");
    expect(k?.species).toBe("capybara");
  });

  it("lists free species when sponsor not unlocked", () => {
    const list = listAvailable({ sponsorUnlocked: false });
    expect(list).toEqual(["cat", "capybara"]);
  });

  it("lists all 7 species when sponsor unlocked", () => {
    const list = listAvailable({ sponsorUnlocked: true });
    expect(list).toContain("dragon");
    expect(list).toContain("ghost");
    expect(list.length).toBe(7);
  });

  it("getPet returns sponsor pets too (caller gates on tier)", () => {
    expect(getPet("dragon")).toBeDefined();
  });
});
