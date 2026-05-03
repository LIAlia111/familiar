import { describe, it, expect } from "vitest";
import { pickTemplate } from "../../src/brain/templates.js";
import { catPersonality } from "../../src/pets/cat/personality.js";

describe("pickTemplate", () => {
  it("returns one of the templates for the requested key", () => {
    const result = pickTemplate(catPersonality, "feed", []);
    expect(catPersonality.templates.feed).toContain(result);
  });

  it("avoids repeating recent quotes when possible", () => {
    const t = catPersonality.templates.feed;
    const result = pickTemplate(catPersonality, "feed", [t[0]]);
    expect(t).toContain(result);
    expect(result).not.toBe(t[0]);
  });

  it("falls through to any template when all are in recents", () => {
    const t = catPersonality.templates.feed;
    const result = pickTemplate(catPersonality, "feed", t);
    expect(t).toContain(result);
  });
});
