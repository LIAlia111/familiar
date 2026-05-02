import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = { 1: [40, 15, 80], 2: [110, 55, 190], 3: [255, 200, 40], 4: [60, 210, 120], 5: [15, 15, 15] };
const _ = 0; const O = 1, D = 2, G = 3, E = 4, P = 5;

const idle: number[][] = [
  [G, _, _, _, _, _, _, G],
  [O, D, D, D, D, D, D, O],
  [O, D, E, P, P, E, D, O],
  [O, D, D, D, D, D, D, O],
  [O, D, D, D, D, D, D, O],
  [_, O, D, D, D, D, O, _],
  [_, _, O, D, D, O, _, _],
  [_, _, _, O, O, _, _, _],
];

const blink = idle;

export const dragonSmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
