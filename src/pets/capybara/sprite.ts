import type { AnimatedSprite } from "../types.js";
import { idle, palette } from "./sprite-data.js";

const EYE_VALUE = 5;
const EYE_REPLACE = 4;

function deriveBlink(base: number[][]): number[][] {
  return base.map((row) =>
    row.map((px) => (px === EYE_VALUE ? EYE_REPLACE : px)),
  );
}

function deriveSmile(base: number[][]): number[][] {
  return base.map((row, y) => {
    if (!row.includes(7)) return row;
    if (y < base.length - 1 && base[y + 1].some((px) => px === 4)) {
      const next = [...base[y + 1]];
      const center = Math.floor(next.length / 2);
      next[center] = 5;
      return y + 1 < base.length ? next : row;
    }
    return row;
  });
}

function deriveStretch(base: number[][]): number[][] {
  return [base[0], ...base.slice(0, base.length - 1)];
}

export const capybaraLargeSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: deriveBlink(idle), palette },
    { pixels: deriveSmile(idle), palette },
    { pixels: deriveStretch(idle), palette },
  ],
};
