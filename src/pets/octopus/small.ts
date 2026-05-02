import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = { 1: [115, 18, 95], 2: [215, 75, 175], 3: [255, 255, 255], 4: [18, 18, 18] };
const _ = 0; const O = 1, K = 2, W = 3, P = 4;

const idle: number[][] = [
  [_, O, O, O, O, O, O, _],
  [O, K, K, K, K, K, K, O],
  [O, K, W, P, P, W, K, O],
  [O, K, K, K, K, K, K, O],
  [O, K, K, K, K, K, K, O],
  [_, O, K, K, K, K, O, _],
  [O, _, O, _, O, _, O, _],
  [_, _, _, _, _, _, _, _],
];

const blink = idle;

export const octopusSmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
