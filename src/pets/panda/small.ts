import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = { 1: [15, 15, 15], 2: [245, 245, 245], 3: [80, 80, 80] };
const _ = 0; const Bk = 1, W = 2, Pn = 3;

const idle: number[][] = [
  [Bk, Bk, _, _, _, _, Bk, Bk],
  [Bk, W, W, W, W, W, W, Bk],
  [W, Bk, W, W, W, W, Bk, W],
  [W, W, W, W, W, W, W, W],
  [W, W, W, Pn, Pn, W, W, W],
  [Bk, W, W, W, W, W, W, Bk],
  [Bk, Bk, _, W, W, _, Bk, Bk],
  [_, _, _, _, _, _, _, _],
];

const blink = idle;

export const pandaSmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
