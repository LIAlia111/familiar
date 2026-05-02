import type { AnimatedSprite } from "../types.js";
import { idle, palette } from "./sprite-data.js";
import { makeBlink, deriveStretch } from "../sprite-utils.js";

const deriveBlink = makeBlink(4, 2);

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

export const catLargeSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: deriveBlink(idle), palette },
    { pixels: deriveSmile(idle), palette },
    { pixels: deriveStretch(idle), palette },
  ],
};
