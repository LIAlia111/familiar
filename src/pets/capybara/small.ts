import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = {
  1: [55, 30, 10],
  2: [140, 88, 42],
  3: [218, 170, 105],
  4: [15, 15, 15],
};
const _ = 0;
const O = 1;
const C = 2;
const L = 3;
const B = 4;

const idle: number[][] = [
  [_, O, O, _, _, _, O, O],
  [O, C, C, O, O, C, C, O],
  [O, C, L, L, L, L, C, O],
  [O, B, C, L, L, C, B, O],
  [O, C, L, L, L, L, C, O],
  [O, C, C, C, C, C, C, O],
  [_, O, C, C, C, C, O, _],
  [_, _, O, O, O, O, _, _],
];

const blink = idle.map((row, y) => (y === 3 ? [O, C, C, L, L, C, C, O] : row));

export const capybaraSmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
