import type { AnimatedSprite, Palette } from "../types.js";

const palette: Palette = { 1: [180, 200, 255], 2: [220, 230, 255], 3: [255, 255, 255], 4: [40, 30, 80] };
const _ = 0; const B = 1, G = 2, H = 3, S = 4;

const idle: number[][] = [
  [_, B, B, B, B, B, B, _],
  [B, G, G, H, H, G, G, B],
  [B, G, S, G, G, S, G, B],
  [B, G, G, G, G, G, G, B],
  [B, G, G, G, G, G, G, B],
  [B, B, B, B, B, B, B, B],
  [B, _, B, _, B, _, B, _],
  [_, _, _, _, _, _, _, _],
];

const blink = idle;

export const ghostSmallSprite: AnimatedSprite = {
  frames: [
    { pixels: idle, palette },
    { pixels: blink, palette },
  ],
};
