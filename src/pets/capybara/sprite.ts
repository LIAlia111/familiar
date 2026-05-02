import type { AnimatedSprite } from "../types.js";
import { idle, palette } from "./sprite-data.js";
import { makeBlink, deriveStretch } from "../sprite-utils.js";

const deriveBlink = makeBlink(5, 4);

function deriveSmile(base: number[][]): number[][] {
  // Find the row that contains the nose (palette index 7) and add a small
  // smile dot on the row directly below it.
  const noseRowIdx = base.findIndex((row) => row.includes(7));
  if (noseRowIdx === -1 || noseRowIdx >= base.length - 1) return base;

  return base.map((row, y) => {
    if (y !== noseRowIdx + 1) return row;
    const next = [...row];
    const center = Math.floor(next.length / 2);
    next[center] = 5;
    return next;
  });
}

export const capybaraLargeSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: deriveBlink(idle), palette },
    { pixels: deriveSmile(idle), palette },
    { pixels: deriveStretch(idle), palette },
  ],
};
