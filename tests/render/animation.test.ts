import { describe, it, expect } from "vitest";
import { playAnimation } from "../../src/render/animation.js";
import type { AnimatedSprite } from "../../src/pets/types.js";

describe("playAnimation", () => {
  it("renders frames in sequence and ends on the final frame", async () => {
    const writes: string[] = [];
    const fakeOut = { write: (s: string) => writes.push(s) } as unknown as NodeJS.WriteStream;

    const sprite: AnimatedSprite = {
      frames: [
        { pixels: [[1], [1]], palette: { 1: [255, 0, 0] } },
        { pixels: [[2], [2]], palette: { 2: [0, 255, 0] } },
      ],
    };

    await playAnimation({
      sprite,
      finalFrameIndex: 1,
      cycles: 2,
      frameDelayMs: 1,
      out: fakeOut,
    });

    expect(writes.length).toBeGreaterThanOrEqual(2 * 2 + 1);
    expect(writes[writes.length - 1]).toContain("0;255;0");
  });

  it("handles single-frame sprites without crashing", async () => {
    const writes: string[] = [];
    const fakeOut = { write: (s: string) => writes.push(s) } as unknown as NodeJS.WriteStream;
    const sprite: AnimatedSprite = {
      frames: [{ pixels: [[1], [1]], palette: { 1: [128, 128, 128] } }],
    };
    await playAnimation({ sprite, finalFrameIndex: 0, cycles: 1, frameDelayMs: 1, out: fakeOut });
    expect(writes.length).toBeGreaterThan(0);
  });
});
