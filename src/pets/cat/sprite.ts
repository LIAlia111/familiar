import type { AnimatedSprite } from "../types.js";
import { idle, palette } from "./sprite-data.js";

const EYE_VALUE = 4;
const EYE_REPLACE = 2;

function deriveBlink(base: number[][]): number[][] {
  return base.map((row) =>
    row.map((px) => (px === EYE_VALUE ? EYE_REPLACE : px)),
  );
}

function deriveSmile(base: number[][]): number[][] {
  return base.map((row) => {
    const idx = row.indexOf(6);
    if (idx === -1) return row;
    const next = [...row];
    if (idx > 0) next[idx - 1] = 6;
    if (idx < row.length - 1) next[idx + 1] = 6;
    return next;
  });
}

function deriveStretch(base: number[][]): number[][] {
  return [base[0], ...base.slice(0, base.length - 1)];
}

const blink = deriveBlink(idle);
const smile = deriveSmile(idle);
const stretch = deriveStretch(idle);

export const catLargeSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
    { pixels: smile, palette },
    { pixels: stretch, palette },
  ],
};
