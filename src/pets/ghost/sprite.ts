import type { AnimatedSprite } from "../types.js";
import { idle, palette } from "./sprite-data.js";
import { makeBlink, deriveStretch } from "../sprite-utils.js";

const deriveBlink = makeBlink(4, 2);

export const ghostLargeSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: deriveBlink(idle), palette },
    { pixels: idle, palette },
    { pixels: deriveStretch(idle), palette },
  ],
};
