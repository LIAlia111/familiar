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

  it("lists all available species (free tier = cat + capybara)", () => {
    const list = listAvailable();
    expect(list).toEqual(["cat", "capybara"]);
  });

  it("returns undefined for unknown species", () => {
    expect(getPet("dragon")).toBeUndefined();
  });
});
