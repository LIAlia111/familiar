import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = {
  1: [50, 25, 10],
  2: [210, 110, 35],
  4: [80, 200, 100],
  5: [20, 20, 20],
  7: [255, 255, 255],
};

const _ = 0;
const O = 1;
const C = 2;
const E = 4;
const P = 5;
const W = 7;

const idle: number[][] = [
  [_, O, _, _, _, _, O, _],
  [O, C, O, _, _, O, C, O],
  [O, C, C, C, C, C, C, O],
  [O, E, P, C, C, P, E, O],
  [O, C, C, W, W, C, C, O],
  [O, C, C, C, C, C, C, O],
  [_, O, C, C, C, C, O, _],
  [_, _, O, O, O, O, _, _],
];

const blink = idle.map((row, y) => (y === 3 ? [O, C, C, C, C, C, C, O] : row));

export const catSmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
