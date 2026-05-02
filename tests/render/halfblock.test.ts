import { describe, it, expect } from "vitest";
import { renderSprite } from "../../src/render/halfblock.js";
import type { Sprite } from "../../src/pets/types.js";

describe("renderSprite", () => {
  it("renders a 2-pixel-tall solid block as one half-block character", () => {
    const sprite: Sprite = {
      pixels: [
        [1],
        [1],
      ],
      palette: { 1: [255, 0, 0] },
    };
    const out = renderSprite(sprite);
    expect(out).toContain("▀");
    expect(out).toContain("\x1b[38;2;255;0;0m");
    expect(out).toContain("\x1b[48;2;255;0;0m");
  });

  it("renders transparent top and colored bottom as ▄ with bg color and black fg", () => {
    const sprite: Sprite = {
      pixels: [
        [0],
        [2],
      ],
      palette: { 2: [0, 255, 0] },
    };
    const out = renderSprite(sprite);
    expect(out).toContain("▄");
    expect(out).toContain("\x1b[48;2;0;255;0m");
  });

  it("renders fully transparent as a space", () => {
    const sprite: Sprite = {
      pixels: [[0], [0]],
      palette: {},
    };
    const out = renderSprite(sprite);
    expect(out).toBe(" \n");
  });

  it("ends each row with a newline", () => {
    const sprite: Sprite = {
      pixels: [
        [1, 1],
        [1, 1],
      ],
      palette: { 1: [128, 128, 128] },
    };
    const out = renderSprite(sprite);
    expect(out.endsWith("\n")).toBe(true);
  });
});
